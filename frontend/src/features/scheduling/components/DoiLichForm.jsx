import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Select, Space, Typography, message } from 'antd'
import CalendarPicker from './CalendarPicker'
import {
	fetchDoctorSchedule,
	fetchDoctorsBySpecialty,
	getApiErrorMessage,
} from '../../../services/schedulingService'

const { Text } = Typography

export default function DoiLichForm({ appointment, onSubmit, onCancel, submitting = false }) {
	const [loadingDoctors, setLoadingDoctors] = useState(false)
	const [loadingSchedule, setLoadingSchedule] = useState(false)
	const [doctors, setDoctors] = useState([])
	const [scheduleItems, setScheduleItems] = useState([])
	const [calendarSlots, setCalendarSlots] = useState([])

	const [doctorId, setDoctorId] = useState(appointment?.bac_si_id || null)
	const [ngayHen, setNgayHen] = useState(appointment?.ngay_hen || null)
	const [selectedSlotKey, setSelectedSlotKey] = useState(appointment?.khung_gio_id || null)

	useEffect(() => {
		if (!appointment?.chuyen_khoa_id) {
			setDoctors([])
			return
		}

		const loadDoctors = async () => {
			setLoadingDoctors(true)
			try {
				const items = await fetchDoctorsBySpecialty({
					chuyenKhoaId: appointment.chuyen_khoa_id,
				})
				setDoctors(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Khong the tai danh sach bac si.'))
			} finally {
				setLoadingDoctors(false)
			}
		}

		loadDoctors()
	}, [appointment?.chuyen_khoa_id])

	useEffect(() => {
		if (!doctorId) {
			setScheduleItems([])
			return
		}

		const loadSchedule = async () => {
			setLoadingSchedule(true)
			try {
				const items = await fetchDoctorSchedule({
					bacSiId: doctorId,
				})
				setScheduleItems(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Khong the tai lich lam viec cua bac si.'))
			} finally {
				setLoadingSchedule(false)
			}
		}

		loadSchedule()
	}, [doctorId])

	const selectedSlot = useMemo(
		() => calendarSlots.find((slot) => String(slot.slot_key) === String(selectedSlotKey)),
		[calendarSlots, selectedSlotKey],
	)

	const handleConfirm = async () => {
		if (!doctorId || !ngayHen || !selectedSlot) {
			message.warning('Vui long chon du bac si, ngay hen va khung gio moi.')
			return
		}

		const payload = {
			bac_si_id: doctorId,
			ngay_hen: ngayHen,
		}

		if (selectedSlot.id) {
			payload.khung_gio_id = selectedSlot.id
		} else {
			payload.lich_lam_viec_bac_si_id = selectedSlot.lich_lam_viec_bac_si_id
			payload.gio_bat_dau = selectedSlot.gio_bat_dau
			payload.gio_ket_thuc = selectedSlot.gio_ket_thuc
		}

		onSubmit?.(payload)
	}

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Alert
				type="info"
				showIcon
				message="Ban chi duoc doi bac si trong cung chuyen khoa, va khong duoc doi dich vu/goi kham cua lich hen."
			/>

			<Card className="border-[#E2E8F0]">
				<Text strong>Bac si moi</Text>
				<Select
					className="mt-2 w-full"
					value={doctorId}
					loading={loadingDoctors}
					onChange={(value) => {
						setDoctorId(value)
						setNgayHen(null)
						setSelectedSlotKey(null)
					}}
					options={doctors.map((doctor) => ({
						value: doctor.id,
						label: doctor.ho_ten,
					}))}
				/>
			</Card>

			<CalendarPicker
				selectedDate={ngayHen}
				selectedSlotKey={selectedSlotKey}
				onDateChange={(value) => {
					setNgayHen(value)
					setSelectedSlotKey(null)
				}}
				onSlotChange={(slot) => setSelectedSlotKey(slot.slot_key)}
				onSlotsChange={setCalendarSlots}
				scheduleItems={scheduleItems}
				loading={loadingSchedule}
			/>

			<div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
				<Button onClick={onCancel} disabled={submitting}>Dong</Button>
				<Button type="primary" loading={submitting} onClick={handleConfirm}>Xac nhan doi lich</Button>
			</div>
		</Space>
	)
}
