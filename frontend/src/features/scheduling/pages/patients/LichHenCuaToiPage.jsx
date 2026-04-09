import { useCallback, useEffect, useMemo, useState } from 'react'
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
	Tooltip,
	Typography,
	message,
} from 'antd'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import AppointmentDetails from '../../components/AppointmentDetails'
import DoiLichForm from '../../components/DoiLichForm'
import {
	fetchCancellationReasons,
	fetchMyAppointments,
	getApiErrorMessage,
	submitCancelAppointment,
	submitRescheduleAppointment,
} from '../../../../Services/schedulingService'
import { MODAL_STYLES, TABLE_STYLES } from '../../styles/const-styles'

const { useBreakpoint } = Grid
const { Paragraph, Text, Title } = Typography

const appointmentStatusMeta = {
	dang_cho: { label: 'Đang chờ', color: 'gold' },
	da_thanh_toan: { label: 'Đã thanh toán', color: 'blue' },
	da_xac_nhan: { label: 'Đã xác nhận', color: 'cyan' },
	da_hoan_tat: { label: 'Đã hoàn tất', color: 'green' },
	da_huy: { label: 'Đã hủy', color: 'red' },
	khong_den: { label: 'Không đến', color: 'orange' },
}

const formatCurrency = (value) =>
	Number(value || 0).toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	})

const formatTimeLabel = (timeString) => String(timeString || '').slice(0, 5)

export default function LichHenCuaToiPage() {
	const [loading, setLoading] = useState(false)
	const [isCancelSubmitting, setIsCancelSubmitting] = useState(false)
	const [isRescheduleSubmitting, setIsRescheduleSubmitting] = useState(false)
	const [appointments, setAppointments] = useState([])
	const [cancelReasons, setCancelReasons] = useState([])
	const [statusFilter, setStatusFilter] = useState('all')
	const [keyword, setKeyword] = useState('')
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
	const [cancelingAppointment, setCancelingAppointment] = useState(null)
	const [reschedulingAppointment, setReschedulingAppointment] = useState(null)
	const [lyDoHuyId, setLyDoHuyId] = useState(null)
	const [lyDoHuyKhac, setLyDoHuyKhac] = useState('')
	const screens = useBreakpoint()

	const loadAppointments = useCallback(async () => {
		setLoading(true)
		try {
			const { items } = await fetchMyAppointments({
				page: 1,
				pageSize: 100,
			})
			setAppointments(items)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải danh sách lịch hẹn.'))
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadAppointments()
	}, [loadAppointments])

	useEffect(() => {
		const loadReasons = async () => {
			try {
				const items = await fetchCancellationReasons()
				setCancelReasons(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách lý do hủy.'))
			}
		}

		loadReasons()
	}, [])

	const selectedAppointment = useMemo(
		() => appointments.find((item) => item.id === selectedAppointmentId) || null,
		[appointments, selectedAppointmentId],
	)

	const rows = useMemo(() => {
		return appointments
			.map((appointment) => {
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
					doctorName: appointment.bac_si?.ho_ten || '-',
					specialtyName: appointment.chuyen_khoa?.ten_chuyen_khoa || '-',
					roomName: appointment.khung_gio_kham?.phong_kham?.ten_phong || 'Chưa xác định',
					slotLabel: slot
						? `${formatTimeLabel(slot.gio_bat_dau)} - ${formatTimeLabel(slot.gio_ket_thuc)}`
						: 'Chưa xác định',
					total,
				}
			})
			.filter((item) => {
				const matchedStatus = statusFilter === 'all' || item.trang_thai === statusFilter
				const normalizedKeyword = keyword.trim().toLowerCase()
				const matchedKeyword =
					normalizedKeyword.length === 0 ||
					String(item.ma_lich_hen || '').toLowerCase().includes(normalizedKeyword) ||
					String(item.doctorName || '').toLowerCase().includes(normalizedKeyword)

				return matchedStatus && matchedKeyword
			})
	}, [appointments, keyword, statusFilter])

	const handleCancelClick = (record) => {
		setCancelingAppointment(record)
		setLyDoHuyId(null)
		setLyDoHuyKhac('')
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
			await loadAppointments()
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
			await loadAppointments()
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể đổi lịch hẹn.'))
		} finally {
			setIsRescheduleSubmitting(false)
		}
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
			title: 'Phòng khám',
			dataIndex: 'roomName',
			key: 'roomName',
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
			align: 'center',
			key: 'actions',
			render: (_, record) => {
				const canModify = ['dang_cho', 'da_xac_nhan'].includes(record.trang_thai)

				return (
					<Space wrap>
						<Tooltip title="Xem chi tiết">
							<Button
								icon={<EyeOutlined />}
								onClick={() => setSelectedAppointmentId(record.id)}
							/>
						</Tooltip>


						<Tooltip title={"Đổi lịch" + (canModify ? "" : " (không thể thực hiện)")}>
							<Button
								icon={<EditOutlined />}
								disabled={!canModify}
								onClick={() => setReschedulingAppointment(record)}
							/>
						</Tooltip>

						<Tooltip title={"Hủy lịch" + (canModify ? "" : " (không thể thực hiện)")}>
							<Button
								danger
								disabled={!canModify}
								onClick={() => handleCancelClick(record)}
							>
								Hủy lịch
							</Button>
						</Tooltip>
					</Space>
				)
			},
		}
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
							message="Thao tác đổi/hủy lịch được backend kiểm tra theo quy định thời gian cấu hình hệ thống."
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
							<Table
								className={TABLE_STYLES.header}
								rowKey="id"
								columns={columns}
								dataSource={rows}
								loading={loading}
								pagination={{ pageSize: 5, hideOnSinglePage: true }}
							/>
						) : (
							<Space direction="vertical" className="w-full" size={10}>
								<Space direction="vertical" className="w-full" size={10}>
									{rows.map((row) => {
										const canModify = ['dang_cho', 'da_xac_nhan'].includes(row.trang_thai);
										const disabledText = !canModify ? " (không thể thực hiện)" : "";

										return (
											<Card key={row.id} className="border-[#E2E8F0]">
												<Space direction="vertical" className="w-full" size={8}>
													<div className="flex items-center justify-between">
														<Text strong>{row.ma_lich_hen}</Text>
														{renderStatus(row.trang_thai)}
													</div>

													<Text>{row.specialtyName} - {row.doctorName}</Text>
													<Text type="secondary">
														{row.ngay_hen} | {row.slotLabel}
													</Text>
													<Text type="secondary">Phòng: {row.roomName}</Text>
													<Text strong>{formatCurrency(row.total)}</Text>

													<Space wrap>
														<Tooltip title="Xem chi tiết">
															<Button
																icon={<EyeOutlined />}
																size="small"
																onClick={() => setSelectedAppointmentId(row.id)}
															/>
														</Tooltip>

														<Tooltip title={`Đổi lịch${disabledText}`}>
															<Button
																icon={<EditOutlined />}
																size="small"
																disabled={!canModify}
																onClick={() => setReschedulingAppointment(row)}
															/>
														</Tooltip>

														<Tooltip title={`Hủy lịch${disabledText}`}>
															<Button
																size="small"
																danger
																disabled={!canModify}
																onClick={() => handleCancelClick(row)}
															>
																Hủy lịch
															</Button>
														</Tooltip>
													</Space>
												</Space>
											</Card>
										);
									})}
								</Space>
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
				style={MODAL_STYLES.verticalStatic}
				destroyOnClose
			>
				<AppointmentDetails appointment={selectedAppointment} />
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
						options={cancelReasons.map((reason) => ({
							value: reason.id,
							label: reason.ten_ly_do,
						}))}
					/>
					<Input.TextArea
						rows={3}
						value={lyDoHuyKhac}
						onChange={(event) => setLyDoHuyKhac(event.target.value)}
						placeholder="Nhập lý do hủy khác (nếu có)"
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
