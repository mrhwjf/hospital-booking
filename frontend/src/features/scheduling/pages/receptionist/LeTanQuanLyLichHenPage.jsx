import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
	Alert,
	Badge,
	Button,
	Card,
	DatePicker,
	Input,
	Modal,
	Select,
	Segmented,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
	message,
	Form,
} from 'antd'
import { EditOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import AppointmentDetails from '../../components/AppointmentDetails'
import CalendarPicker from '../../components/CalendarPicker'
import DoiLichForm from '../../components/DoiLichForm'
import PatientDetailModal from '../../components/PatientDetailModal'
import ServicePicker from '../../components/ServicePicker'
import {
	fetchCancellationReasons,
	fetchDoctorSchedule,
	fetchDoctorsBySpecialty,
	fetchPatients,
	fetchReceptionistAppointments,
	fetchServicesAndPackages,
	fetchSpecialties,
	getApiErrorMessage,
	submitAppointmentBooking,
	submitCancelAppointment,
	submitCheckInAppointment,
	submitCreatePatient,
	submitRescheduleAppointment,
} from '../../../../services/schedulingService'
import { MODAL_STYLES, SEGMENTED_STYLES, TABLE_STYLES } from '../../styles/const-styles'

const { Paragraph, Text, Title } = Typography
const DEFAULT_PAGE_SIZE = 10
const MOCK_NGUOI_TAO_ID = 1
const MOCK_NGUOI_TIEP_NHAN_ID = 1
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const appointmentStatusMeta = {
	dang_cho: { label: 'Đang chờ', color: 'gold' },
	da_thanh_toan: { label: 'Đã thanh toán', color: 'blue' },
	da_xac_nhan: { label: 'Đã xác nhận', color: 'cyan' },
	da_hoan_tat: { label: 'Đã hoàn tất', color: 'green' },
	da_huy: { label: 'Đã hủy', color: 'red' },
	khong_den: { label: 'Không đến', color: 'orange' },
}

const formatTimeLabel = (timeString) => String(timeString || '').slice(0, 5)

const formatCurrency = (value) =>
	Number(value || 0).toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	})

export default function LeTanQuanLyLichHenPage() {
	const [loading, setLoading] = useState(false)
	const [appointments, setAppointments] = useState([])
	const [pagination, setPagination] = useState({ currentPage: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: 0 })
	const [activeTable, setActiveTable] = useState('appointments')
	const [keyword, setKeyword] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [viewMode, setViewMode] = useState('sap-toi')

	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
	const [cancelingAppointment, setCancelingAppointment] = useState(null)
	const [reschedulingAppointment, setReschedulingAppointment] = useState(null)
	const [checkingInAppointment, setCheckingInAppointment] = useState(null)
	const [isCancelSubmitting, setIsCancelSubmitting] = useState(false)
	const [isRescheduleSubmitting, setIsRescheduleSubmitting] = useState(false)
	const [isCheckInSubmitting, setIsCheckInSubmitting] = useState(false)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	const [isPatientCreateModalOpen, setIsPatientCreateModalOpen] = useState(false)
	const [isCreatingPatient, setIsCreatingPatient] = useState(false)

	const [cancelReasons, setCancelReasons] = useState([])
	const [lyDoHuyId, setLyDoHuyId] = useState(null)
	const [lyDoHuyKhac, setLyDoHuyKhac] = useState('')

	const [patients, setPatients] = useState([])
	const [loadingPatients, setLoadingPatients] = useState(false)
	const [patientPagination, setPatientPagination] = useState({ currentPage: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: 0 })
	const [patientSearch, setPatientSearch] = useState('')
	const [patientGenderFilter, setPatientGenderFilter] = useState('')
	const [patientBloodFilter, setPatientBloodFilter] = useState('')
	const [selectedPatient, setSelectedPatient] = useState(null)
	const [createPatientForm, setCreatePatientForm] = useState({
		ho_ten: '',
		ngay_sinh: '',
		gioi_tinh: 'nam',
		so_dien_thoai: '',
		email: '',
		so_cccd: '',
		dia_chi: '',
		nguoi_lien_he: '',
		sdt_nguoi_lien_he: '',
		nhom_mau: null,
		tien_su_di_ung: '',
		tien_su_benh: '',
		ghi_chu: '',
	})
	const [specialties, setSpecialties] = useState([])
	const [doctors, setDoctors] = useState([])
	const [loadingDoctors, setLoadingDoctors] = useState(false)
	const [services, setServices] = useState([])
	const [packages, setPackages] = useState([])
	const [loadingItems, setLoadingItems] = useState(false)
	const [scheduleItems, setScheduleItems] = useState([])
	const [loadingSchedule, setLoadingSchedule] = useState(false)
	const [calendarSlots, setCalendarSlots] = useState([])

	const [createForm, setCreateForm] = useState({
		benh_nhan_id: null,
		chuyen_khoa_id: null,
		bac_si_id: null,
		ngay_hen: null,
		khung_gio_id: null,
		ly_do_kham: '',
		ghi_chu: '',
		items: { dich_vu: {}, goi_kham: {} },
	})

	const selectedAppointment = useMemo(
		() => appointments.find((item) => item.id === selectedAppointmentId) || null,
		[appointments, selectedAppointmentId],
	)

	const selectedPatientForBooking = useMemo(
		() => patients.find((item) => item.id === createForm.benh_nhan_id) || null,
		[patients, createForm.benh_nhan_id],
	)

	const selectedSlot = useMemo(
		() => calendarSlots.find((slot) => String(slot.slot_key) === String(createForm.khung_gio_id)),
		[calendarSlots, createForm.khung_gio_id],
	)

	const selectedRows = useMemo(() => {
		const serviceRows = Object.entries(createForm.items.dich_vu || {}).map(([id, qty]) => {
			const item = services.find((service) => service.id === Number(id))
			return { type: 'Dịch vụ', name: item?.ten_dich_vu || '-', qty, unitPrice: item?.gia_dich_vu || 0 }
		})

		const packageRows = Object.entries(createForm.items.goi_kham || {}).map(([id, qty]) => {
			const item = packages.find((pkg) => pkg.id === Number(id))
			return { type: 'Gói khám', name: item?.ten_goi_kham || '-', qty, unitPrice: item?.gia_goi_kham || 0 }
		})

		return [...serviceRows, ...packageRows]
	}, [createForm.items.dich_vu, createForm.items.goi_kham, services, packages])

	const loadAppointments = useCallback(async (nextPage = 1, nextPageSize = DEFAULT_PAGE_SIZE) => {
		setLoading(true)
		try {
			const tuNgay = viewMode === 'sap-toi' ? dayjs().format('YYYY-MM-DD') : dayjs().subtract(365, 'day').format('YYYY-MM-DD')
			const denNgay = viewMode === 'sap-toi' ? dayjs().add(30, 'day').format('YYYY-MM-DD') : dayjs().add(365, 'day').format('YYYY-MM-DD')

			const result = await fetchReceptionistAppointments({
				page: nextPage,
				pageSize: nextPageSize,
				q: keyword,
				trangThai: statusFilter || undefined,
				tuNgay: tuNgay,
				denNgay: denNgay,
			})

			setAppointments(result.items)
			if (result.pagination) {
				setPagination(result.pagination)
			}
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải danh sách lịch hẹn.'))
		} finally {
			setLoading(false)
		}
	}, [keyword, statusFilter, viewMode])

	useEffect(() => {
		loadAppointments(1, pagination.pageSize)
	}, [loadAppointments, pagination.pageSize])

	useEffect(() => {
		const loadCancelReasons = async () => {
			try {
				const items = await fetchCancellationReasons()
				setCancelReasons(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải lý do hủy.'))
			}
		}

		loadCancelReasons()
	}, [])

	useEffect(() => {
		const loadSpecialties = async () => {
			try {
				const items = await fetchSpecialties()
				setSpecialties(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải chuyên khoa.'))
			}
		}

		loadSpecialties()
	}, [])

	useEffect(() => {
		if (!createForm.chuyen_khoa_id) {
			setDoctors([])
			setServices([])
			setPackages([])
			return
		}

		const loadDoctorsAndItems = async () => {
			setLoadingDoctors(true)
			setLoadingItems(true)
			try {
				const [doctorItems, itemData] = await Promise.all([
					fetchDoctorsBySpecialty({ chuyenKhoaId: createForm.chuyen_khoa_id }),
					fetchServicesAndPackages({ chuyenKhoaId: createForm.chuyen_khoa_id }),
				])

				setDoctors(doctorItems)
				setServices(itemData.services)
				setPackages(itemData.packages)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải bác sĩ/dịch vụ/gói khám.'))
			} finally {
				setLoadingDoctors(false)
				setLoadingItems(false)
			}
		}

		loadDoctorsAndItems()
	}, [createForm.chuyen_khoa_id])

	useEffect(() => {
		if (!createForm.bac_si_id) {
			setScheduleItems([])
			return
		}

		const loadSchedule = async () => {
			setLoadingSchedule(true)
			try {
				const items = await fetchDoctorSchedule({ bacSiId: createForm.bac_si_id })
				setScheduleItems(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải lịch làm việc bác sĩ.'))
			} finally {
				setLoadingSchedule(false)
			}
		}

		loadSchedule()
	}, [createForm.bac_si_id])

	const loadPatients = useCallback(async (nextPage = 1, nextPageSize = DEFAULT_PAGE_SIZE, nextSearch = '') => {
		setLoadingPatients(true)
		try {
			const result = await fetchPatients({
				q: nextSearch,
				page: nextPage,
				pageSize: nextPageSize,
			})
			setPatients(result.items)
			if (result.pagination) {
				setPatientPagination(result.pagination)
			}
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải danh sách bệnh nhân.'))
		} finally {
			setLoadingPatients(false)
		}
	}, [])

	useEffect(() => {
		if (activeTable !== 'patients') {
			return
		}

		loadPatients(1, patientPagination.pageSize, patientSearch)
	}, [activeTable, loadPatients, patientPagination.pageSize, patientSearch])

	const buildCreatePayload = () => {
		const items = [
			...Object.entries(createForm.items.dich_vu || {}).map(([id, so_luong]) => ({
				dich_vu_id: Number(id),
				so_luong,
			})),
			...Object.entries(createForm.items.goi_kham || {}).map(([id, so_luong]) => ({
				goi_kham_id: Number(id),
				so_luong,
			})),
		]

		const payload = {
			benh_nhan_id: createForm.benh_nhan_id,
			chuyen_khoa_id: createForm.chuyen_khoa_id,
			bac_si_id: createForm.bac_si_id,
			nguoi_tao_id: MOCK_NGUOI_TAO_ID,
			ngay_hen: createForm.ngay_hen,
			ly_do_kham: createForm.ly_do_kham,
			ghi_chu: createForm.ghi_chu,
			items,
		}

		if (selectedSlot?.id) {
			payload.khung_gio_id = selectedSlot.id
		} else {
			payload.lich_lam_viec_bac_si_id = selectedSlot?.lich_lam_viec_bac_si_id
			payload.gio_bat_dau = selectedSlot?.gio_bat_dau
			payload.gio_ket_thuc = selectedSlot?.gio_ket_thuc
		}

		return payload
	}

	const handleCreateBooking = async () => {
		if (!createForm.benh_nhan_id || !createForm.chuyen_khoa_id || !createForm.bac_si_id || !createForm.ngay_hen || !createForm.khung_gio_id) {
			message.warning('Vui lòng chọn đủ bệnh nhân, chuyên khoa, bác sĩ và khung giờ.')
			return
		}

		if (!createForm.ly_do_kham.trim()) {
			message.warning('Vui lòng nhập lý do khám.')
			return
		}

		if (selectedRows.length === 0) {
			message.warning('Vui lòng chọn ít nhất 1 dịch vụ/gói khám.')
			return
		}

		setIsCreating(true)
		try {
			await submitAppointmentBooking(buildCreatePayload())
			message.success('Tạo lịch hẹn thành công.')
			setIsCreateModalOpen(false)
			setCreateForm({
				benh_nhan_id: null,
				chuyen_khoa_id: null,
				bac_si_id: null,
				ngay_hen: null,
				khung_gio_id: null,
				ly_do_kham: '',
				ghi_chu: '',
				items: { dich_vu: {}, goi_kham: {} },
			})
			await loadAppointments(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Tạo lịch hẹn thất bại.'))
		} finally {
			setIsCreating(false)
		}
	}

	const handleCreatePatient = async () => {
		if (
			!createPatientForm.ho_ten.trim() ||
			!createPatientForm.ngay_sinh ||
			!createPatientForm.so_dien_thoai.trim() ||
			!createPatientForm.so_cccd.trim() ||
			!createPatientForm.dia_chi.trim()
		) {
			message.warning('Vui lòng nhập đủ họ tên, ngày sinh, số điện thoại, CCCD và địa chỉ.')
			return
		}

		setIsCreatingPatient(true)
		try {
			await submitCreatePatient({
				ho_ten: createPatientForm.ho_ten.trim(),
				ngay_sinh: createPatientForm.ngay_sinh,
				gioi_tinh: createPatientForm.gioi_tinh,
				so_dien_thoai: createPatientForm.so_dien_thoai.trim(),
				email: createPatientForm.email?.trim() || null,
				so_cccd: createPatientForm.so_cccd.trim(),
				dia_chi: createPatientForm.dia_chi.trim(),
				nguoi_lien_he: createPatientForm.nguoi_lien_he?.trim() || null,
				sdt_nguoi_lien_he: createPatientForm.sdt_nguoi_lien_he?.trim() || null,
				nhom_mau: createPatientForm.nhom_mau || null,
				tien_su_di_ung: createPatientForm.tien_su_di_ung?.trim() || null,
				tien_su_benh: createPatientForm.tien_su_benh?.trim() || null,
				ghi_chu: createPatientForm.ghi_chu?.trim() || null,
			})

			message.success('Tạo bệnh nhân thành công.')
			if (activeTable === 'patients') {
				await loadPatients(patientPagination.currentPage, patientPagination.pageSize, patientSearch)
			}
			setCreatePatientForm({
				ho_ten: '',
				ngay_sinh: '',
				gioi_tinh: 'nam',
				so_dien_thoai: '',
				email: '',
				so_cccd: '',
				dia_chi: '',
				nguoi_lien_he: '',
				sdt_nguoi_lien_he: '',
				nhom_mau: null,
				tien_su_di_ung: '',
				tien_su_benh: '',
				ghi_chu: '',
			})
			setIsPatientCreateModalOpen(false)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tạo bệnh nhân.'))
		} finally {
			setIsCreatingPatient(false)
		}
	}

	const openCreateBookingForPatient = (patient) => {
		setCreateForm({
			benh_nhan_id: patient.id,
			chuyen_khoa_id: null,
			bac_si_id: null,
			ngay_hen: null,
			khung_gio_id: null,
			ly_do_kham: '',
			ghi_chu: '',
			items: { dich_vu: {}, goi_kham: {} },
		})
		setIsCreateModalOpen(true)
	}

	const handleCancelSubmit = async () => {
		if (!cancelingAppointment) {
			return
		}

		if (!lyDoHuyId && !lyDoHuyKhac.trim()) {
			message.warning('Vui lòng chọn lý do hủy hoặc nhập lý do khác.')
			return
		}

		setIsCancelSubmitting(true)
		try {
			await submitCancelAppointment({
				lichHenId: cancelingAppointment.id,
				lyDoHuyId,
				lyDoHuyKhac,
			})
			message.success('Hủy lịch hẹn thành công.')
			setCancelingAppointment(null)
			setLyDoHuyId(null)
			setLyDoHuyKhac('')
			await loadAppointments(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể hủy lịch hẹn.'))
		} finally {
			setIsCancelSubmitting(false)
		}
	}

	const handleRescheduleSubmit = async (payload) => {
		if (!reschedulingAppointment) {
			return
		}

		setIsRescheduleSubmitting(true)
		try {
			await submitRescheduleAppointment({
				lichHenId: reschedulingAppointment.id,
				payload,
			})
			message.success('Đổi lịch hẹn thành công.')
			setReschedulingAppointment(null)
			await loadAppointments(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể đổi lịch hẹn.'))
		} finally {
			setIsRescheduleSubmitting(false)
		}
	}

	const handleCheckInSubmit = async () => {
		if (!checkingInAppointment) {
			return
		}

		setIsCheckInSubmitting(true)
		try {
			await submitCheckInAppointment({
				lichHenId: checkingInAppointment.id,
				nguoiTiepNhanId: MOCK_NGUOI_TIEP_NHAN_ID,
			})
			message.success('Check-in bệnh nhân thành công.')
			setCheckingInAppointment(null)
			await loadAppointments(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể check-in lịch hẹn.'))
		} finally {
			setIsCheckInSubmitting(false)
		}
	}

	const renderStatus = (status) => {
		const meta = appointmentStatusMeta[status]
		return <Tag color={meta?.color || 'default'}>{meta?.label || status}</Tag>
	}

	const rows = useMemo(() => {
		return appointments.map((appointment) => {
			const items = appointment.dich_vu_lich_hens || []
			const total = items.reduce((sum, item) => {
				if (item.dich_vu) {
					return sum + (item.dich_vu.gia_dich_vu || 0) * (item.so_luong || 1)
				}
				return sum + (item.goi_kham?.gia_goi_kham || 0) * (item.so_luong || 1)
			}, 0)

			const slot = appointment.khung_gio_kham

			return {
				...appointment,
				patientName: appointment.benh_nhan?.ho_ten || '-',
				doctorName: appointment.bac_si?.ho_ten || '-',
				specialtyName: appointment.chuyen_khoa?.ten_chuyen_khoa || '-',
				slotLabel: slot ? `${formatTimeLabel(slot.gio_bat_dau)} - ${formatTimeLabel(slot.gio_ket_thuc)}` : 'Chưa xác định',
				total,
				canCheckIn:
					['dang_cho', 'da_thanh_toan', 'da_xac_nhan'].includes(appointment.trang_thai) &&
					!appointment.gio_den_thuc_te,
			}
		})
	}, [appointments])

	const columns = [
		{ title: 'Mã lịch', dataIndex: 'ma_lich_hen', key: 'ma_lich_hen' },
		{ title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
		{ title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
		{ title: 'Chuyên khoa', dataIndex: 'specialtyName', key: 'specialtyName' },
		{
			title: 'Ngày giờ',
			key: 'date',
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Text>{record.ngay_hen}</Text>
					<Text type="secondary">{record.slotLabel}</Text>
				</Space>
			),
		},
		{ title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', render: renderStatus },
		{ title: 'Tổng phí', dataIndex: 'total', key: 'total', render: (value) => formatCurrency(value) },
		{
			title: 'Hành động',
			align: 'center',
			key: 'actions',
			render: (_, record) => {
				const canModify = ['dang_cho', 'da_xac_nhan', 'da_thanh_toan'].includes(record.trang_thai)

				return (
					<Space wrap>
						<Tooltip title="Xem chi tiết">
							<Button icon={<EyeOutlined />} onClick={() => setSelectedAppointmentId(record.id)} />
						</Tooltip>
						<Tooltip title={"Đổi lịch" + (canModify ? "" : " (không thể thực hiện)")}>
							<Button icon={<EditOutlined />} disabled={!canModify} onClick={() => setReschedulingAppointment(record)} />
						</Tooltip>
						{/* Add more validations and actions */}
						<Tooltip title={record.canCheckIn ? 'Check-in bệnh nhân' : 'Không thể check-in ở trạng thái hiện tại'}>
							<Button icon={<CheckCircleOutlined />} disabled={!record.canCheckIn} onClick={() => setCheckingInAppointment(record)} />
						</Tooltip>
						<Tooltip title={"Hủy lịch" + (canModify ? "" : " (không thể thực hiện)")}>
							<Button danger disabled={!canModify} onClick={() => setCancelingAppointment(record)}>
								Hủy lịch
							</Button>
						</Tooltip>
					</Space>
				)
			},
		},
	]

	const patientRows = useMemo(() => {
		const normalizedKeyword = patientSearch.trim().toLowerCase()

		return patients
			.filter((patient) => {
				if (patientGenderFilter && patient.gioi_tinh !== patientGenderFilter) {
					return false
				}

				if (patientBloodFilter && (patient.nhom_mau || '') !== patientBloodFilter) {
					return false
				}

				if (!normalizedKeyword) {
					return true
				}

				const searchFields = [
					patient.ma_benh_nhan,
					patient.ho_ten,
					patient.so_dien_thoai,
					patient.so_cccd,
					patient.email,
				]
					.filter(Boolean)
					.map((value) => String(value).toLowerCase())

				return searchFields.some((value) => value.includes(normalizedKeyword))
			})
			.map((patient) => ({
				...patient,
				genderLabel:
					patient.gioi_tinh === 'nam'
						? 'Nam'
						: patient.gioi_tinh === 'nu'
							? 'Nữ'
							: patient.gioi_tinh === 'khac'
								? 'Khác'
								: '-',
			}))
	}, [patients, patientBloodFilter, patientGenderFilter, patientSearch])

	const patientColumns = [
		{ title: 'Mã BN', dataIndex: 'ma_benh_nhan', key: 'ma_benh_nhan', render: (value) => value || '-' },
		{ title: 'Họ tên', dataIndex: 'ho_ten', key: 'ho_ten' },
		{ title: 'Giới tính', dataIndex: 'genderLabel', key: 'genderLabel' },
		{ title: 'Ngày sinh', dataIndex: 'ngay_sinh', key: 'ngay_sinh', render: (value) => value || '-' },
		{ title: 'Số điện thoại', dataIndex: 'so_dien_thoai', key: 'so_dien_thoai', render: (value) => value || '-' },
		{ title: 'CCCD', dataIndex: 'so_cccd', key: 'so_cccd', render: (value) => value || '-' },
		{
			title: 'Thao tác',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<Space wrap>
					<Tooltip title="Xem chi tiết">
						<Button icon={<EyeOutlined />} onClick={() => setSelectedPatient(record)} />
					</Tooltip>
					<Button type="primary" onClick={() => openCreateBookingForPatient(record)}>
						Tạo lịch hẹn
					</Button>
				</Space>
			),
		},
	]

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
			<div className="mx-auto w-full max-w-7xl">
				<Card className="rounded-2xl border-[#E2E8F0]">
					<Space direction="vertical" size={14} className="w-full">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<Title level={3} className="mb-1">Lễ tân quản lý lịch hẹn</Title>
								<Paragraph className="mb-0 text-slate-500">
									Tạo, đổi và hủy lịch hẹn cho bệnh nhân tại quầy.
								</Paragraph>
							</div>
							<Space>
								<Badge
									color="#0F766E"
									text={
										activeTable === 'appointments'
											? `${pagination.totalItems || rows.length} lịch hẹn`
											: `${patientPagination.totalItems || patientRows.length} bệnh nhân`
									}
								/>
							</Space>
						</div>

						<Alert
							type="info"
							showIcon
							message="Lễ tân có thể thao tác đặt/đổi/hủy lịch. Backend vẫn kiểm tra đầy đủ quy tắc thời gian và khung giờ."
						/>

						<Segmented
							className={`${SEGMENTED_STYLES} w-fit`}
							value={activeTable}
							onChange={setActiveTable}
							options={[
								{ label: 'Bảng lịch hẹn', value: 'appointments' },
								{ label: 'Bảng bệnh nhân', value: 'patients' },
							]}
						/>

						{activeTable === 'appointments' ? (
							<>
								<div className="grid gap-3 md:grid-cols-[3fr_2fr_1fr_1fr]">
									<Input
										placeholder="Tìm theo mã lịch, bệnh nhân, bác sĩ"
										value={keyword}
										onChange={(event) => setKeyword(event.target.value)}
									/>
									<Select
										allowClear
										placeholder="Trạng thái"
										value={statusFilter || undefined}
										onChange={(value) => setStatusFilter(value || '')}
										options={Object.entries(appointmentStatusMeta).map(([value, meta]) => ({
											value,
											label: meta.label,
										}))}
									/>
									<Segmented
										className={`${SEGMENTED_STYLES} w-fit`}
										value={viewMode}
										onChange={setViewMode}
										options={[
											{ label: 'Sắp tới', value: 'sap-toi' },
											{ label: 'Tất cả', value: 'tat-ca' },
										]}
									/>
									<Button onClick={() => loadAppointments(1, pagination.pageSize)}>Áp dụng</Button>
								</div>

								<Table
									rowKey="id"
									className={TABLE_STYLES.header}
									columns={columns}
									dataSource={rows}
									loading={loading}
									scroll={{ x: 'max-content' }}
									pagination={{
										current: pagination.currentPage,
										pageSize: pagination.pageSize,
										total: pagination.totalItems,
										onChange: (page, pageSize) => loadAppointments(page, pageSize),
									}}
								/>
							</>
						) : (
							<>
								<div className="grid gap-3 md:grid-cols-[3fr_1fr_1fr_auto_auto]">
									<Input
										placeholder="Tìm theo mã BN, tên, CCCD, SĐT, email"
										value={patientSearch}
										onChange={(event) => setPatientSearch(event.target.value)}
									/>
									<Select
										allowClear
										placeholder="Giới tính"
										value={patientGenderFilter || undefined}
										onChange={(value) => setPatientGenderFilter(value || '')}
										options={[
											{ value: 'nam', label: 'Nam' },
											{ value: 'nu', label: 'Nữ' },
											{ value: 'khac', label: 'Khác' },
										]}
									/>
									<Select
										allowClear
										placeholder="Nhóm máu"
										value={patientBloodFilter || undefined}
										onChange={(value) => setPatientBloodFilter(value || '')}
										options={BLOOD_GROUP_OPTIONS.map((value) => ({ value, label: value }))}
									/>
									<Button onClick={() => loadPatients(1, patientPagination.pageSize, patientSearch)}>Áp dụng</Button>
									<Button type="primary" onClick={() => setIsPatientCreateModalOpen(true)}>Tạo bệnh nhân</Button>
								</div>

								<Table
									rowKey="id"
									className={TABLE_STYLES.header}
									columns={patientColumns}
									dataSource={patientRows}
									loading={loadingPatients}
									scroll={{ x: 'max-content' }}
									pagination={{
										current: patientPagination.currentPage,
										pageSize: patientPagination.pageSize,
										total: patientPagination.totalItems,
										onChange: (page, pageSize) => loadPatients(page, pageSize, patientSearch),
									}}
								/>
							</>
						)}
					</Space>
				</Card>
			</div>

			<Modal
				title="Tạo lịch hẹn mới"
				open={isCreateModalOpen}
				onCancel={() => setIsCreateModalOpen(false)}
				onOk={handleCreateBooking}
				okText="Tạo lịch hẹn"
				confirmLoading={isCreating}
				width={960}
				centered
				destroyOnClose
			>
				<Space direction="vertical" size={12} className="w-full">
					<Card className="border-[#E2E8F0]">
						<Text strong>Bệnh nhân được chọn</Text>
						{selectedPatientForBooking ? (
							<div className="mt-2 grid gap-1 md:grid-cols-2">
								<Text><Text strong>Họ tên:</Text> {selectedPatientForBooking.ho_ten || '-'}</Text>
								<Text><Text strong>Mã BN:</Text> {selectedPatientForBooking.ma_benh_nhan || '-'}</Text>
								<Text><Text strong>SĐT:</Text> {selectedPatientForBooking.so_dien_thoai || '-'}</Text>
								<Text><Text strong>CCCD:</Text> {selectedPatientForBooking.so_cccd || '-'}</Text>
							</div>
						) : (
							<Alert
								type="warning"
								className="mt-2"
								message="Vui lòng tạo lịch hẹn từ Bảng bệnh nhân để hệ thống tự chọn bệnh nhân."
							/>
						)}
					</Card>

					<div className="grid gap-3 md:grid-cols-2">
						<Card className="border-[#E2E8F0]">
							<Text strong>Chuyên khoa</Text>
							<Select
								className="mt-2 w-full"
								value={createForm.chuyen_khoa_id}
								onChange={(value) => setCreateForm((prev) => ({
									...prev,
									chuyen_khoa_id: value,
									bac_si_id: null,
									ngay_hen: null,
									khung_gio_id: null,
									items: { dich_vu: {}, goi_kham: {} },
								}))}
								options={specialties.map((item) => ({ value: item.id, label: item.ten_chuyen_khoa }))}
							/>
						</Card>

						<Card className="border-[#E2E8F0]">
							<Text strong>Bác sĩ</Text>
							<Select
								className="mt-2 w-full"
								value={createForm.bac_si_id}
								loading={loadingDoctors}
								onChange={(value) => setCreateForm((prev) => ({
									...prev,
									bac_si_id: value,
									ngay_hen: null,
									khung_gio_id: null,
								}))}
								options={doctors.map((doctor) => ({ value: doctor.id, label: doctor.ho_ten }))}
							/>
						</Card>
					</div>

					<CalendarPicker
						selectedDate={createForm.ngay_hen}
						selectedSlotKey={createForm.khung_gio_id}
						onDateChange={(value) => setCreateForm((prev) => ({ ...prev, ngay_hen: value, khung_gio_id: null }))}
						onSlotChange={(slot) => setCreateForm((prev) => ({ ...prev, khung_gio_id: slot.slot_key }))}
						onSlotsChange={setCalendarSlots}
						scheduleItems={scheduleItems}
						loading={loadingSchedule}
					/>

					<Card className="border-[#E2E8F0]">
						<ServicePicker
							selectedItems={createForm.items}
							onChange={(items) => setCreateForm((prev) => ({ ...prev, items }))}
							services={services}
							packages={packages}
						/>
						{loadingItems && <Text type="secondary">Đang tải dịch vụ/gói khám...</Text>}
					</Card>

					<Card className="border-[#E2E8F0]">
						<Text strong>Lý do khám</Text>
						<Input.TextArea
							rows={3}
							value={createForm.ly_do_kham}
							onChange={(event) => setCreateForm((prev) => ({ ...prev, ly_do_kham: event.target.value }))}
						/>
						<Text strong className="mt-3 block">Ghi chú</Text>
						<Input.TextArea
							rows={2}
							value={createForm.ghi_chu}
							onChange={(event) => setCreateForm((prev) => ({ ...prev, ghi_chu: event.target.value }))}
						/>
					</Card>
				</Space>
			</Modal>

			<PatientDetailModal
				open={Boolean(selectedPatient)}
				patient={selectedPatient}
				onClose={() => setSelectedPatient(null)}
			/>

			<Modal
				title="Tạo bệnh nhân mới"
				open={isPatientCreateModalOpen}
				onCancel={() => setIsPatientCreateModalOpen(false)}
				onOk={handleCreatePatient}
				okText="Tạo bệnh nhân"
				confirmLoading={isCreatingPatient}
				width={820}
				centered
				destroyOnClose
			>
				<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
					<Space direction="vertical" size={16} className="w-full">
						{/* Personal Information Section */}
						<div>
							<div className="grid gap-3 md:grid-cols-2">
								<Form.Item
									label="Họ tên"
									required
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập họ tên"
										value={createPatientForm.ho_ten}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, ho_ten: event.target.value }))}
									/>
								</Form.Item>

								<Form.Item
									label="Ngày sinh"
									required
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<DatePicker
										className="w-full"
										format="YYYY-MM-DD"
										placeholder="Chọn ngày sinh"
										value={createPatientForm.ngay_sinh ? dayjs(createPatientForm.ngay_sinh) : null}
										onChange={(value) => setCreatePatientForm((prev) => ({
											...prev,
											ngay_sinh: value ? value.format('YYYY-MM-DD') : '',
										}))}
									/>
								</Form.Item>
							</div>
						</div>

						{/* Contact Information Section */}
						<div>
							<div className="grid gap-3 md:grid-cols-3">
								<Form.Item
									label="Giới tính"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Select
										placeholder="Chọn giới tính"
										value={createPatientForm.gioi_tinh}
										onChange={(value) => setCreatePatientForm((prev) => ({ ...prev, gioi_tinh: value }))}
										options={[
											{ value: 'nam', label: 'Nam' },
											{ value: 'nu', label: 'Nữ' },
											{ value: 'khac', label: 'Khác' },
										]}
									/>
								</Form.Item>

								<Form.Item
									label="Số điện thoại"
									required
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập số điện thoại"
										value={createPatientForm.so_dien_thoai}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, so_dien_thoai: event.target.value }))}
									/>
								</Form.Item>

								<Form.Item
									label="Số CCCD"
									required
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập số CCCD"
										value={createPatientForm.so_cccd}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, so_cccd: event.target.value }))}
									/>
								</Form.Item>
							</div>
						</div>

						{/* Additional Information Section */}
						<div>
							<div className="grid gap-3 md:grid-cols-2">
								<Form.Item
									label="Email"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập email"
										value={createPatientForm.email}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, email: event.target.value }))}
									/>
								</Form.Item>

								<Form.Item
									label="Nhóm máu"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Select
										allowClear
										placeholder="Chọn nhóm máu"
										value={createPatientForm.nhom_mau}
										onChange={(value) => setCreatePatientForm((prev) => ({ ...prev, nhom_mau: value || null }))}
										options={BLOOD_GROUP_OPTIONS.map((value) => ({ value, label: value }))}
									/>
								</Form.Item>
							</div>
						</div>

						{/* Address Section */}
						<div>
							<Form.Item
								label="Địa chỉ"
								required
								className="mb-0"
								labelCol={{ span: 24 }}
								wrapperCol={{ span: 24 }}
							>
								<Input.TextArea
									rows={2}
									placeholder="Nhập địa chỉ"
									value={createPatientForm.dia_chi}
									onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, dia_chi: event.target.value }))}
								/>
							</Form.Item>
						</div>

						{/* Emergency Contact Section */}
						<div>
							<div className="grid gap-3 md:grid-cols-2">
								<Form.Item
									label="Người liên hệ"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập tên người liên hệ"
										value={createPatientForm.nguoi_lien_he}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, nguoi_lien_he: event.target.value }))}
									/>
								</Form.Item>

								<Form.Item
									label="SĐT người liên hệ"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input
										placeholder="Nhập số điện thoại"
										value={createPatientForm.sdt_nguoi_lien_he}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, sdt_nguoi_lien_he: event.target.value }))}
									/>
								</Form.Item>
							</div>
						</div>

						{/* Medical History Section */}
						<div>
							<div className="grid gap-3 md:grid-cols-2">
								<Form.Item
									label="Tiền sử dị ứng"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input.TextArea
										rows={2}
										placeholder="Nhập tiền sử dị ứng"
										value={createPatientForm.tien_su_di_ung}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, tien_su_di_ung: event.target.value }))}
									/>
								</Form.Item>

								<Form.Item
									label="Tiền sử bệnh"
									className="mb-0"
									labelCol={{ span: 24 }}
									wrapperCol={{ span: 24 }}
								>
									<Input.TextArea
										rows={2}
										placeholder="Nhập tiền sử bệnh"
										value={createPatientForm.tien_su_benh}
										onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, tien_su_benh: event.target.value }))}
									/>
								</Form.Item>
							</div>
						</div>

						{/* Notes Section */}
						<div>
							<Form.Item
								label="Ghi chú"
								className="mb-0"
								labelCol={{ span: 24 }}
								wrapperCol={{ span: 24 }}
							>
								<Input.TextArea
									rows={2}
									placeholder="Nhập ghi chú"
									value={createPatientForm.ghi_chu}
									onChange={(event) => setCreatePatientForm((prev) => ({ ...prev, ghi_chu: event.target.value }))}
								/>
							</Form.Item>
						</div>
					</Space>
				</div>
			</Modal>

			<Modal
				title="Chi tiết lịch hẹn"
				open={Boolean(selectedAppointment)}
				onCancel={() => setSelectedAppointmentId(null)}
				footer={null}
				width={860}
				style={MODAL_STYLES.verticalStatic}
				destroyOnClose
			>
				<AppointmentDetails appointment={selectedAppointment} />
			</Modal>

			<Modal
				title={checkingInAppointment ? `Check-in ${checkingInAppointment.ma_lich_hen}` : 'Check-in lịch hẹn'}
				open={Boolean(checkingInAppointment)}
				onCancel={() => setCheckingInAppointment(null)}
				onOk={handleCheckInSubmit}
				confirmLoading={isCheckInSubmitting}
				okText="Xác nhận check-in"
				cancelText="Đóng"
				centered
				destroyOnClose
			>
				<Space direction="vertical" size={8} className="w-full">
					<Text>Bạn có chắc chắn muốn check-in bệnh nhân cho lịch hẹn này?</Text>
					{checkingInAppointment && (
						<Card size="small" className="border-[#E2E8F0] bg-slate-50">
							<Space direction="vertical" size={2}>
								<Text><Text strong>Mã lịch:</Text> {checkingInAppointment.ma_lich_hen}</Text>
								<Text><Text strong>Bệnh nhân:</Text> {checkingInAppointment.patientName || checkingInAppointment.benh_nhan?.ho_ten || '-'}</Text>
								<Text><Text strong>Ngày hẹn:</Text> {checkingInAppointment.ngay_hen}</Text>
								<Text><Text strong>Khung giờ:</Text> {checkingInAppointment.slotLabel || 'Chưa xác định'}</Text>
							</Space>
						</Card>
					)}
					<Text type="secondary">Hệ thống sẽ tạo phiếu khám khi check-in thành công.</Text>
				</Space>
			</Modal>

			<Modal
				title={cancelingAppointment ? `Hủy lịch ${cancelingAppointment.ma_lich_hen}` : 'Hủy lịch hẹn'}
				open={Boolean(cancelingAppointment)}
				onCancel={() => setCancelingAppointment(null)}
				onOk={handleCancelSubmit}
				confirmLoading={isCancelSubmitting}
				okButtonProps={{ danger: true }}
				okText="Xác nhận hủy"
				cancelText="Đóng"
				centered
				destroyOnClose
			>
				<Space direction="vertical" size={10} className="w-full">
					<Select
						allowClear
						placeholder="Chọn lý do hủy"
						value={lyDoHuyId}
						onChange={setLyDoHuyId}
						options={cancelReasons.map((reason) => ({ value: reason.id, label: reason.ten_ly_do }))}
					/>
					<Input.TextArea
						rows={3}
						value={lyDoHuyKhac}
						onChange={(event) => setLyDoHuyKhac(event.target.value)}
						placeholder="Nhập lý do hủy khác"
					/>
				</Space>
			</Modal>

			<Modal
				title={reschedulingAppointment ? `Đổi lịch ${reschedulingAppointment.ma_lich_hen}` : 'Đổi lịch hẹn'}
				open={Boolean(reschedulingAppointment)}
				onCancel={() => setReschedulingAppointment(null)}
				footer={null}
				width={900}
				centered
				destroyOnClose
			>
				<DoiLichForm
					appointment={reschedulingAppointment}
					onSubmit={handleRescheduleSubmit}
					onCancel={() => setReschedulingAppointment(null)}
					submitting={isRescheduleSubmitting}
				/>
			</Modal>
		</div>
	)
}
