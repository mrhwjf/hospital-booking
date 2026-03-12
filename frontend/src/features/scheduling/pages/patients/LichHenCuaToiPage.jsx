import { useMemo, useState } from 'react'
import {
	Alert,
	Badge,
	Button,
	Card,
	Grid,
	Input,
	Modal,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import AppointmentDetails from '../../components/AppointmentDetails'
import {
	appointmentItems,
	appointmentStatusMeta,
	appointments as initialAppointments,
	doctors,
	formatCurrency,
	formatTimeLabel,
	packages,
	services,
	specialties,
	timeSlots,
} from '../../mockData'

const { useBreakpoint } = Grid
const { Paragraph, Text, Title } = Typography

const isActionAllowed = (dateValue) => {
	const now = new Date()
	const appointmentDate = new Date(`${dateValue}T00:00:00`)
	const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
	return diffHours >= 24
}

export default function LichHenCuaToiPage() {
	const [appointments, setAppointments] = useState(initialAppointments)
	const [statusFilter, setStatusFilter] = useState('all')
	const [keyword, setKeyword] = useState('')
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
	const screens = useBreakpoint()

	const selectedAppointment = useMemo(
		() => appointments.find((item) => item.id === selectedAppointmentId) || null,
		[appointments, selectedAppointmentId],
	)

	const rows = useMemo(() => {
		return appointments
			.map((appointment) => {
				const doctor = doctors.find((item) => item.id === appointment.bac_si_id)
				const specialty = specialties.find((item) => item.id === appointment.chuyen_khoa_id)
				const slot = timeSlots.find((item) => item.id === appointment.khung_gio_id)

				const items = appointmentItems
					.filter((item) => item.lich_hen_id === appointment.id)
					.map((item) => {
						if (item.dich_vu_id) {
							const service = services.find((sv) => sv.id === item.dich_vu_id)
							return {
								label: service?.ten_dich_vu,
								price: (service?.gia_dich_vu || 0) * item.so_luong,
							}
						}

						const pkg = packages.find((value) => value.id === item.goi_kham_id)
						return {
							label: pkg?.ten_goi_kham,
							price: (pkg?.gia_goi_kham || 0) * item.so_luong,
						}
					})

				return {
					...appointment,
					doctorName: doctor?.ho_ten,
					specialtyName: specialty?.ten_chuyen_khoa,
					slotLabel: slot
						? `${formatTimeLabel(slot.gio_bat_dau)} - ${formatTimeLabel(slot.gio_ket_thuc)}`
						: 'Chưa xác định',
					total: items.reduce((sum, item) => sum + item.price, 0),
					items,
				}
			})
			.filter((item) => {
				const matchedStatus = statusFilter === 'all' || item.trang_thai === statusFilter
				const normalizedKeyword = keyword.trim().toLowerCase()
				const matchedKeyword =
					normalizedKeyword.length === 0 ||
					item.ma_lich_hen.toLowerCase().includes(normalizedKeyword) ||
					item.doctorName?.toLowerCase().includes(normalizedKeyword)

				return matchedStatus && matchedKeyword
			})
	}, [appointments, keyword, statusFilter])

	const handleCancel = (record) => {
		if (!isActionAllowed(record.ngay_hen)) {
			message.error('Không thể hủy lịch trong vòng 24 giờ trước giờ hẹn.')
			return
		}

		Modal.confirm({
			title: `Hủy lịch ${record.ma_lich_hen}`,
			content: 'Bạn có chắc muốn hủy lịch hẹn này?',
			okText: 'Xác nhận hủy',
			okButtonProps: { danger: true },
			cancelText: 'Đóng',
			onOk: () => {
				setAppointments((prev) =>
					prev.map((item) =>
						item.id === record.id
							? {
								...item,
								trang_thai: 'da_huy',
								ly_do_huy_id: item.ly_do_huy_id || 1,
								updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
							}
							: item,
					),
				)
				message.success('Đã hủy lịch thành công.')
			},
		})
	}

	const handleReschedule = (record) => {
		if (!isActionAllowed(record.ngay_hen)) {
			message.error('Không thể đổi lịch trong vòng 24 giờ trước giờ hẹn.')
			return
		}
		message.info('Luồng đổi lịch sẽ được tích hợp API ở bước sau.')
	}

	const renderStatus = (status) => {
		const meta = appointmentStatusMeta[status]
		return <Tag color={meta?.color || 'default'}>{meta?.label || status}</Tag>
	}

	const columns = [
		{
			title: 'Mã lịch',
			dataIndex: 'ma_lich_hen',
			key: 'ma_lich_hen',
		},
		{
			title: 'Bác sĩ',
			dataIndex: 'doctorName',
			key: 'doctorName',
		},
		{
			title: 'Ngày hẹn',
			key: 'date',
			render: (_, record) => (
				<Space direction="vertical" size={0}>
					<Text>{record.ngay_hen}</Text>
					<Text type="secondary">{record.slotLabel}</Text>
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			render: renderStatus,
		},
		{
			title: 'Tổng phí',
			dataIndex: 'total',
			key: 'total',
			render: (value) => formatCurrency(value),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<Space wrap>
					<Button onClick={() => setSelectedAppointmentId(record.id)}>Xem chi tiết</Button>
					<Button onClick={() => handleReschedule(record)}>Đổi lịch</Button>
					<Button danger onClick={() => handleCancel(record)}>Hủy lịch</Button>
				</Space>
			),
		},
	]

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
			<div className="mx-auto w-full max-w-6xl">
				<Card className="rounded-2xl border-[#E2E8F0]">
					<Space direction="vertical" size={14} className="w-full">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<Title level={3} className="mb-1">Lịch hẹn của tôi</Title>
								<Paragraph className="mb-0 text-slate-500">
									Theo dõi trạng thái lịch hẹn và thao tác đổi/hủy theo quy định.
								</Paragraph>
							</div>
							<Badge color="#0F766E" text={`${rows.length} lịch phù hợp bộ lọc`} />
						</div>

						<Alert
							type="info"
							showIcon
							message="Chỉ cho phép đổi/hủy lịch trước ít nhất 24 giờ so với ngày hẹn."
						/>

						<div className="grid gap-3 md:grid-cols-2">
							<Input
								placeholder="Tìm theo mã lịch hoặc tên bác sĩ"
								value={keyword}
								onChange={(event) => setKeyword(event.target.value)}
							/>
							<Select
								value={statusFilter}
								onChange={setStatusFilter}
								options={[
									{ value: 'all', label: 'Tất cả trạng thái' },
									...Object.entries(appointmentStatusMeta).map(([value, meta]) => ({
										value,
										label: meta.label,
									})),
								]}
							/>
						</div>

						{screens.md ? (
							<Table rowKey="id" columns={columns} dataSource={rows} pagination={{ pageSize: 5 }} />
						) : (
							<Space direction="vertical" className="w-full" size={10}>
								{rows.map((row) => (
									<Card key={row.id} className="border-[#E2E8F0]">
										<Space direction="vertical" className="w-full" size={8}>
											<div className="flex items-center justify-between">
												<Text strong>{row.ma_lich_hen}</Text>
												{renderStatus(row.trang_thai)}
											</div>
											<Text>{row.specialtyName} - {row.doctorName}</Text>
											<Text type="secondary">{row.ngay_hen} | {row.slotLabel}</Text>
											<Text strong>{formatCurrency(row.total)}</Text>
											<Space wrap>
												<Button size="small" onClick={() => setSelectedAppointmentId(row.id)}>Xem chi tiết</Button>
												<Button size="small" onClick={() => handleReschedule(row)}>Đổi lịch</Button>
												<Button size="small" danger onClick={() => handleCancel(row)}>Hủy lịch</Button>
											</Space>
										</Space>
									</Card>
								))}
							</Space>
						)}
					</Space>
				</Card>
			</div>

			<Modal
				title="Chi tiết lịch hẹn"
				open={Boolean(selectedAppointment)}
				onCancel={() => setSelectedAppointmentId(null)}
				footer={null}
				width={820}
				destroyOnClose
			>
				<AppointmentDetails appointment={selectedAppointment} />
			</Modal>
		</div>
	)
}
