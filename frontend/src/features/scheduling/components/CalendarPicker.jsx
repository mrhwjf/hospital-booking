import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Alert, Calendar, Card, Space, Typography, message, Segmented } from 'antd'
import TimeSlotCard from './TimeSlotCard'
import { doctorLeaveDates, generateDoctorTimeslots, holidays, workingSchedules } from '../mockData'
import "../styles/scheduling-domain-styles.css"

const { Text } = Typography

const toIsoDate = (value) => dayjs(value).format('YYYY-MM-DD')
const isSunday = (day) => dayjs(day).day() === 0

export default function CalendarPicker({
	doctorId,
	selectedDate,
	selectedSlotKey,
	onDateChange,
	onSlotChange,
	onSlotsChange,
	schedules = workingSchedules,
	holidayRows = holidays,
	leaveRows = doctorLeaveDates,
}) {
	const availableDates = useMemo(() => {
		if (!doctorId) {
			return []
		}

		const rows = schedules.filter(
			(item) => item.bac_si_id === doctorId && item.trang_thai === 'hoat_dong',
		)
		return Array.from(new Set(rows.map((item) => item.ngay_lam_viec))).sort()
	}, [doctorId, schedules])

	const selectedSlots = useMemo(
		() =>
			generateDoctorTimeslots({
				doctorId,
				date: selectedDate,
			}),
		[doctorId, selectedDate],
	)

	const [slotPeriod, setSlotPeriod] = useState('morning')

	useEffect(() => {
		onSlotsChange?.(selectedSlots)
	}, [onSlotsChange, selectedSlots])

	const holiday = useMemo(
		() =>
			holidayRows.find(
				(item) => item.ngay === selectedDate && item.trang_thai === 'hoat_dong',
			),
		[holidayRows, selectedDate],
	)

	const leave = useMemo(
		() =>
			leaveRows.find(
				(item) =>
					item.bac_si_id === doctorId &&
					item.ngay === selectedDate &&
					item.trang_thai === 'hoat_dong',
			),
		[doctorId, leaveRows, selectedDate],
	)

	const filteredSlots = useMemo(() => {
		return selectedSlots.filter((slot) => {
			const hour = Number(slot.gio_bat_dau.split(':')[0])

			if (slotPeriod === 'morning') {
				return hour < 12
			}

			return hour >= 12
		})
	}, [selectedSlots, slotPeriod])

	const isBlockedDate = Boolean(
		holiday ||
		isSunday(selectedDate) ||
		(leave && !leave.gio_bat_dau && !leave.gio_ket_thuc)
	)
	const leaveDateMap = useMemo(() => {
		const map = new Set()
		leaveRows
			.filter((item) => item.bac_si_id === doctorId && item.trang_thai === 'hoat_dong')
			.forEach((item) => map.add(item.ngay))
		return map
	}, [doctorId, leaveRows])

	const holidayDateMap = useMemo(() => {
		const map = new Set()
		holidayRows
			.filter((item) => item.trang_thai === 'hoat_dong')
			.forEach((item) => map.add(item.ngay))
		return map
	}, [holidayRows])

	const isBlocked = (iso) => {
		return (
			isSunday(iso) ||
			holidayDateMap.has(iso) ||
			leaveDateMap.has(iso)
		)
	}

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Card className="border-[#E2E8F0]">
				<Text strong>Chọn ngày khám</Text>
				<Calendar
					fullscreen={false}
					value={selectedDate ? dayjs(selectedDate) : dayjs()}
					onSelect={(value) => {
						const iso = toIsoDate(value)
						if (!availableDates.includes(iso)) {
							message.info('Ngày này không có lịch làm việc của bác sĩ.')
						}
						onDateChange?.(iso)
					}}
					dateFullCellRender={(value) => {
						const iso = toIsoDate(value)

						const blocked = isBlocked(iso)
						const isHoliday = holidayDateMap.has(iso)
						const isLeave = leaveDateMap.has(iso)
						// const sunday = value.day() === 0
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
									{/* {sunday && (
										<Text className="text-xs text-red-500">Chủ nhật</Text>
									)} */}
									{isHoliday && (
										<Text className="text-xs text-amber-500">Nghỉ lễ</Text>
									)}
									{isLeave && (
										<Text className="text-xs text-red-500">Bác sĩ nghỉ</Text>
									)}
								</div>
							</div>
						)
					}}
				/>
			</Card>

			{holiday && (
				<Alert
					type="warning"
					showIcon
					message={`Bệnh viện nghỉ ngày ${selectedDate}: ${holiday.ten_ngay_nghi}`}
				/>
			)}

			{leave && (
				<Alert
					type="warning"
					showIcon
					message={`Bác sĩ nghỉ ngày ${selectedDate}. Lý do: ${leave.ly_do}`}
				/>
			)}

			<Segmented
				value={slotPeriod}
				onChange={setSlotPeriod}
				options={[
					{ label: 'Buổi sáng', value: 'morning' },
					{ label: 'Buổi chiều', value: 'afternoon' },
				]}
				className="segmented-options"
			/>

			<div className="grid gap-3 lg:grid-cols-2">
				{filteredSlots.map((slot) => (
					<TimeSlotCard
						key={slot.id}
						date={selectedDate}
						slot={slot}
						blocked={isBlockedDate}
						selected={selectedSlotKey === slot.slot_key}
						onSelect={(value) => onSlotChange?.(value)}
					/>
				))}
			</div>

		</Space>
	)
}
