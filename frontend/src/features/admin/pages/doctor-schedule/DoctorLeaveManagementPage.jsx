import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
	Button,
	Card,
	Checkbox,
	Col,
	DatePicker,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	TimePicker,
	Typography,
	message,
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import {
	fetchAdminDoctors,
	fetchDoctorLeaves,
	getApiErrorMessage,
	submitCreateDoctorLeave,
	submitDeleteDoctorLeave,
	submitUpdateDoctorLeave,
} from '../../../../Services/adminScheduleService'
import { ADMIN_MODAL_STYLES, ADMIN_TABLE_STYLES } from '../../styles/const-styles'

const { Title } = Typography
const { RangePicker } = DatePicker
const DEFAULT_PAGE_SIZE = 10

const formatStatusTag = (status) => {
	const map = {
		hoat_dong: { color: 'green', label: 'Hoạt động' },
		huy: { color: 'red', label: 'Hủy' },
	}

	return map[status] || { color: 'default', label: status }
}

const toTimeValue = (time) => {
	if (!time) {
		return null
	}

	return dayjs(`2000-01-01 ${String(time).slice(0, 8)}`)
}

export default function DoctorLeaveManagementPage() {
	const [loading, setLoading] = useState(false)
	const [doctors, setDoctors] = useState([])
	const [leaves, setLeaves] = useState([])
	const [pagination, setPagination] = useState({ currentPage: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: 0 })
	const [doctorFilter, setDoctorFilter] = useState(undefined)
	const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

	const [modalOpen, setModalOpen] = useState(false)
	const [modalSubmitting, setModalSubmitting] = useState(false)
	const [editingLeave, setEditingLeave] = useState(null)
	const [isFullDay, setIsFullDay] = useState(true)
	const [form] = Form.useForm()

	const doctorOptions = useMemo(
		() => doctors.map((doctor) => ({ label: `${doctor.ho_ten} (${doctor.ma_bac_si})`, value: doctor.id })),
		[doctors],
	)

	const loadDoctors = useCallback(async () => {
		try {
			const result = await fetchAdminDoctors()
			setDoctors(result.items)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải danh sách bác sĩ.'))
		}
	}, [])

	const loadLeaves = useCallback(
		async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
			setLoading(true)
			try {
				const result = await fetchDoctorLeaves({
					bacSiId: doctorFilter,
					fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
					toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
					page,
					pageSize,
				})

				setLeaves(result.items)
				if (result.pagination) {
					setPagination(result.pagination)
				}
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách lịch nghỉ bác sĩ.'))
			} finally {
				setLoading(false)
			}
		},
		[doctorFilter, dateRange],
	)

	useEffect(() => {
		loadDoctors()
	}, [loadDoctors])

	useEffect(() => {
		loadLeaves(1, pagination.pageSize)
	}, [loadLeaves, pagination.pageSize])

	const openCreateModal = () => {
		setEditingLeave(null)
		setIsFullDay(true)
		form.resetFields()
		form.setFieldsValue({
			trang_thai: 'hoat_dong',
		})
		setModalOpen(true)
	}

	const openEditModal = (leave) => {
		setEditingLeave(leave)
		const fullDay = !leave.gio_bat_dau && !leave.gio_ket_thuc
		setIsFullDay(fullDay)
		form.setFieldsValue({
			bac_si_id: leave.bac_si_id,
			ngay: dayjs(leave.ngay),
			gio_bat_dau: toTimeValue(leave.gio_bat_dau),
			gio_ket_thuc: toTimeValue(leave.gio_ket_thuc),
			ly_do: leave.ly_do,
			trang_thai: leave.trang_thai,
		})
		setModalOpen(true)
	}

	const submitLeave = async (payload, forceCancelAppointments = false) => {
		setModalSubmitting(true)
		try {
			const requestPayload = forceCancelAppointments
				? { ...payload, xac_nhan_huy_lich_hen: true }
				: payload
			const response = editingLeave
				? await submitUpdateDoctorLeave(editingLeave.id, requestPayload)
				: await submitCreateDoctorLeave(requestPayload)
			const cancelledCount = response?.thong_tin_huy_lich_hen?.so_luong_lich_hen_bi_huy || 0
			if (editingLeave) {
				message.success(
					cancelledCount > 0
						? `Cập nhật lịch nghỉ bác sĩ thành công. Đã hủy ${cancelledCount} lịch hẹn bị ảnh hưởng.`
						: 'Cập nhật lịch nghỉ bác sĩ thành công.',
				)
			} else {
				message.success(
					cancelledCount > 0
						? `Tạo lịch nghỉ bác sĩ thành công. Đã hủy ${cancelledCount} lịch hẹn bị ảnh hưởng.`
						: 'Tạo lịch nghỉ bác sĩ thành công.',
				)
			}
			setModalOpen(false)
			setEditingLeave(null)
			await loadLeaves(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			const confirmMessage = error?.response?.data?.data?.errors?.xac_nhan_huy_lich_hen?.[0]
			if (!forceCancelAppointments && confirmMessage) {
				Modal.confirm({
					title: 'Xác nhận tạo lịch nghỉ và hủy lịch hẹn',
					content: `${confirmMessage} Nếu tiếp tục, hệ thống sẽ hủy các lịch hẹn bị ảnh hưởng ngay lập tức.`,
					okText: 'Xác nhận',
					cancelText: 'Đóng',
					onOk: () => submitLeave(payload, true),
				})
				return
			}
			message.error(getApiErrorMessage(error, 'Không thể lưu lịch nghỉ bác sĩ.'))
		} finally {
			setModalSubmitting(false)
		}
	}
	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()
			const payload = {
				bac_si_id: values.bac_si_id,
				ngay: values.ngay.format('YYYY-MM-DD'),
				gio_bat_dau: isFullDay ? null : values.gio_bat_dau?.format('HH:mm:ss'),
				gio_ket_thuc: isFullDay ? null : values.gio_ket_thuc?.format('HH:mm:ss'),
				ly_do: values.ly_do || null,
				trang_thai: values.trang_thai || 'hoat_dong',
			}
			await submitLeave(payload)
		} catch (error) {
			if (error?.errorFields) {
				return
			}
			message.error(getApiErrorMessage(error, 'Không thể lưu lịch nghỉ bác sĩ.'))
		}
	}

	const handleDelete = async (leaveId) => {
		try {
			await submitDeleteDoctorLeave(leaveId)
			message.success('Hủy lịch nghỉ bác sĩ thành công.')
			await loadLeaves(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể hủy lịch nghỉ bác sĩ.'))
		}
	}

	const columns = [
		{
			title: 'Bác sĩ',
			key: 'bac_si',
			render: (_, record) => record?.bac_si?.ho_ten || '-',
		},
		{ title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
		{
			title: 'Khung nghỉ',
			key: 'time_range',
			render: (_, record) => {
				if (!record.gio_bat_dau || !record.gio_ket_thuc) {
					return 'Cả ngày'
				}
				return `${String(record.gio_bat_dau).slice(0, 5)} - ${String(record.gio_ket_thuc).slice(0, 5)}`
			},
		},
		{ title: 'Lý do', dataIndex: 'ly_do', key: 'ly_do', render: (value) => value || '-' },
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
					<Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
					<Popconfirm
						title="Hủy lịch nghỉ"
						description="Bạn có chắc chắn muốn hủy lịch nghỉ này?"
						onConfirm={() => handleDelete(record.id)}
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
					<Title level={4} style={{ marginBottom: 0 }}>Quản lý nghỉ bác sĩ</Title>
					<Space>
						<Button icon={<ReloadOutlined />} onClick={() => loadLeaves(1, pagination.pageSize)}>
							Tải lại
						</Button>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
							Tạo lịch nghỉ
						</Button>
					</Space>
				</Space>
			</Card>

			<Card className="border-[#E2E8F0]">
				<Row gutter={12}>
					<Col xs={24} md={8}>
						<Select
							allowClear
							showSearch
							placeholder="Lọc theo bác sĩ"
							optionFilterProp="label"
							options={doctorOptions}
							value={doctorFilter}
							onChange={setDoctorFilter}
							className="w-full"
						/>
					</Col>
					<Col xs={24} md={10}>
						<RangePicker value={dateRange} onChange={setDateRange} className="w-full" format="YYYY-MM-DD" />
					</Col>
					<Col xs={24} md={6}>
						<Button type="primary" className="w-full" onClick={() => loadLeaves(1, pagination.pageSize)}>
							Áp dụng bộ lọc
						</Button>
					</Col>
				</Row>
			</Card>

			<Card className="border-[#E2E8F0]" loading={loading}>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={leaves}
					scroll={{ x: 'max-content' }}
					className={ADMIN_TABLE_STYLES.header}
					pagination={{
						current: pagination.currentPage,
						pageSize: pagination.pageSize,
						total: pagination.totalItems,
						onChange: (page, pageSize) => loadLeaves(page, pageSize),
					}}
				/>
			</Card>

			<Modal
				title={editingLeave ? 'Cập nhật lịch nghỉ bác sĩ' : 'Tạo lịch nghỉ bác sĩ'}
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleSubmit}
				confirmLoading={modalSubmitting}
				styles={ADMIN_MODAL_STYLES}
				destroyOnClose
			>
				<Form layout="vertical" form={form}>
					<Form.Item name="bac_si_id" label="Bác sĩ" rules={[{ required: true, message: 'Chọn bác sĩ' }]}>
						<Select
							showSearch
							optionFilterProp="label"
							options={doctorOptions}
							placeholder="Chọn bác sĩ"
						/>
					</Form.Item>

					<Form.Item name="ngay" label="Ngày nghỉ" rules={[{ required: true, message: 'Chọn ngày nghỉ' }]}>
						<DatePicker className="w-full" format="YYYY-MM-DD" disabledDate={(current) => current && current < dayjs().startOf('day')} />
					</Form.Item>

					<Form.Item>
						<Checkbox checked={isFullDay} onChange={(event) => setIsFullDay(event.target.checked)}>
							Nghỉ cả ngày
						</Checkbox>
					</Form.Item>

					{!isFullDay && (
						<Row gutter={12}>
							<Col xs={24} md={12}>
								<Form.Item name="gio_bat_dau" label="Giờ bắt đầu" rules={[{ required: true }]}>
									<TimePicker className="w-full" format="HH:mm:ss" />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name="gio_ket_thuc" label="Giờ kết thúc" rules={[{ required: true }]}>
									<TimePicker className="w-full" format="HH:mm:ss" />
								</Form.Item>
							</Col>
						</Row>
					)}

					<Form.Item name="ly_do" label="Lý do nghỉ">
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item name="trang_thai" label="Trạng thái" rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Hoạt động', value: 'hoat_dong' },
								{ label: 'Hủy', value: 'huy' },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	)
}
