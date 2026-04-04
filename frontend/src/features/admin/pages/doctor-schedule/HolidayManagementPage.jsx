import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
	Button,
	Card,
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
	Typography,
	message,
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import {
	fetchHolidays,
	getApiErrorMessage,
	submitCreateHoliday,
	submitDeleteHoliday,
	submitUpdateHoliday,
} from '../../../../Services/adminScheduleService'
import useDebounce from '../../../../hooks/useDebounce'
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

export default function HolidayManagementPage() {
	const [loading, setLoading] = useState(false)
	const [holidays, setHolidays] = useState([])
	const [pagination, setPagination] = useState({ currentPage: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: 0 })
	const [keyword, setKeyword] = useState('')
	const [statusFilter, setStatusFilter] = useState(undefined)
	const [dateRange, setDateRange] = useState([dayjs().startOf('year'), dayjs().endOf('year')])

	const [modalOpen, setModalOpen] = useState(false)
	const [modalSubmitting, setModalSubmitting] = useState(false)
	const [editingHoliday, setEditingHoliday] = useState(null)
	const [form] = Form.useForm()

	const debouncedKeyword = useDebounce(keyword, 450)

	const loadHolidays = useCallback(
		async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
			setLoading(true)
			try {
				const result = await fetchHolidays({
					ten: debouncedKeyword || undefined,
					trangThai: statusFilter || undefined,
					fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
					toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
					page,
					pageSize,
				})

				setHolidays(result.items)
				if (result.pagination) {
					setPagination(result.pagination)
				}
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách ngày nghỉ lễ.'))
			} finally {
				setLoading(false)
			}
		},
		[debouncedKeyword, statusFilter, dateRange],
	)

	useEffect(() => {
		loadHolidays(1, pagination.pageSize)
	}, [loadHolidays, pagination.pageSize])

	const openCreateModal = () => {
		setEditingHoliday(null)
		form.resetFields()
		form.setFieldsValue({
			trang_thai: 'hoat_dong',
		})
		setModalOpen(true)
	}

	const openEditModal = (holiday) => {
		setEditingHoliday(holiday)
		form.setFieldsValue({
			ten_ngay_nghi: holiday.ten_ngay_nghi,
			ngay: dayjs(holiday.ngay),
			mo_ta: holiday.mo_ta,
			trang_thai: holiday.trang_thai,
		})
		setModalOpen(true)
	}

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()
			setModalSubmitting(true)

			const payload = {
				ten_ngay_nghi: values.ten_ngay_nghi,
				ngay: values.ngay.format('YYYY-MM-DD'),
				mo_ta: values.mo_ta || null,
				trang_thai: values.trang_thai || 'hoat_dong',
			}

			if (editingHoliday) {
				await submitUpdateHoliday(editingHoliday.id, payload)
				message.success('Cập nhật ngày nghỉ lễ thành công.')
			} else {
				await submitCreateHoliday(payload)
				message.success('Tạo ngày nghỉ lễ thành công.')
			}

			setModalOpen(false)
			setEditingHoliday(null)
			await loadHolidays(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			if (error?.errorFields) {
				return
			}
			message.error(getApiErrorMessage(error, 'Không thể lưu ngày nghỉ lễ.'))
		} finally {
			setModalSubmitting(false)
		}
	}

	const handleDelete = async (holidayId) => {
		try {
			await submitDeleteHoliday(holidayId)
			message.success('Hủy ngày nghỉ lễ thành công.')
			await loadHolidays(pagination.currentPage, pagination.pageSize)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể hủy ngày nghỉ lễ.'))
		}
	}

	const columns = [
		{ title: 'Tên ngày nghỉ', dataIndex: 'ten_ngay_nghi', key: 'ten_ngay_nghi' },
		{ title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
		{ title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta', render: (value) => value || '-' },
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
						title="Hủy ngày nghỉ lễ"
						description="Bạn có chắc chắn muốn hủy ngày nghỉ lễ này?"
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
					<Title level={4} style={{ marginBottom: 0 }}>Quản lý ngày nghỉ lễ</Title>
					<Space>
						<Button icon={<ReloadOutlined />} onClick={() => loadHolidays(1, pagination.pageSize)}>
							Tải lại
						</Button>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
							Tạo ngày nghỉ lễ
						</Button>
					</Space>
				</Space>
			</Card>

			<Card className="border-[#E2E8F0]">
				<Row gutter={12}>
					<Col xs={24} md={8}>
						<Input
							placeholder="Tìm theo tên ngày nghỉ"
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
						/>
					</Col>
					<Col xs={24} md={6}>
						<Select
							allowClear
							className="w-full"
							placeholder="Trạng thái"
							value={statusFilter}
							onChange={setStatusFilter}
							options={[
								{ label: 'Hoạt động', value: 'hoat_dong' },
								{ label: 'Hủy', value: 'huy' },
							]}
						/>
					</Col>
					<Col xs={24} md={7}>
						<RangePicker value={dateRange} onChange={setDateRange} className="w-full" format="YYYY-MM-DD" />
					</Col>
					<Col xs={24} md={3}>
						<Button type="primary" className="w-full" onClick={() => loadHolidays(1, pagination.pageSize)}>
							Lọc
						</Button>
					</Col>
				</Row>
			</Card>

			<Card className="border-[#E2E8F0]" loading={loading}>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={holidays}
					scroll={{ x: 'max-content' }}
					className={ADMIN_TABLE_STYLES.header}
					pagination={{
						current: pagination.currentPage,
						pageSize: pagination.pageSize,
						total: pagination.totalItems,
						onChange: (page, pageSize) => loadHolidays(page, pageSize),
					}}
				/>
			</Card>

			<Modal
				title={editingHoliday ? 'Cập nhật ngày nghỉ lễ' : 'Tạo ngày nghỉ lễ'}
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleSubmit}
				confirmLoading={modalSubmitting}
				styles={ADMIN_MODAL_STYLES}
				destroyOnClose
			>
				<Form layout="vertical" form={form}>
					<Form.Item name="ten_ngay_nghi" label="Tên ngày nghỉ" rules={[{ required: true, message: 'Nhập tên ngày nghỉ' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="ngay" label="Ngày" rules={[{ required: true, message: 'Chọn ngày' }]}>
						<DatePicker className="w-full" format="YYYY-MM-DD" disabledDate={(current) => current && current < dayjs().startOf('day')} />
					</Form.Item>
					<Form.Item name="mo_ta" label="Mô tả">
						<Input.TextArea rows={4} />
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
