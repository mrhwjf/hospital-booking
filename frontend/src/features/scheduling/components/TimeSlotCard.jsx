import { Button, Card, Tag, Typography } from 'antd'
import { formatDateLabel, formatTimeLabel } from '../mockData'

const { Text } = Typography

const statusLabel = {
	trong: 'Còn trống',
	da_dat: 'Đã đặt',
	khoa: 'Tạm khóa',
}

const statusColor = {
	trong: 'green',
	da_dat: 'red',
	khoa: 'orange',
}

export default function TimeSlotCard({ date, slot, selected = false, blocked = false, onSelect }) {
	if (!slot) {
		return null
	}

	const disabled = blocked || slot.trang_thai !== 'trong'

	return (
		<Card className={selected ? 'border-[#0F766E] bg-teal-50/40' : 'border-slate-200'}>
			<div className="flex items-center justify-between gap-3">
				<div>
					<Text strong>{formatDateLabel(date)}</Text>
					<div>
						<Text className="text-slate-500">
							{formatTimeLabel(slot.gio_bat_dau)} - {formatTimeLabel(slot.gio_ket_thuc)}
						</Text>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Tag color={statusColor[slot.trang_thai] || 'default'}>{statusLabel[slot.trang_thai] || slot.trang_thai}</Tag>
					<Button type={selected ? 'primary' : 'default'} disabled={disabled} onClick={() => onSelect?.(slot)}>
						{selected ? 'Đã chọn' : 'Chọn'}
					</Button>
				</div>
			</div>
		</Card>
	)
}
