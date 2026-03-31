import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Alert, Calendar, Card, Space, Typography, message, Segmented } from 'antd'
import TimeSlotCard from './TimeSlotCard'
import { SEGMENTED_STYLES } from '../styles/const-styles'

const { Text } = Typography

const toIsoDate = (value) => dayjs(value).format('YYYY-MM-DD')

export default function CalendarPicker({
	selectedDate,
	selectedSlotKey,
	onDateChange,
	onSlotChange,
	onSlotsChange,
	scheduleItems = [],
	loading = false,
}) {
	const availableDates = useMemo(() => {
		return Array.from(new Set(scheduleItems.map((item) => item.ngay_lam_viec))).sort()
	}, [scheduleItems])

	const selectedSchedules = useMemo(
		() => scheduleItems.filter((item) => item.ngay_lam_viec === selectedDate),
		[scheduleItems, selectedDate],
	)

	const selectedSlots = useMemo(() => {
		return selectedSchedules
			.flatMap((schedule) => schedule.khung_gio || [])
			.map((slot) => ({
				...slot,
				ngay_lam_viec: selectedDate,
			}))
			.sort((a, b) => String(a.gio_bat_dau).localeCompare(String(b.gio_bat_dau)))
	}, [selectedDate, selectedSchedules])

	const [slotPeriod, setSlotPeriod] = useState('morning')

	useEffect(() => {
		onSlotsChange?.(selectedSlots)
	}, [onSlotsChange, selectedSlots])

	const holiday = selectedSchedules.find((item) => item.ngay_nghi_le)?.ngay_nghi_le || null

	const filteredSlots = useMemo(() => {
		return selectedSlots.filter((slot) => {
			const hour = Number(slot.gio_bat_dau.split(':')[0])

			if (slotPeriod === 'morning') {
				return hour < 12
			}

			return hour >= 12
		})
	}, [selectedSlots, slotPeriod])

	const holidayDateMap = useMemo(() => {
		const map = new Set()
		scheduleItems.forEach((item) => {
			if (item.ngay_nghi_le) {
				map.add(item.ngay_lam_viec)
			}
		})
		return map
	}, [scheduleItems])

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Card className="border-[#E2E8F0]">
				<Text strong>Chọn ngày khám</Text>
				<Calendar
					fullscreen={false}
					value={selectedDate ? dayjs(selectedDate) : dayjs()}
					disabledDate={(current) => !availableDates.includes(toIsoDate(current))}
					onSelect={(value) => {
						const iso = toIsoDate(value)
						if (!availableDates.includes(iso)) {
							message.info('Ngày này không có lịch làm việc của bác sĩ.')
							return
						}
						onDateChange?.(iso)
					}}
					dateFullCellRender={(value) => {
						const iso = toIsoDate(value)
						const blocked = !availableDates.includes(iso)
						const isHoliday = holidayDateMap.has(iso)
						const selected = selectedDate === iso

						return (
							<div
								className={`
				h-full p-1 rounded transition-colors
				${blocked ? 'bg-gray-200 text-gray-400' : ''}
				${selected ? 'bg-teal-600 text-white' : ''}
				hover:bg-blue-100
			`}
							>
								<div className="font-medium">{value.date()}</div>

								<div className="space-y-1">
									{isHoliday && (
										<Text className="text-xs text-amber-500">Nghỉ lễ</Text>
									)}
								</div>
							</div>
						)
					}}
				/>
				{loading && <Text className="text-slate-500">Đang tải lịch làm việc...</Text>}
			</Card>

			{holiday && (
				<Alert
					type="warning"
					showIcon
					title={`Bệnh viện nghỉ ngày ${selectedDate}: ${holiday.ten_ngay_nghi}`}
				/>
			)}

			<Segmented
				value={slotPeriod}
				onChange={setSlotPeriod}
				options={[
					{ label: 'Buổi sáng', value: 'morning' },
					{ label: 'Buổi chiều', value: 'afternoon' },
				]}
				className={SEGMENTED_STYLES}
			/>

			<div className="grid gap-3 lg:grid-cols-2">
				{filteredSlots.map((slot) => (
					<TimeSlotCard
						key={slot.slot_key}
						date={selectedDate}
						slot={slot}
						blocked={Boolean(holiday)}
						selected={selectedSlotKey === slot.slot_key}
						onSelect={(value) => onSlotChange?.(value)}
					/>
				))}
			</div>

		</Space>
	)
}
