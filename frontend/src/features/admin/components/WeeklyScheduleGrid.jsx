import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
	CalendarOutlined,
	ClockCircleOutlined,
	EyeOutlined,
	InfoCircleOutlined,
	PauseCircleOutlined,
	PushpinOutlined,
	StopOutlined,
} from '@ant-design/icons'
import { Button, Empty, Modal, Tooltip, Typography } from 'antd'

const { Text } = Typography

const GRID_START_HOUR = 7
const GRID_END_HOUR = 17
const SLOT_HEIGHT = 56
const MIN_EVENT_HEIGHT = 22

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

const EVENT_COLORS = {
	holiday: '#dc2626',
	doctor_leave: '#16a34a',
	shift: '#2563eb',
	inactive: '#b45309',
	blocked: '#dc2626',
	skipped: '#94a3b8',
	warning: '#f59e0b',
}

const EVENT_TYPE_LABELS = {
	holiday: 'Nghỉ toàn viện',
	doctor_leave: 'Nghỉ bác sĩ',
	shift: 'Ca làm việc',
	inactive: 'Ca không hoạt động',
	blocked: 'Xung đột',
	skipped: 'Bỏ qua',
}

const resolveEventTypeIcon = (type) => {
	if (type === 'holiday') {
		return <CalendarOutlined className="mt-px text-[11px] opacity-95" />
	}

	if (type === 'inactive') {
		return <PauseCircleOutlined className="mt-px text-[11px] opacity-95" />
	}

	if (type === 'doctor_leave' || type === 'skipped') {
		return <StopOutlined className="mt-px text-[11px] opacity-95" />
	}

	return <InfoCircleOutlined className="mt-px text-[11px] opacity-90" />
}

const getDisplayHierarchyBucket = (type) => {
	if (type === 'holiday') {
		return 1
	}

	if (type === 'doctor_leave') {
		return 2
	}

	if (type === 'shift' || type === 'inactive') {
		return 3
	}

	return 4
}

const pickEventsByHierarchy = (events) => {
	if (!events.length) {
		return []
	}

	if (events.some((event) => event.type === 'holiday')) {
		return events.filter((event) => event.type === 'holiday')
	}

	if (events.some((event) => event.type === 'doctor_leave')) {
		return events.filter((event) => event.type === 'doctor_leave')
	}

	if (events.some((event) => event.type === 'shift' || event.type === 'inactive')) {
		return events.filter((event) => event.type === 'shift' || event.type === 'inactive')
	}

	return events
}

const toMinutes = (timeValue) => {
	if (!timeValue) {
		return null
	}

	const [hour = '0', minute = '0'] = String(timeValue).split(':')
	return Number(hour) * 60 + Number(minute)
}

const formatHourLabel = (hour) => `${String(hour).padStart(2, '0')}:00`

const formatEventTimeRange = (startMinute, endMinute) => {
	const startHour = String(Math.floor(startMinute / 60)).padStart(2, '0')
	const startMinuteText = String(startMinute % 60).padStart(2, '0')
	const endHour = String(Math.floor(endMinute / 60)).padStart(2, '0')
	const endMinuteText = String(endMinute % 60).padStart(2, '0')

	return `${startHour}:${startMinuteText} - ${endHour}:${endMinuteText}`
}

const arrangeEventsByColumns = (events) => {
	if (!events.length) {
		return []
	}

	const arranged = events
		.map((event) => ({ ...event }))
		.sort((left, right) => left.startMinute - right.startMinute || left.endMinute - right.endMinute)

	const active = []
	let cluster = []
	let maxColumnsInCluster = 1

	const finalizeCluster = () => {
		if (!cluster.length) {
			return
		}

		cluster.forEach((item) => {
			item.totalColumns = Math.max(maxColumnsInCluster, 1)
		})

		cluster = []
		maxColumnsInCluster = 1
	}

	arranged.forEach((event) => {
		for (let index = active.length - 1; index >= 0; index -= 1) {
			if (active[index].endMinute <= event.startMinute) {
				active.splice(index, 1)
			}
		}

		if (active.length === 0) {
			finalizeCluster()
		}

		const usedColumns = new Set(active.map((item) => item.columnIndex))
		let columnIndex = 0
		while (usedColumns.has(columnIndex)) {
			columnIndex += 1
		}

		event.columnIndex = columnIndex
		active.push(event)
		cluster.push(event)
		maxColumnsInCluster = Math.max(maxColumnsInCluster, active.length, columnIndex + 1)
	})

	finalizeCluster()
	return arranged
}

export default function WeeklyScheduleGrid({
	weekStart,
	events = [],
	emptyText = 'Không có dữ liệu lịch làm việc trong tuần này.',
	onEventClick,
}) {
	const [detailModalState, setDetailModalState] = useState({ open: false, dayIndex: null })
	const weekStartDate = useMemo(() => dayjs(weekStart).startOf('isoWeek'), [weekStart])

	const dayColumns = useMemo(() => {
		const hoursInGrid = GRID_END_HOUR - GRID_START_HOUR
		const gridStartMinute = GRID_START_HOUR * 60
		const gridEndMinute = GRID_END_HOUR * 60

		const normalizedEvents = (events || [])
			.map((event, index) => {
				const eventDate = dayjs(event.date)
				const dayIndex = eventDate.diff(weekStartDate, 'day')
				if (dayIndex < 0 || dayIndex > 6) {
					return null
				}

				const startMinuteRaw = toMinutes(event.startTime)
				const endMinuteRaw = toMinutes(event.endTime)
				if (startMinuteRaw === null || endMinuteRaw === null) {
					return null
				}

				const startMinute = Math.max(startMinuteRaw, gridStartMinute)
				const endMinute = Math.min(endMinuteRaw, gridEndMinute)
				if (endMinute <= startMinute) {
					return null
				}

				return {
					id: event.id || `${eventDate.format('YYYY-MM-DD')}-${index}`,
					dayIndex,
					date: eventDate.format('YYYY-MM-DD'),
					startMinute,
					endMinute,
					title: event.title,
					subtitle: event.subtitle,
					type: event.type || 'shift',
					typeLabel: EVENT_TYPE_LABELS[event.type] || 'Khác',
					color: event.color || EVENT_COLORS[event.type] || EVENT_COLORS.shift,
					textColor: event.textColor || '#ffffff',
				}
			})
			.filter(Boolean)

		const detailColumns = Array.from({ length: 7 }, (_, dayIndex) => {
			const dayEvents = normalizedEvents
				.filter((event) => event.dayIndex === dayIndex)
				.sort((left, right) => {
					const bucketDiff = getDisplayHierarchyBucket(left.type) - getDisplayHierarchyBucket(right.type)
					if (bucketDiff !== 0) {
						return bucketDiff
					}

					if (left.startMinute !== right.startMinute) {
						return left.startMinute - right.startMinute
					}

					return left.endMinute - right.endMinute
				})

			return dayEvents
		})

		const grouped = detailColumns.map((dayEvents) => {
			const displayEvents = pickEventsByHierarchy(dayEvents)
			return arrangeEventsByColumns(displayEvents)
		})

		return {
			hoursInGrid,
			gridStartMinute,
			columns: grouped,
			detailColumns,
		}
	}, [events, weekStartDate])

	const selectedDetailDate = useMemo(() => {
		if (detailModalState.dayIndex === null) {
			return null
		}

		return weekStartDate.add(detailModalState.dayIndex, 'day')
	}, [detailModalState.dayIndex, weekStartDate])

	const selectedDetailEvents = useMemo(() => {
		if (detailModalState.dayIndex === null) {
			return []
		}

		return dayColumns.detailColumns[detailModalState.dayIndex] || []
	}, [dayColumns.detailColumns, detailModalState.dayIndex])

	const hasEvents = useMemo(() => dayColumns.columns.some((items) => items.length > 0), [dayColumns.columns])

	return (
		<div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
			<div className="grid" style={{ gridTemplateColumns: '72px repeat(7, minmax(0, 1fr))' }}>
				<div className="border-b border-r border-[#E2E8F0] px-2 py-3 text-xs font-semibold text-slate-500">
					Giờ
				</div>
				{DAY_LABELS.map((label, dayIndex) => {
					const date = weekStartDate.add(dayIndex, 'day')
					const dayDetailCount = dayColumns.detailColumns[dayIndex]?.length || 0
					const canOpenDetails = dayDetailCount > 1
					return (
						<div key={label} className="border-b border-r border-[#E2E8F0] px-2 py-2 text-center last:border-r-0">
							<div className="text-xs font-semibold text-slate-600">{label}</div>
							<div className="text-xs text-slate-500">{date.format('DD/MM')}</div>
							{canOpenDetails ? (
								<div className="mt-1 flex justify-center">
									<Tooltip title={`Xem chi tiết ${dayDetailCount} mục trong ngày`}>
										<Button
											type="text"
											size="small"
											icon={<EyeOutlined />}
											onClick={() => setDetailModalState({ open: true, dayIndex })}
										/>
									</Tooltip>
								</div>
							) : null}
						</div>
					)
				})}

				<div className="relative border-r border-[#E2E8F0] bg-slate-50">
					{Array.from({ length: dayColumns.hoursInGrid + 1 }, (_, index) => {
						const hour = GRID_START_HOUR + index
						return (
							<div
								key={hour}
								className="flex items-start justify-end pr-2 text-[11px] text-slate-500"
								style={{ height: index === dayColumns.hoursInGrid ? 0 : SLOT_HEIGHT }}
							>
								{formatHourLabel(hour)}
							</div>
						)
					})}
				</div>

				{dayColumns.columns.map((columnEvents, dayIndex) => {
					const date = weekStartDate.add(dayIndex, 'day').format('YYYY-MM-DD')
					return (
						<div
							key={date}
							className="relative border-r border-[#E2E8F0] last:border-r-0"
							style={{ height: dayColumns.hoursInGrid * SLOT_HEIGHT }}
						>
							{Array.from({ length: dayColumns.hoursInGrid + 1 }, (_, index) => (
								<div
									key={`${date}-line-${index}`}
									className="absolute left-0 right-0 border-t border-dashed border-[#E2E8F0]"
									style={{ top: index * SLOT_HEIGHT }}
								/>
							))}

							{columnEvents.map((event) => {
								const top = ((event.startMinute - dayColumns.gridStartMinute) / 60) * SLOT_HEIGHT
								const height = Math.max(((event.endMinute - event.startMinute) / 60) * SLOT_HEIGHT - 4, MIN_EVENT_HEIGHT)
								const widthPercent = 100 / (event.totalColumns || 1)
								const leftPercent = widthPercent * (event.columnIndex || 0)
								const timeRangeLabel = formatEventTimeRange(event.startMinute, event.endMinute)
								const tooltipContent = (
									<div className="max-w-65 space-y-1 text-xs">
										<div className="font-semibold">{event.title}</div>
										{event.subtitle ? <div>{event.subtitle}</div> : null}
										<div className="opacity-80">{timeRangeLabel}</div>
									</div>
								)

								return (
									<Tooltip key={event.id} title={tooltipContent} trigger={['hover', 'click']} placement="topLeft">
										<button
											type="button"
											onClick={() => onEventClick?.(event)}
											className="absolute overflow-hidden rounded-md px-2 py-1.5 text-left text-xs leading-snug shadow-sm"
											style={{
												top,
												height,
												left: `calc(${leftPercent}% + 2px)`,
												width: `calc(${widthPercent}% - 4px)`,
												backgroundColor: event.color,
												color: event.textColor,
												border: 'none',
												cursor: onEventClick ? 'pointer' : 'default',
											}}
										>
											<div className="flex items-start gap-1">
												{resolveEventTypeIcon(event.type)}
												<span className="whitespace-normal wrap-break-word font-semibold">{event.title}</span>
											</div>
											{event.subtitle ? (
												<div className="mt-1 flex items-start gap-1 opacity-95">
													<PushpinOutlined className="mt-px text-[11px] opacity-85" />
													<span className="whitespace-normal wrap-break-word">{event.subtitle}</span>
												</div>
											) : null}
											<div className="mt-1 inline-flex items-center gap-1 rounded-md border border-white/45 bg-white/20 px-1.5 py-0.5 text-[11px] font-medium text-white/95">
												<ClockCircleOutlined className="text-[11px]" />
												<span>{timeRangeLabel}</span>
											</div>
										</button>
									</Tooltip>
								)
							})}
						</div>
					)
				})}
			</div>

			{!hasEvents ? (
				<div className="py-6">
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
				</div>
			) : null}

			<div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[#E2E8F0] pt-3 text-xs">
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.holiday }} />
					<Text>Nghỉ toàn viện</Text>
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.doctor_leave }} />
					<Text>Nghỉ bác sĩ</Text>
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.shift }} />
					<Text>Ca làm việc</Text>
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.inactive }} />
					<Text>Ca không hoạt động</Text>
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.blocked }} />
					<Text>Xung đột</Text>
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS.skipped }} />
					<Text>Bỏ qua</Text>
				</div>
			</div>

			<Modal
				title={selectedDetailDate ? `Chi tiết lịch ngày ${selectedDetailDate.format('DD/MM/YYYY')}` : 'Chi tiết lịch trong ngày'}
				open={detailModalState.open}
				onCancel={() => setDetailModalState({ open: false, dayIndex: null })}
				footer={null}
				width={680}
			>
				{selectedDetailEvents.length === 0 ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu chi tiết." />
				) : (
					<div className="space-y-2">
						{selectedDetailEvents.map((event) => {
							const timeRangeLabel = formatEventTimeRange(event.startMinute, event.endMinute)
							return (
								<div key={`detail-${event.id}`} className="rounded-md border border-[#E2E8F0] px-3 py-2 text-xs">
									<div className="font-semibold text-slate-700">
										{event.typeLabel}: {event.title}
									</div>
									<div className="mt-0.5 text-slate-500">{timeRangeLabel}</div>
									{event.subtitle ? <div className="mt-0.5 text-slate-600">{event.subtitle}</div> : null}
								</div>
							)
						})}
					</div>
				)}
			</Modal>
		</div>
	)
}
