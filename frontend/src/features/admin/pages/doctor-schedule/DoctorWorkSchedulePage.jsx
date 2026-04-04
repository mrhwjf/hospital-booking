import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
	Alert,
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Segmented,
	Select,
	Space,
	Steps,
	Table,
	Tag,
	TimePicker,
	Tooltip,
	Typography,
	message,
} from 'antd'
import {
	CalendarOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	LeftOutlined,
	PlusOutlined,
	ReloadOutlined,
	RightOutlined,
	SearchOutlined,
} from '@ant-design/icons'
import {
	fetchAdminDoctors,
	fetchAdminRooms,
	fetchAssignedSchedules,
	fetchDoctorScheduleOverview,
	fetchWorkTemplates,
	getApiErrorMessage,
	submitCreateAssignment,
	submitCreateWorkTemplate,
	submitDeleteAssignedSchedule,
	submitDeleteWorkTemplate,
	submitPreviewAssignment,
	submitUpdateAssignedSchedule,
	submitUpdateWorkTemplate,
} from '../../../../Services/adminScheduleService'
import { fetchSpecialties } from '../../../../Services/schedulingService'
import WeeklyScheduleGrid from '../../components/WeeklyScheduleGrid'
import {
	ADMIN_MODAL_STYLES,
	ADMIN_SEGMENTED_STYLES,
	ADMIN_TABLE_STYLES,
} from '../../styles/const-styles'

const { Text, Title } = Typography

const DEFAULT_PAGE_SIZE = 10
const SHIFT_STATUS_OPTIONS = [
	{ label: 'Hoạt động', value: 'hoat_dong' },
	{ label: 'Tạm ngưng', value: 'tam_ngung' },
	{ label: 'Hủy', value: 'huy' },
]

const toMonday = (value = dayjs()) => {
	const dayIndex = value.day()
	const offset = dayIndex === 0 ? -6 : 1 - dayIndex
	return value.add(offset, 'day').startOf('day')
}

const formatStatusTag = (status) => {
	const map = {
		hoat_dong: { color: 'green', label: 'Hoạt động' },
		tam_ngung: { color: 'gold', label: 'Tạm ngưng' },
		huy: { color: 'red', label: 'Hủy' },
	}

	return map[status] || { color: 'default', label: status }
}

const buildTimeValue = (time) => {
	if (!time) {
		return null
	}

	return dayjs(`2000-01-01 ${String(time).slice(0, 8)}`)
}

const buildOverviewEvents = (overview) => {
	if (!overview) {
		return []
	}

	const shiftEvents = (overview.items || []).flatMap((item) => {
		const shift = item?.ca_lam_viec
		if (!shift?.gio_bat_dau || !shift?.gio_ket_thuc) {
			return []
		}

		const roomLabel = item?.phong_kham?.ten_phong || 'Chưa gán phòng'

		return [
			{
				id: `shift-${item.id}`,
				date: item.ngay_lam_viec,
				startTime: shift.gio_bat_dau,
				endTime: shift.gio_ket_thuc,
				title: shift.ten_ca || 'Ca làm việc',
				subtitle: roomLabel,
				type: 'shift',
			},
		]
	})

	const leaveEvents = (overview.ngay_nghi_bac_si || []).map((leave) => ({
		id: `leave-${leave.id}`,
		date: leave.ngay,
		startTime: leave.gio_bat_dau || '07:00:00',
		endTime: leave.gio_ket_thuc || '17:00:00',
		title: leave.gio_bat_dau && leave.gio_ket_thuc ? 'Nghỉ phép' : 'Nghỉ phép cả ngày',
		subtitle: leave.ly_do || 'Nghỉ theo điều phối',
		type: 'leave',
	}))

	const holidayEvents = (overview.ngay_nghi_le || []).map((holiday) => ({
		id: `holiday-${holiday.id}`,
		date: holiday.ngay,
		startTime: '07:00:00',
		endTime: '17:00:00',
		title: `Nghỉ lễ: ${holiday.ten_ngay_nghi}`,
		subtitle: 'Ngày nghỉ lễ toàn viện',
		type: 'leave',
	}))

	return [...shiftEvents, ...leaveEvents, ...holidayEvents]
}

const buildPreviewEvents = (previewItems, roomMap) => {
	const statusMeta = {
		se_tao: { type: 'shift', color: '#2563eb', titlePrefix: 'Sẽ tạo' },
		bo_qua: { type: 'skipped', color: '#94a3b8', titlePrefix: 'Bỏ qua' },
		chan: { type: 'blocked', color: '#dc2626', titlePrefix: 'Xung đột' },
	}

	return (previewItems || []).map((item) => {
		const meta = statusMeta[item.trang_thai_du_kien] || statusMeta.se_tao
		const room = roomMap.get(Number(item.phong_kham_id))

		return {
			id: item.candidate_key,
			date: item.ngay_lam_viec,
			startTime: item.gio_bat_dau,
			endTime: item.gio_ket_thuc,
			title: `${meta.titlePrefix}: ${item.ten_ca}`,
			subtitle: room ? `${room.ten_phong} (${room.ma_phong})` : item.thong_diep,
			type: meta.type,
			color: meta.color,
		}
	})
}

const groupEventsByWeek = (events) => {
	const groups = events.reduce((accumulator, event) => {
		const weekKey = toMonday(dayjs(event.date)).format('YYYY-MM-DD')
		if (!accumulator[weekKey]) {
			accumulator[weekKey] = []
		}

		accumulator[weekKey].push(event)
		return accumulator
	}, {})

	return Object.entries(groups)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([weekStart, items]) => ({ weekStart, items }))
}

const formatConflictType = (type) => {
	if (type === 'overlap_shift') {
		return 'Trùng ca bác sĩ'
	}

	if (type === 'room_conflict') {
		return 'Trùng phòng khám'
	}

	return type || 'Không xác định'
}

export default function DoctorWorkSchedulePage() {
	const [activeSegment, setActiveSegment] = useState('doctor-schedules')

	const [loadingSupport, setLoadingSupport] = useState(false)
	const [loadingDoctors, setLoadingDoctors] = useState(false)
	const [loadingOverview, setLoadingOverview] = useState(false)
	const [loadingAssignments, setLoadingAssignments] = useState(false)

	const [doctors, setDoctors] = useState([])
	const [rooms, setRooms] = useState([])
	const [templates, setTemplates] = useState([])
	const [specialties, setSpecialties] = useState([])

	const [selectedDoctorId, setSelectedDoctorId] = useState(null)
	const [weekStart, setWeekStart] = useState(toMonday(dayjs()))
	const [overview, setOverview] = useState(null)

	const [doctorFilterKeyword, setDoctorFilterKeyword] = useState('')
	const [doctorFilterSpecialty, setDoctorFilterSpecialty] = useState(undefined)
	const [appliedDoctorFilters, setAppliedDoctorFilters] = useState({ keyword: '', specialtyId: undefined })

	const [doctorPagination, setDoctorPagination] = useState({
		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE,
		totalItems: 0,
	})
	const [assignments, setAssignments] = useState([])
	const [assignmentPagination, setAssignmentPagination] = useState({
		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE,
		totalItems: 0,
	})

	const [templateModalOpen, setTemplateModalOpen] = useState(false)
	const [templateSubmitting, setTemplateSubmitting] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState(null)
	const [templateForm] = Form.useForm()

	const [assignModalOpen, setAssignModalOpen] = useState(false)
	const [assignSubmitting, setAssignSubmitting] = useState(false)
	const [previewData, setPreviewData] = useState(null)
	const [previewWeekIndex, setPreviewWeekIndex] = useState(0)
	const [assignForm] = Form.useForm()

	const [editAssignmentOpen, setEditAssignmentOpen] = useState(false)
	const [editAssignmentSubmitting, setEditAssignmentSubmitting] = useState(false)
	const [editingAssignment, setEditingAssignment] = useState(null)
	const [editAssignmentForm] = Form.useForm()

	const assignFormValues = Form.useWatch([], assignForm)

	const weekRange = useMemo(() => {
		const fromDate = weekStart.format('YYYY-MM-DD')
		const toDate = weekStart.add(6, 'day').format('YYYY-MM-DD')
		return { fromDate, toDate }
	}, [weekStart])

	const selectedDoctor = useMemo(
		() => doctors.find((doctor) => doctor.id === selectedDoctorId) || null,
		[doctors, selectedDoctorId],
	)

	const activeTemplateOptions = useMemo(
		() => templates.filter((template) => template.trang_thai !== 'huy'),
		[templates],
	)

	const roomOptions = useMemo(
		() => rooms.filter((room) => room.trang_thai === 'hoat_dong'),
		[rooms],
	)

	const roomMap = useMemo(() => {
		return new Map(roomOptions.map((room) => [Number(room.id), room]))
	}, [roomOptions])

	const specialtyOptions = useMemo(
		() => specialties.map((item) => ({ value: item.id, label: item.ten_chuyen_khoa })),
		[specialties],
	)

	const overviewEvents = useMemo(() => buildOverviewEvents(overview), [overview])

	const previewWeekGroups = useMemo(() => {
		const previewEvents = buildPreviewEvents(previewData?.preview_items || [], roomMap)
		return groupEventsByWeek(previewEvents)
	}, [previewData, roomMap])

	const activePreviewWeek = previewWeekGroups[previewWeekIndex] || null

	const canPreviewAssignment = useMemo(() => {
		const mauCa = assignFormValues?.mau_ca || []
		if (!selectedDoctorId || !assignFormValues?.tuan_bat_dau || !assignFormValues?.so_tuan_lap) {
			return false
		}

		if (!Array.isArray(mauCa) || mauCa.length === 0) {
			return false
		}

		return mauCa.every((item) => item?.lich_lam_viec_id && item?.phong_kham_id)
	}, [assignFormValues, selectedDoctorId])

	const loadSupportData = useCallback(async () => {
		setLoadingSupport(true)
		try {
			const [roomResult, templateResult, specialtyItems] = await Promise.all([
				fetchAdminRooms(),
				fetchWorkTemplates(),
				fetchSpecialties(),
			])

			setRooms(roomResult.items)
			setTemplates(templateResult.items)
			setSpecialties(specialtyItems)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải dữ liệu hỗ trợ.'))
		} finally {
			setLoadingSupport(false)
		}
	}, [])

	const loadDoctors = useCallback(
		async (page = 1, pageSize = DEFAULT_PAGE_SIZE, filters = appliedDoctorFilters) => {
			setLoadingDoctors(true)
			try {
				const result = await fetchAdminDoctors({
					page,
					pageSize,
					ten: filters.keyword || undefined,
					chuyen_khoa_id: filters.specialtyId || undefined,
				})

				setDoctors(result.items)
				if (result.pagination) {
					setDoctorPagination(result.pagination)
				} else {
					setDoctorPagination({
						currentPage: page,
						pageSize,
						totalItems: result.items.length,
					})
				}
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách bác sĩ.'))
			} finally {
				setLoadingDoctors(false)
			}
		},
		[appliedDoctorFilters],
	)

	const loadOverview = useCallback(async () => {
		if (!selectedDoctorId) {
			setOverview(null)
			return
		}

		setLoadingOverview(true)
		try {
			const data = await fetchDoctorScheduleOverview({
				doctorId: selectedDoctorId,
				fromDate: weekRange.fromDate,
				toDate: weekRange.toDate,
			})
			setOverview(data)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải tổng quan lịch làm việc.'))
		} finally {
			setLoadingOverview(false)
		}
	}, [selectedDoctorId, weekRange.fromDate, weekRange.toDate])

	const loadAssignments = useCallback(
		async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
			if (!selectedDoctorId) {
				setAssignments([])
				return
			}

			setLoadingAssignments(true)
			try {
				const result = await fetchAssignedSchedules({
					bacSiId: selectedDoctorId,
					fromDate: weekRange.fromDate,
					toDate: weekRange.toDate,
					page,
					pageSize,
				})

				setAssignments(result.items)
				if (result.pagination) {
					setAssignmentPagination(result.pagination)
				}
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách phân công ca.'))
			} finally {
				setLoadingAssignments(false)
			}
		},
		[selectedDoctorId, weekRange.fromDate, weekRange.toDate],
	)

	useEffect(() => {
		loadSupportData()
	}, [loadSupportData])

	useEffect(() => {
		loadDoctors(1, DEFAULT_PAGE_SIZE, appliedDoctorFilters)
	}, [loadDoctors, appliedDoctorFilters])

	useEffect(() => {
		if (!doctors.length) {
			setSelectedDoctorId(null)
			return
		}

		if (!selectedDoctorId || !doctors.some((doctor) => doctor.id === selectedDoctorId)) {
			setSelectedDoctorId(doctors[0].id)
		}
	}, [doctors, selectedDoctorId])

	useEffect(() => {
		if (!selectedDoctorId) {
			setOverview(null)
			setAssignments([])
			return
		}

		loadOverview()
		loadAssignments(1, assignmentPagination.pageSize)
	}, [selectedDoctorId, weekRange.fromDate, weekRange.toDate, loadOverview, loadAssignments, assignmentPagination.pageSize])

	useEffect(() => {
		setPreviewWeekIndex(0)
	}, [previewData])

	const openCreateTemplateModal = () => {
		setEditingTemplate(null)
		templateForm.resetFields()
		templateForm.setFieldsValue({
			thu_trong_tuan: 1,
			thoi_luong_kham: 60,
			trang_thai: 'hoat_dong',
		})
		setTemplateModalOpen(true)
	}

	const openEditTemplateModal = (template) => {
		setEditingTemplate(template)
		templateForm.setFieldsValue({
			ten_ca: template.ten_ca,
			thu_trong_tuan: template.thu_trong_tuan,
			gio_bat_dau: buildTimeValue(template.gio_bat_dau),
			gio_ket_thuc: buildTimeValue(template.gio_ket_thuc),
			thoi_luong_kham: template.thoi_luong_kham,
			ghi_chu: template.ghi_chu,
			trang_thai: template.trang_thai,
		})
		setTemplateModalOpen(true)
	}

	const handleSubmitTemplate = async () => {
		try {
			const values = await templateForm.validateFields()
			setTemplateSubmitting(true)

			const payload = {
				...values,
				gio_bat_dau: values.gio_bat_dau.format('HH:mm:ss'),
				gio_ket_thuc: values.gio_ket_thuc.format('HH:mm:ss'),
			}

			if (editingTemplate) {
				await submitUpdateWorkTemplate(editingTemplate.id, payload)
				message.success('Cập nhật mẫu ca thành công.')
			} else {
				await submitCreateWorkTemplate(payload)
				message.success('Tạo mẫu ca thành công.')
			}

			setTemplateModalOpen(false)
			setEditingTemplate(null)
			await loadSupportData()
		} catch (error) {
			if (error?.errorFields) {
				return
			}

			message.error(getApiErrorMessage(error, 'Không thể lưu mẫu ca làm việc.'))
		} finally {
			setTemplateSubmitting(false)
		}
	}

	const handleDeleteTemplate = async (templateId) => {
		try {
			await submitDeleteWorkTemplate(templateId)
			message.success('Hủy mẫu ca thành công.')
			await loadSupportData()
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể hủy mẫu ca.'))
		}
	}

	const openAssignModal = () => {
		if (!selectedDoctorId) {
			message.warning('Vui lòng chọn bác sĩ trước khi gán mẫu ca.')
			return
		}

		assignForm.setFieldsValue({
			tuan_bat_dau: weekStart,
			so_tuan_lap: 1,
			mau_ca: [{ lich_lam_viec_id: undefined, phong_kham_id: undefined, ghi_chu: '' }],
		})
		setPreviewData(null)
		setPreviewWeekIndex(0)
		setAssignModalOpen(true)
	}

	const buildAssignmentPayload = (values) => {
		return {
			bac_si_id: selectedDoctorId,
			tuan_bat_dau: values.tuan_bat_dau.format('YYYY-MM-DD'),
			so_tuan_lap: values.so_tuan_lap,
			mau_ca: (values.mau_ca || []).map((item) => ({
				lich_lam_viec_id: item.lich_lam_viec_id,
				phong_kham_id: item.phong_kham_id,
				ghi_chu: item.ghi_chu || null,
			})),
		}
	}

	const handlePreviewAssignment = async () => {
		if (!canPreviewAssignment) {
			message.warning('Vui lòng chọn đủ bác sĩ, tuần bắt đầu, số tuần, mẫu ca và phòng khám trước khi kiểm tra xung đột.')
			return
		}

		try {
			const values = await assignForm.validateFields()
			const result = await submitPreviewAssignment(buildAssignmentPayload(values))
			setPreviewData(result)
			setPreviewWeekIndex(0)
			message.success('Kiểm tra xung đột thành công.')
		} catch (error) {
			if (error?.errorFields) {
				return
			}

			message.error(getApiErrorMessage(error, 'Không thể kiểm tra xung đột phân công ca.'))
		}
	}

	const handleSubmitAssignment = async () => {
		try {
			const values = await assignForm.validateFields()
			setAssignSubmitting(true)

			const response = await submitCreateAssignment(buildAssignmentPayload(values))
			const createdCount = response?.data?.created_count || 0
			const skippedCount = response?.data?.skipped_count || 0
			message.success(`Phân công thành công: tạo ${createdCount} ca, bỏ qua ${skippedCount} ca.`)

			setAssignModalOpen(false)
			setPreviewData(null)
			await loadOverview()
			await loadAssignments(assignmentPagination.currentPage, assignmentPagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể lưu phân công ca.'))
		} finally {
			setAssignSubmitting(false)
		}
	}

	const openEditAssignmentModal = (assignment) => {
		setEditingAssignment(assignment)
		editAssignmentForm.setFieldsValue({
			phong_kham_id: assignment.phong_kham_id || undefined,
			ghi_chu: assignment.ghi_chu || '',
		})
		setEditAssignmentOpen(true)
	}

	const handleSubmitEditAssignment = async () => {
		try {
			const values = await editAssignmentForm.validateFields()
			setEditAssignmentSubmitting(true)

			await submitUpdateAssignedSchedule(editingAssignment.id, {
				phong_kham_id: values.phong_kham_id || null,
				ghi_chu: values.ghi_chu || null,
			})

			message.success('Cập nhật ca đã phân công thành công.')
			setEditAssignmentOpen(false)
			setEditingAssignment(null)
			await loadOverview()
			await loadAssignments(assignmentPagination.currentPage, assignmentPagination.pageSize)
		} catch (error) {
			if (error?.errorFields) {
				return
			}

			message.error(getApiErrorMessage(error, 'Không thể cập nhật ca đã phân công.'))
		} finally {
			setEditAssignmentSubmitting(false)
		}
	}

	const handleDeleteAssignment = async (assignmentId) => {
		try {
			await submitDeleteAssignedSchedule(assignmentId)
			message.success('Hủy ca đã phân công thành công.')
			await loadOverview()
			await loadAssignments(assignmentPagination.currentPage, assignmentPagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể hủy ca đã phân công.'))
		}
	}

	const handleApplyDoctorFilters = () => {
		setAppliedDoctorFilters({
			keyword: doctorFilterKeyword.trim(),
			specialtyId: doctorFilterSpecialty || undefined,
		})
	}

	const handleResetDoctorFilters = () => {
		setDoctorFilterKeyword('')
		setDoctorFilterSpecialty(undefined)
		setAppliedDoctorFilters({ keyword: '', specialtyId: undefined })
	}

	const handleReloadAll = async () => {
		await loadSupportData()
		await loadDoctors(doctorPagination.currentPage, doctorPagination.pageSize)
		await loadOverview()
		await loadAssignments(assignmentPagination.currentPage, assignmentPagination.pageSize)
	}

	const doctorColumns = [
		{
			title: 'Bác sĩ',
			dataIndex: 'ho_ten',
			key: 'ho_ten',
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Text strong>{record.ho_ten}</Text>
					<Text type="secondary">{record.ma_bac_si}</Text>
				</Space>
			),
		},
		{ title: 'Học vị', dataIndex: 'hoc_vi', key: 'hoc_vi' },
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			render: (value) => {
				const tag = formatStatusTag(value)
				return <Tag color={tag.color}>{tag.label}</Tag>
			},
		},
	]

	const assignmentColumns = [
		{
			title: 'Ngày',
			dataIndex: 'ngay_lam_viec',
			key: 'ngay_lam_viec',
		},
		{
			title: 'Ca',
			key: 'ca_lam_viec',
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Text strong>{record?.ca_lam_viec?.ten_ca}</Text>
					<Text type="secondary">
						{String(record?.ca_lam_viec?.gio_bat_dau || '').slice(0, 5)} -{' '}
						{String(record?.ca_lam_viec?.gio_ket_thuc || '').slice(0, 5)}
					</Text>
				</Space>
			),
		},
		{
			title: 'Phòng khám',
			key: 'phong_kham',
			render: (_, record) => record?.phong_kham?.ten_phong || '-',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			render: (value) => {
				const tag = formatStatusTag(value)
				return <Tag color={tag.color}>{tag.label}</Tag>
			},
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Tooltip title="Cập nhật ca đã phân công">
						<Button icon={<EditOutlined />} onClick={() => openEditAssignmentModal(record)} />
					</Tooltip>
					<Popconfirm
						title="Hủy ca đã phân công"
						description="Bạn có chắc chắn muốn hủy ca này?"
						onConfirm={() => handleDeleteAssignment(record.id)}
						okText="Đồng ý"
						cancelText="Bỏ qua"
					>
						<Tooltip title="Hủy ca">
							<Button danger icon={<DeleteOutlined />} />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	]

	const templateColumns = [
		{ title: 'Mã ca', dataIndex: 'ma_ca', key: 'ma_ca' },
		{ title: 'Tên ca', dataIndex: 'ten_ca', key: 'ten_ca' },
		{ title: 'Thứ', dataIndex: 'thu_trong_tuan', key: 'thu_trong_tuan' },
		{
			title: 'Giờ',
			key: 'gio',
			render: (_, record) => (
				<>{String(record.gio_bat_dau || '').slice(0, 5)} - {String(record.gio_ket_thuc || '').slice(0, 5)}</>
			),
		},
		{
			title: 'Thời lượng',
			dataIndex: 'thoi_luong_kham',
			key: 'thoi_luong_kham',
			render: (value) => `${value} phút`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			render: (value) => {
				const tag = formatStatusTag(value)
				return <Tag color={tag.color}>{tag.label}</Tag>
			},
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => openEditTemplateModal(record)} />
					<Popconfirm
						title="Hủy mẫu ca"
						description="Bạn có chắc chắn muốn hủy mẫu ca này?"
						onConfirm={() => handleDeleteTemplate(record.id)}
						okText="Đồng ý"
						cancelText="Bỏ qua"
					>
						<Button danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	]

	return (
		<Space direction="vertical" size={16} className="w-full">
			<Card className="border-[#E2E8F0]">
				<Space align="center" wrap className="w-full justify-between">
					<Title level={4} style={{ marginBottom: 0 }}>Quản lý lịch làm việc bác sĩ</Title>
					<Space wrap>
						<Button icon={<ReloadOutlined />} onClick={handleReloadAll} loading={loadingSupport || loadingDoctors}>
							Tải lại dữ liệu
						</Button>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreateTemplateModal}>
							Tạo mẫu ca
						</Button>
						<Button icon={<CalendarOutlined />} onClick={openAssignModal} disabled={!selectedDoctorId}>
							Gán mẫu ca
						</Button>
					</Space>
				</Space>
				<div className="mt-4">
					<Segmented
						value={activeSegment}
						onChange={setActiveSegment}
						className={ADMIN_SEGMENTED_STYLES}
						options={[
							{ label: 'Lịch làm việc của bác sĩ', value: 'doctor-schedules' },
							{ label: 'Mẫu lịch làm việc', value: 'templates' },
						]}
					/>
				</div>
			</Card>

			{activeSegment === 'doctor-schedules' && (
				<>
					<Card className="border-[#E2E8F0]" loading={loadingDoctors}>
						<Row gutter={12}>
							<Col xs={24} md={10}>
								<Input
									placeholder="Tìm theo tên hoặc mã bác sĩ"
									value={doctorFilterKeyword}
									onChange={(event) => setDoctorFilterKeyword(event.target.value)}
								/>
							</Col>
							<Col xs={24} md={8}>
								<Select
									allowClear
									showSearch
									placeholder="Lọc theo chuyên khoa"
									optionFilterProp="label"
									options={specialtyOptions}
									value={doctorFilterSpecialty}
									onChange={setDoctorFilterSpecialty}
									className="w-full"
								/>
							</Col>
							<Col xs={24} md={6}>
								<Space className="w-full" orientation="horizontal">
									<Button icon={<SearchOutlined />} type="primary" onClick={handleApplyDoctorFilters}>
										Áp dụng
									</Button>
									<Button onClick={handleResetDoctorFilters}>Đặt lại</Button>
								</Space>
							</Col>
						</Row>
					</Card>

					<Row gutter={16}>
						<Col xs={24} lg={9}>
							<Card title="Danh sách bác sĩ" className="border-[#E2E8F0]" loading={loadingDoctors}>
								<Table
									rowKey="id"
									columns={doctorColumns}
									dataSource={doctors}
									size="small"
									scroll={{ x: 'max-content', y: 420 }}
									className={ADMIN_TABLE_STYLES.header}
									pagination={{
										current: doctorPagination.currentPage,
										pageSize: doctorPagination.pageSize,
										total: doctorPagination.totalItems,
										showSizeChanger: true,
										onChange: (page, pageSize) => loadDoctors(page, pageSize),
									}}
									onRow={(record) => ({
										onClick: () => setSelectedDoctorId(record.id),
										className: selectedDoctorId === record.id ? 'bg-emerald-100 cursor-pointer' : 'cursor-pointer',
									})}
								/>
							</Card>
						</Col>

						<Col xs={24} lg={15}>
							<Card className="border-[#E2E8F0]" loading={loadingOverview || loadingAssignments}>
								<Space orientation="vertical" size={12} className="w-full">
									<Space align="center" wrap className="w-full justify-between">
										<Space orientation="vertical" size={0}>
											<Text type="secondary">Bác sĩ đang xem</Text>
											<Text strong>{selectedDoctor?.ho_ten || 'Chưa chọn bác sĩ'}</Text>
										</Space>
										<Space>
											<Button onClick={() => setWeekStart((prev) => prev.subtract(7, 'day'))}>Tuần trước</Button>
											<Button onClick={() => setWeekStart(toMonday(dayjs()))}>Tuần này</Button>
											<Button onClick={() => setWeekStart((prev) => prev.add(7, 'day'))}>Tuần sau</Button>
											<DatePicker
												picker="week"
												value={weekStart}
												onChange={(value) => setWeekStart(toMonday(value || dayjs()))}
											/>
										</Space>
									</Space>

									<Text type="secondary">
										Phạm vi: {weekRange.fromDate} đến {weekRange.toDate}
									</Text>

									<WeeklyScheduleGrid
										weekStart={weekStart}
										events={overviewEvents}
										emptyText="Tuần này chưa có dữ liệu ca làm việc/nghỉ."
									/>

									<Table
										rowKey="id"
										columns={assignmentColumns}
										dataSource={assignments}
										scroll={{ x: 'max-content' }}
										className={ADMIN_TABLE_STYLES.header}
										pagination={{
											current: assignmentPagination.currentPage,
											pageSize: assignmentPagination.pageSize,
											total: assignmentPagination.totalItems,
											onChange: (page, pageSize) => loadAssignments(page, pageSize),
										}}
									/>
								</Space>
							</Card>
						</Col>
					</Row>
				</>
			)}

			{activeSegment === 'templates' && (
				<Card title="Danh sách mẫu ca" className="border-[#E2E8F0]" loading={loadingSupport}>
					<Table
						rowKey="id"
						columns={templateColumns}
						dataSource={templates}
						scroll={{ x: 'max-content' }}
						className={ADMIN_TABLE_STYLES.header}
						pagination={{ pageSize: 8 }}
					/>
				</Card>
			)}

			<Modal
				title={editingTemplate ? 'Cập nhật mẫu ca' : 'Tạo mẫu ca'}
				open={templateModalOpen}
				onCancel={() => {
					setTemplateModalOpen(false)
					setEditingTemplate(null)
				}}
				onOk={handleSubmitTemplate}
				confirmLoading={templateSubmitting}
				width={760}
				styles={ADMIN_MODAL_STYLES}
				destroyOnHidden
				centered
			>
				<Form layout="vertical" form={templateForm}>
					{editingTemplate && (
						<Form.Item label="Mã ca">
							<Input value={editingTemplate.ma_ca} disabled />
						</Form.Item>
					)}

					<Form.Item name="ten_ca" label="Tên ca" rules={[{ required: true, message: 'Nhập tên ca' }]}>
						<Input />
					</Form.Item>

					<Row gutter={12}>
						<Col xs={24} md={8}>
							<Form.Item name="thu_trong_tuan" label="Thứ trong tuần" rules={[{ required: true }]}>
								<Select
									options={[
										{ label: 'Thứ 2', value: 1 },
										{ label: 'Thứ 3', value: 2 },
										{ label: 'Thứ 4', value: 3 },
										{ label: 'Thứ 5', value: 4 },
										{ label: 'Thứ 6', value: 5 },
										{ label: 'Thứ 7', value: 6 },
										{ label: 'Chủ nhật', value: 7 },
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name="gio_bat_dau" label="Giờ bắt đầu" rules={[{ required: true }]}>
								<TimePicker className="w-full" format="HH:mm:ss" />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name="gio_ket_thuc" label="Giờ kết thúc" rules={[{ required: true }]}>
								<TimePicker className="w-full" format="HH:mm:ss" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={12}>
						<Col xs={24} md={12}>
							<Form.Item name="thoi_luong_kham" label="Thời lượng khám (phút)" rules={[{ required: true }]}>
								<InputNumber min={1} className="w-full" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="trang_thai" label="Trạng thái" rules={[{ required: true }]}>
								<Select options={SHIFT_STATUS_OPTIONS} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name="ghi_chu" label="Ghi chú">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Gán mẫu ca cho bác sĩ"
				open={assignModalOpen}
				onCancel={() => setAssignModalOpen(false)}
				onOk={handleSubmitAssignment}
				confirmLoading={assignSubmitting}
				okText="Lưu phân công"
				cancelText="Đóng"
				width={1080}
				destroyOnHidden
				centered
				styles={ADMIN_MODAL_STYLES}
				bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
				footer={[
					<Button key="cancel" onClick={() => setAssignModalOpen(false)}>Đóng</Button>,
					<Button key="preview" icon={<EyeOutlined />} onClick={handlePreviewAssignment} disabled={!canPreviewAssignment}>
						Kiểm tra xung đột
					</Button>,
					<Button key="save" type="primary" loading={assignSubmitting} onClick={handleSubmitAssignment}>
						Lưu phân công
					</Button>,
				]}
			>
				<Space direction="vertical" size={16} className="w-full">
					<Steps
						size="small"
						current={1}
						items={[
							{ title: 'Chọn mẫu ca và phòng' },
							{ title: 'Kiểm tra xung đột' },
							{ title: 'Lưu phân công' },
						]}
					/>

					<Form form={assignForm} layout="vertical">
						<Row gutter={12}>
							<Col xs={24} md={12}>
								<Form.Item name="tuan_bat_dau" label="Tuần bắt đầu" rules={[{ required: true }]}>
									<DatePicker className="w-full" format="YYYY-MM-DD" />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name="so_tuan_lap" label="Số tuần áp dụng" rules={[{ required: true }]}>
									<InputNumber min={1} max={4} className="w-full" />
								</Form.Item>
							</Col>
						</Row>

						<Form.List name="mau_ca">
							{(fields, { add, remove }) => (
								<Space direction="vertical" className="w-full" size={12}>
									{fields.map((field) => (
										<Row key={field.key} gutter={8} align="middle">
											<Col xs={24} md={9}>
												<Form.Item
													name={[field.name, 'lich_lam_viec_id']}
													label={field.name === 0 ? 'Mẫu ca' : ''}
													rules={[{ required: true, message: 'Chọn mẫu ca' }]}
												>
													<Select
														showSearch
														placeholder="Chọn mẫu ca"
														optionFilterProp="label"
														options={activeTemplateOptions.map((item) => ({
															label: `${item.ten_ca} (${String(item.gio_bat_dau).slice(0, 5)}-${String(item.gio_ket_thuc).slice(0, 5)})`,
															value: item.id,
														}))}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} md={7}>
												<Form.Item
													name={[field.name, 'phong_kham_id']}
													label={field.name === 0 ? 'Phòng khám' : ''}
													rules={[{ required: true, message: 'Chọn phòng khám' }]}
												>
													<Select
														showSearch
														placeholder="Chọn phòng"
														optionFilterProp="label"
														options={roomOptions.map((room) => ({
															label: `${room.ten_phong} (${room.ma_phong})`,
															value: room.id,
														}))}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} md={6}>
												<Form.Item name={[field.name, 'ghi_chu']} label={field.name === 0 ? 'Ghi chú' : ''}>
													<Input placeholder="Ghi chú" />
												</Form.Item>
											</Col>
											<Col xs={24} md={2}>
												{fields.length > 1 && (
													<Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
												)}
											</Col>
										</Row>
									))}
									<Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
										Thêm dòng mẫu ca
									</Button>
								</Space>
							)}
						</Form.List>
					</Form>

					{previewData && (
						<Space direction="vertical" className="w-full">
							<Alert
								showIcon
								type={previewData.blocking_conflicts?.length ? 'warning' : 'success'}
								message={`Tổng kết: tạo được ${previewData.summary?.shifts_creatable || 0} ca, bỏ qua ${previewData.summary?.shifts_skipped || 0} ca, xung đột ${previewData.summary?.shifts_blocked || 0} ca.`}
							/>

							{previewData.blocking_conflicts?.length > 0 && (
								<Card size="small" title="Chi tiết xung đột">
									<ul className="m-0 list-disc space-y-3 pl-5">
										{previewData.blocking_conflicts.map((conflict) => (
											<li key={conflict.candidate_key}>
												<div>
													<strong>{conflict.ngay_lam_viec}</strong>
													{' '}
													({String(conflict?.khung_gio?.gio_bat_dau || '').slice(0, 5)} - {String(conflict?.khung_gio?.gio_ket_thuc || '').slice(0, 5)})
												</div>
												<div>Loại: {formatConflictType(conflict.loai)}</div>
												<div>{conflict.thong_diep}</div>
												{Array.isArray(conflict.bac_si_xung_dot) && conflict.bac_si_xung_dot.length > 0 && (
													<div>
														Bác sĩ liên quan: {conflict.bac_si_xung_dot.map((item) => item?.ho_ten).filter(Boolean).join(', ') || '-'}
													</div>
												)}
												{Array.isArray(conflict.phong_kham_xung_dot) && conflict.phong_kham_xung_dot.length > 0 && (
													<div>
														Phòng liên quan: {conflict.phong_kham_xung_dot.map((item) => item?.ten_phong).filter(Boolean).join(', ') || '-'}
													</div>
												)}
											</li>
										))}
									</ul>
								</Card>
							)}

							{previewWeekGroups.length > 0 && activePreviewWeek && (
								<Card
									size="small"
									title={`Xem trước tuần ${dayjs(activePreviewWeek.weekStart).format('DD/MM/YYYY')}`}
									extra={(
										<Space>
											<Button
												icon={<LeftOutlined />}
												disabled={previewWeekIndex === 0}
												onClick={() => setPreviewWeekIndex((index) => Math.max(index - 1, 0))}
											>
												Tuần trước
											</Button>
											<Text type="secondary">
												Tuần {previewWeekIndex + 1}/{previewWeekGroups.length}
											</Text>
											<Button
												icon={<RightOutlined />}
												disabled={previewWeekIndex >= previewWeekGroups.length - 1}
												onClick={() => setPreviewWeekIndex((index) => Math.min(index + 1, previewWeekGroups.length - 1))}
											>
												Tuần sau
											</Button>
										</Space>
									)}
								>
									<WeeklyScheduleGrid
										weekStart={dayjs(activePreviewWeek.weekStart)}
										events={activePreviewWeek.items}
										emptyText="Không có ca trong tuần xem trước này."
									/>
								</Card>
							)}
						</Space>
					)}
				</Space>
			</Modal>

			<Modal
				title="Cập nhật ca đã phân công"
				open={editAssignmentOpen}
				onCancel={() => setEditAssignmentOpen(false)}
				onOk={handleSubmitEditAssignment}
				confirmLoading={editAssignmentSubmitting}
				styles={ADMIN_MODAL_STYLES}
				destroyOnHidden
				centered
			>
				<Form layout="vertical" form={editAssignmentForm}>
					<Form.Item name="phong_kham_id" label="Phòng khám" rules={[{ required: true, message: 'Chọn phòng khám' }]}>
						<Select
							showSearch
							placeholder="Chọn phòng khám"
							optionFilterProp="label"
							options={roomOptions.map((room) => ({ label: `${room.ten_phong} (${room.ma_phong})`, value: room.id }))}
						/>
					</Form.Item>
					<Form.Item name="ghi_chu" label="Ghi chú">
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	)
}
