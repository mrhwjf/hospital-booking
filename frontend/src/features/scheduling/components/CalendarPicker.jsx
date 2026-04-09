import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Alert, Calendar, Card, Space, Typography, message, Segmented } from 'antd'
import TimeSlotCard from './TimeSlotCard'
import { SEGMENTED_STYLES } from '../styles/const-styles'

const { Text } = Typography

const toIsoDate = (value) => dayjs(value).format('YYYY-MM-DD')

const toMinutes = (timeValue) => {
	if (!timeValue) {
		return null
	}

	const [hour = '0', minute = '0'] = String(timeValue).split(':')
	return Number(hour) * 60 + Number(minute)
}

const isTimeOverlap = (leftStart, leftEnd, rightStart, rightEnd) => {
	const leftStartMinute = toMinutes(leftStart)
	const leftEndMinute = toMinutes(leftEnd)
	const rightStartMinute = toMinutes(rightStart)
	const rightEndMinute = toMinutes(rightEnd)

	if (
		leftStartMinute === null
		|| leftEndMinute === null
		|| rightStartMinute === null
		|| rightEndMinute === null
	) {
		return false
	}

	return leftStartMinute < rightEndMinute && leftEndMinute > rightStartMinute
}

const formatLeaveRangeLabel = (range) => {
	if (!range?.gio_bat_dau || !range?.gio_ket_thuc) {
		return null
	}

	const timeLabel = `${String(range.gio_bat_dau).slice(0, 5)}-${String(range.gio_ket_thuc).slice(0, 5)}`
	if (!range?.ly_do) {
		return timeLabel
	}

	return `${timeLabel} (${range.ly_do})`
}

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
		return Array.from(
			new Set(
				scheduleItems
					.filter((item) => item.trang_thai === 'hoat_dong')
					.map((item) => item.ngay_lam_viec),
			),
		).sort()
	}, [scheduleItems])

	const selectedSchedules = useMemo(
		() =>
			scheduleItems.filter(
				(item) => item.ngay_lam_viec === selectedDate && item.trang_thai === 'hoat_dong',
			),
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

	const holiday = selectedSchedules.find((item) => item.ngay_nghi_le)?.ngay_nghi_le || null

	const doctorLeaveDateMap = useMemo(() => {
		const map = new Map()

		scheduleItems.forEach((item) => {
			const leave = item?.ngay_nghi_bac_si
			if (!leave?.co_nghi) {
				return
			}

			const dateKey = item.ngay_lam_viec
			if (!dateKey) {
				return
			}

			const previous = map.get(dateKey) || {
				co_nghi: true,
				ca_ngay: false,
				khung_nghi: [],
			}

			previous.ca_ngay = previous.ca_ngay || Boolean(leave.ca_ngay)

			const leaveRanges = Array.isArray(leave.khung_nghi) ? leave.khung_nghi : []
			leaveRanges.forEach((range) => {
				if (!range?.gio_bat_dau || !range?.gio_ket_thuc) {
					return
				}

				const duplicated = previous.khung_nghi.some(
					(itemRange) =>
						itemRange.gio_bat_dau === range.gio_bat_dau
						&& itemRange.gio_ket_thuc === range.gio_ket_thuc
						&& String(itemRange.ly_do || '') === String(range.ly_do || ''),
				)

				if (!duplicated) {
					previous.khung_nghi.push({
						gio_bat_dau: range.gio_bat_dau,
						gio_ket_thuc: range.gio_ket_thuc,
						ly_do: range.ly_do || null,
					})
				}
			})

			map.set(dateKey, previous)
		})

		return map
	}, [scheduleItems])

	const selectedDoctorLeave = selectedDate ? doctorLeaveDateMap.get(selectedDate) || null : null

	const leaveAwareSlots = useMemo(() => {
		if (!selectedDoctorLeave?.co_nghi) {
			return selectedSlots
		}

		if (selectedDoctorLeave.ca_ngay) {
			return selectedSlots.map((slot) => ({
				...slot,
				trang_thai: slot.trang_thai === 'trong' ? 'khoa' : slot.trang_thai,
				ly_do_khoa: slot.trang_thai === 'trong' ? 'nghi_ca_ngay' : slot.ly_do_khoa,
			}))
		}

		const leaveRanges = Array.isArray(selectedDoctorLeave.khung_nghi) ? selectedDoctorLeave.khung_nghi : []

		return selectedSlots.map((slot) => {
			if (slot.trang_thai !== 'trong') {
				return slot
			}

			const overlapped = leaveRanges.some((range) =>
				isTimeOverlap(slot.gio_bat_dau, slot.gio_ket_thuc, range.gio_bat_dau, range.gio_ket_thuc),
			)

			if (!overlapped) {
				return slot
			}

			return {
				...slot,
				trang_thai: 'khoa',
				ly_do_khoa: 'nghi_theo_gio',
			}
		})
	}, [selectedDoctorLeave, selectedSlots])

	useEffect(() => {
		onSlotsChange?.(leaveAwareSlots)
	}, [leaveAwareSlots, onSlotsChange])

	const filteredSlots = useMemo(() => {
		return leaveAwareSlots.filter((slot) => {
			const hour = Number(slot.gio_bat_dau.split(':')[0])

			if (slotPeriod === 'morning') {
				return hour < 12
			}

			return hour >= 12
		})
	}, [leaveAwareSlots, slotPeriod])

	const hasActiveScheduleOnSelectedDate = useMemo(
		() =>
			scheduleItems.some(
				(item) => item.ngay_lam_viec === selectedDate && item.trang_thai === 'hoat_dong',
			),
		[scheduleItems, selectedDate],
	)

	const hasAvailableSlots = useMemo(
		() => filteredSlots.some((slot) => slot.trang_thai === 'trong'),
		[filteredSlots],
	)

	const holidayDateMap = useMemo(() => {
		const map = new Set()
		scheduleItems.forEach((item) => {
			if (item.ngay_nghi_le) {
				map.add(item.ngay_lam_viec)
			}
		})
		return map
	}, [scheduleItems])

	const hasDoctorLeaveOnSelectedDate = Boolean(selectedDoctorLeave?.co_nghi)
	const hasFullDayDoctorLeave = Boolean(selectedDoctorLeave?.ca_ngay)
	const leaveRangeLabels = (selectedDoctorLeave?.khung_nghi || [])
		.map((range) => formatLeaveRangeLabel(range))
		.filter(Boolean)

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
						const leaveMeta = doctorLeaveDateMap.get(iso)
						const isDoctorLeave = Boolean(leaveMeta?.co_nghi)
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
									{isDoctorLeave && (
										<Text className="text-xs text-rose-500">
											{leaveMeta?.ca_ngay ? 'BS nghỉ cả ngày' : 'BS nghỉ theo giờ'}
										</Text>
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
					message={`Bệnh viện nghỉ ngày ${selectedDate}: ${holiday.ten_ngay_nghi}`}
				/>
			)}

			{selectedDate && hasDoctorLeaveOnSelectedDate && (
				<Alert
					type={hasFullDayDoctorLeave ? 'error' : 'warning'}
					showIcon
					message={
						hasFullDayDoctorLeave
							? `Bác sĩ nghỉ cả ngày ${selectedDate}. Không thể đặt lịch trong ngày này.`
							: `Bác sĩ có lịch nghỉ theo giờ trong ngày ${selectedDate}. Một số khung giờ sẽ không khả dụng.`
					}
					description={!hasFullDayDoctorLeave && leaveRangeLabels.length > 0 ? `Khung nghỉ: ${leaveRangeLabels.join('; ')}` : undefined}
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

			{selectedDate && !loading && !hasActiveScheduleOnSelectedDate ? (
				<Alert
					type="info"
					showIcon
					message="Không có ca làm việc đang hoạt động vào ngày này. Vui lòng chọn ngày khác."
				/>
			) : null}

			{selectedDate && !loading && hasActiveScheduleOnSelectedDate && !hasAvailableSlots && !holiday && !hasDoctorLeaveOnSelectedDate ? (
				<Alert
					type="info"
					showIcon
					message={`Không có lịch khám nào khả dụng vào buổi ${slotPeriod === 'morning' ? 'sáng' : 'chiều'}. Vui lòng chọn ngày khác.`}
				/>
			) : null}

		</Space>
	)
}
