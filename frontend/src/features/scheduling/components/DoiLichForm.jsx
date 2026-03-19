import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Input, Select, Space, Typography, message } from 'antd'
import CalendarPicker from './CalendarPicker'
import ServicePicker from './ServicePicker'
import {
	fetchDoctorSchedule,
	fetchDoctorsBySpecialty,
	fetchServicesAndPackages,
	fetchSpecialties,
	getApiErrorMessage,
} from '../../../services/schedulingService'

const { Text } = Typography

export default function DoiLichForm({ appointment, onSubmit, onCancel, submitting = false }) {
	const [loadingDoctors, setLoadingDoctors] = useState(false)
	const [loadingSchedule, setLoadingSchedule] = useState(false)
	const [loadingItems, setLoadingItems] = useState(false)
	const [loadingSpecialties, setLoadingSpecialties] = useState(false)
	const [specialties, setSpecialties] = useState([])
	const [doctors, setDoctors] = useState([])
	const [services, setServices] = useState([])
	const [packages, setPackages] = useState([])
	const [scheduleItems, setScheduleItems] = useState([])
	const [calendarSlots, setCalendarSlots] = useState([])

	const [chuyenKhoaId, setChuyenKhoaId] = useState(appointment?.chuyen_khoa_id || null)
	const [doctorId, setDoctorId] = useState(appointment?.bac_si_id || null)
	const [ngayHen, setNgayHen] = useState(appointment?.ngay_hen || null)
	const [selectedSlotKey, setSelectedSlotKey] = useState(appointment?.khung_gio_id || null)
	const [lyDoKham, setLyDoKham] = useState(appointment?.ly_do_kham || '')
	const [ghiChu, setGhiChu] = useState(appointment?.ghi_chu || '')
	const [selectedItems, setSelectedItems] = useState(() => {
		const result = { dich_vu: {}, goi_kham: {} }
		const rows = appointment?.dich_vu_lich_hens || []

		rows.forEach((row) => {
			if (row?.dich_vu_id) {
				result.dich_vu[row.dich_vu_id] = row.so_luong || 1
			}

			if (row?.goi_kham_id) {
				result.goi_kham[row.goi_kham_id] = row.so_luong || 1
			}
		})

		return result
	})

	useEffect(() => {
		const loadSpecialties = async () => {
			setLoadingSpecialties(true)
			try {
				const items = await fetchSpecialties()
				setSpecialties(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách chuyên khoa.'))
			} finally {
				setLoadingSpecialties(false)
			}
		}

		loadSpecialties()
	}, [])

	useEffect(() => {
		if (!chuyenKhoaId) {
			setDoctors([])
			return
		}

		const loadDoctors = async () => {
			setLoadingDoctors(true)
			try {
				const items = await fetchDoctorsBySpecialty({
					chuyenKhoaId,
				})
				setDoctors(items)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải danh sách bác sĩ.'))
			} finally {
				setLoadingDoctors(false)
			}
		}

		loadDoctors()
	}, [chuyenKhoaId])

	useEffect(() => {
		if (!chuyenKhoaId) {
			setServices([])
			setPackages([])
			return
		}

		const loadItems = async () => {
			setLoadingItems(true)
			try {
				const { services: nextServices, packages: nextPackages } = await fetchServicesAndPackages({
					chuyenKhoaId,
				})

				setServices(nextServices)
				setPackages(nextPackages)
			} catch (error) {
				message.error(getApiErrorMessage(error, 'Không thể tải dịch vụ/gói khám.'))
			} finally {
				setLoadingItems(false)
			}
		}

		loadItems()
	}, [chuyenKhoaId])

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
				message.error(getApiErrorMessage(error, 'Không thể tải lịch làm việc của bác sĩ.'))
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
		const items = [
			...Object.entries(selectedItems.dich_vu || {}).map(([id, so_luong]) => ({
				dich_vu_id: Number(id),
				so_luong,
			})),
			...Object.entries(selectedItems.goi_kham || {}).map(([id, so_luong]) => ({
				goi_kham_id: Number(id),
				so_luong,
			})),
		]

		if (!chuyenKhoaId || !doctorId || !ngayHen || !selectedSlot || items.length === 0) {
			message.warning('Vui lòng chọn đủ chuyên khoa, bác sĩ, ngày hẹn, khung giờ và dịch vụ/gói khám.')
			return
		}

		const payload = {
			chuyen_khoa_id: chuyenKhoaId,
			bac_si_id: doctorId,
			ngay_hen: ngayHen,
			ly_do_kham: lyDoKham,
			ghi_chu: ghiChu,
			items,
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
				message="Bạn có thể đổi chuyên khoa, bác sĩ, ngày giờ và cập nhật dịch vụ/gói khám cho lịch hẹn."
			/>

			<Card className="border-[#E2E8F0]">
				<Text strong>Chọn chuyên khoa</Text>
				<Select
					className="mt-2 w-full"
					value={chuyenKhoaId}
					loading={loadingSpecialties}
					onChange={(value) => {
						setChuyenKhoaId(value)
						setDoctorId(null)
						setNgayHen(null)
						setSelectedSlotKey(null)
						setSelectedItems({ dich_vu: {}, goi_kham: {} })
					}}
					options={specialties.map((item) => ({
						value: item.id,
						label: item.ten_chuyen_khoa,
					}))}
				/>
			</Card>

			<Card className="border-[#E2E8F0]">
				<Text strong>Chọn bác sĩ</Text>
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

			<Card className="border-[#E2E8F0]">
				<Text strong>Chọn dịch vụ/gói khám</Text>
				<div className="mt-2">
					<ServicePicker
						selectedItems={selectedItems}
						onChange={setSelectedItems}
						services={services}
						packages={packages}
					/>
					{loadingItems && <Text type="secondary">Đang tải dịch vụ/gói khám...</Text>}
				</div>
			</Card>

			<Card className="border-[#E2E8F0]">
				<Text strong>Lý do khám</Text>
				<Input.TextArea
					rows={3}
					value={lyDoKham}
					onChange={(event) => setLyDoKham(event.target.value)}
				/>

				<Text strong className="mt-3 block">Ghi chú</Text>
				<Input.TextArea
					rows={2}
					value={ghiChu}
					onChange={(event) => setGhiChu(event.target.value)}
				/>
			</Card>

			<div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
				<Button onClick={onCancel} disabled={submitting}>Đóng</Button>
				<Button type="primary" loading={submitting} onClick={handleConfirm}>Xác nhận đổi lịch</Button>
			</div>
		</Space>
	)
}
