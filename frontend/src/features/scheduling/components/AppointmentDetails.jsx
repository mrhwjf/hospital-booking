import { useState } from 'react'
import { Alert, Card, Descriptions, Tag, Typography, Table, Segmented } from 'antd'
import { SEGMENTED_STYLES, TABLE_STYLES } from '../styles/const-styles'

const { Paragraph, Text, Title } = Typography

const appointmentStatusMeta = {
	dang_cho: { label: 'Đang chờ', color: 'gold' },
	da_thanh_toan: { label: 'Đã thanh toán', color: 'blue' },
	da_xac_nhan: { label: 'Đã xác nhận', color: 'cyan' },
	da_hoan_tat: { label: 'Đã hoàn tất', color: 'green' },
	da_huy: { label: 'Đã hủy', color: 'red' },
	khong_den: { label: 'Không đến', color: 'orange' },
}

const columns = [
	{
		title: 'Dịch vụ / Gói khám',
		dataIndex: 'label',
		key: 'label',
	},
	{
		title: 'Số lượng',
		dataIndex: 'quantity',
		key: 'quantity',
		align: 'center',
	},
	{
		title: 'Thành tiền',
		dataIndex: 'amount',
		key: 'amount',
		align: 'right',
		render: (value) => <Text strong>{formatCurrency(value)}</Text>,
	},
]

const formatCurrency = (value) =>
	Number(value || 0).toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	})

const formatTimeLabel = (timeString) => String(timeString || '').slice(0, 5)

export default function AppointmentDetails({ appointment }) {
	const [segment, setSegment] = useState('info');

	if (!appointment) {
		return <Alert type="info" showIcon message="Chưa có dữ liệu lịch hẹn để hiển thị." />
	}

	const statusMeta = appointmentStatusMeta[appointment.trang_thai]
	const slot = appointment.khung_gio_kham

	const items = (appointment.dich_vu_lich_hens || []).map((item) => {
		if (item.dich_vu) {
			return {
				label: item.dich_vu.ten_dich_vu || 'Dịch vụ không xác định',
				quantity: item.so_luong || 1,
				amount: (item.dich_vu.gia_dich_vu || 0) * (item.so_luong || 1),
			}
		}

		return {
			label: item.goi_kham?.ten_goi_kham || 'Gói khám không xác định',
			quantity: item.so_luong || 1,
			amount: (item.goi_kham?.gia_goi_kham || 0) * (item.so_luong || 1),
		}
	})

	const data = items.map((item, index) => ({
		key: index,
		...item,
	}))


	const total = items.reduce((sum, item) => sum + item.amount, 0)

	return (
		<div className="space-y-3">
			<div className='space-y-4'>
				<Segmented
					className={SEGMENTED_STYLES}
					block
					value={segment}
					onChange={setSegment}
					options={[
						{ label: 'Thông tin lịch hẹn', value: 'info' },
						{ label: 'Dịch vụ đăng ký', value: 'services' },
					]}
				/>

				{segment === 'info' && (
					<Card className="border-slate-500">
						<Descriptions column={1} size="small" bordered>
							<Descriptions.Item label="Mã lịch hẹn">
								{appointment.ma_lich_hen}
							</Descriptions.Item>

							<Descriptions.Item label="Bác sĩ">
								{appointment.bac_si?.ho_ten || 'N/A'}
							</Descriptions.Item>

							<Descriptions.Item label="Chuyên khoa">
								{appointment.chuyen_khoa?.ten_chuyen_khoa || 'N/A'}
							</Descriptions.Item>

							<Descriptions.Item label="Ngày hẹn">
								{appointment.ngay_hen}
							</Descriptions.Item>

							<Descriptions.Item label="Khung giờ">
								{slot
									? `${formatTimeLabel(slot.gio_bat_dau)} - ${formatTimeLabel(slot.gio_ket_thuc)}`
									: 'Chưa gắn khung giờ'}
							</Descriptions.Item>

							<Descriptions.Item label="Lý do khám">
								{appointment.ly_do_kham || '-'}
							</Descriptions.Item>

							<Descriptions.Item label="Ghi chú bệnh nhân">
								{appointment.ghi_chu || '-'}
							</Descriptions.Item>

							<Descriptions.Item label="Trạng thái">
								<Tag color={statusMeta?.color || 'default'}>
									{statusMeta?.label || appointment.trang_thai}
								</Tag>
							</Descriptions.Item>

							{appointment.trang_thai === 'da_huy' && (
								<Descriptions.Item label="Lý do hủy">
									{appointment.ly_do_huy?.ten_ly_do ||
										appointment.ly_do_huy_khac ||
										'Không xác định'}
								</Descriptions.Item>
							)}
						</Descriptions>
					</Card>
				)}

				{segment === 'services' && (
					<Card className="border-slate-500">
						<Title level={5}>Dịch vụ đã đăng ký</Title>

						<Table
							className={TABLE_STYLES.header}
							columns={columns}
							dataSource={data}
							pagination={false}
							size="small"
							locale={{ emptyText: 'Không có dịch vụ/gói khám cho lịch hẹn này.' }}
							scroll={{ x: 'max-content' }}
						/>

						<div className="mt-3 border-t border-dashed border-slate-500 pt-3 text-right">
							<Text strong className="text-[#0F766E]">
								Tổng tạm tính: {formatCurrency(total)}
							</Text>
						</div>
					</Card>
				)}
			</div>

			<Alert
				type="info"
				showIcon
				message="Thông tin ở chế độ chỉ đọc."
			/>
			{/* <Paragraph className="mb-0 text-xs text-slate-400">
				Ghi chú nội bộ và dữ liệu nhạy cảm không hiển thị cho bệnh nhân.
			</Paragraph> */}
		</div>
	)
}
