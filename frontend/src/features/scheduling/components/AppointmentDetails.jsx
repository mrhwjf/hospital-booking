import { Alert, Card, Descriptions, List, Tag, Typography } from 'antd'
import {
	appointmentItems,
	appointmentStatusMeta,
	cancellationReasons,
	doctors,
	formatCurrency,
	formatTimeLabel,
	packages,
	services,
	specialties,
	timeSlots,
} from '../mockData'

const { Paragraph, Text, Title } = Typography

export default function AppointmentDetails({ appointment }) {
	if (!appointment) {
		return <Alert type="info" showIcon message="Chưa có dữ liệu lịch hẹn để hiển thị." />
	}

	const doctor = doctors.find((item) => item.id === appointment.bac_si_id)
	const specialty = specialties.find((item) => item.id === appointment.chuyen_khoa_id)
	const slot = timeSlots.find((item) => item.id === appointment.khung_gio_id)
	const statusMeta = appointmentStatusMeta[appointment.trang_thai]
	const cancelReason = cancellationReasons.find((item) => item.id === appointment.ly_do_huy_id)

	const items = appointmentItems
		.filter((item) => item.lich_hen_id === appointment.id)
		.map((item) => {
			if (item.dich_vu_id) {
				const service = services.find((serviceRow) => serviceRow.id === item.dich_vu_id)
				return {
					label: service?.ten_dich_vu || 'Dịch vụ không xác định',
					quantity: item.so_luong,
					amount: (service?.gia_dich_vu || 0) * item.so_luong,
				}
			}

			const pkg = packages.find((pkgRow) => pkgRow.id === item.goi_kham_id)
			return {
				label: pkg?.ten_goi_kham || 'Gói khám không xác định',
				quantity: item.so_luong,
				amount: (pkg?.gia_goi_kham || 0) * item.so_luong,
			}
		})

	const total = items.reduce((sum, item) => sum + item.amount, 0)

	return (
		<div className="space-y-3">
			<Card className="border-slate-200">
				<div className="mb-3 flex items-center justify-between">
					<Title level={5} className="mb-0">Chi tiết lịch hẹn</Title>
					<Tag color={statusMeta?.color || 'default'}>{statusMeta?.label || appointment.trang_thai}</Tag>
				</div>
				<Descriptions column={1} size="small" bordered>
					<Descriptions.Item label="Mã lịch hẹn">{appointment.ma_lich_hen}</Descriptions.Item>
					<Descriptions.Item label="Bác sĩ">{doctor?.ho_ten || 'N/A'}</Descriptions.Item>
					<Descriptions.Item label="Chuyên khoa">{specialty?.ten_chuyen_khoa || 'N/A'}</Descriptions.Item>
					<Descriptions.Item label="Ngày hẹn">{appointment.ngay_hen}</Descriptions.Item>
					<Descriptions.Item label="Khung giờ">
						{slot
							? `${formatTimeLabel(slot.gio_bat_dau)} - ${formatTimeLabel(slot.gio_ket_thuc)}`
							: 'Chưa gán'}
					</Descriptions.Item>
					<Descriptions.Item label="Lý do khám">{appointment.ly_do_kham || '-'}</Descriptions.Item>
					<Descriptions.Item label="Ghi chú bệnh nhân">{appointment.ghi_chu || '-'}</Descriptions.Item>
					{appointment.trang_thai === 'da_huy' && (
						<Descriptions.Item label="Lý do hủy">
							{cancelReason?.ten_ly_do || appointment.ly_do_huy_khac || 'Không xác định'}
						</Descriptions.Item>
					)}
				</Descriptions>
			</Card>

			<Card className="border-slate-200">
				<Title level={5}>Dịch vụ đã đăng ký</Title>
				<List
					dataSource={items}
					renderItem={(item) => (
						<List.Item>
							<div className="flex w-full items-center justify-between">
								<Text>{item.label} x{item.quantity}</Text>
								<Text strong>{formatCurrency(item.amount)}</Text>
							</div>
						</List.Item>
					)}
					locale={{ emptyText: 'Không có dịch vụ/gói khám cho lịch hẹn này.' }}
				/>
				<div className="mt-2 border-t border-dashed border-slate-200 pt-2 text-right">
					<Text strong className="text-[#0F766E]">Tổng tạm tính: {formatCurrency(total)}</Text>
				</div>
			</Card>

			<Alert
				type="info"
				showIcon
				message="Thông tin ở chế độ chỉ đọc, không hỗ trợ chỉnh sửa trên màn hình này."
			/>
			<Paragraph className="mb-0 text-xs text-slate-400">
				Ghi chú nội bộ và dữ liệu nhạy cảm không hiển thị cho bệnh nhân.
			</Paragraph>
		</div>
	)
}
