import { useMemo, useState, useCallback } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import {
	Alert,
	Button,
	Card,
	ConfigProvider,
	Divider,
	Input,
	Layout,
	List,
	Modal,
	Pagination,
	Select,
	Segmented,
	Space,
	Steps,
	Table,
	Typography,
	message,
} from 'antd'
import DoctorCard from '../../components/DoctorCard'
import CalendarPicker from '../../components/CalendarPicker'
import {
	doctorSpecialties,
	doctors,
	formatCurrency,
	getPackageServiceNames,
	packages,
	services,
	specialties,
} from '../../mockData'
import "../../styles/scheduling-domain-styles.css"
const { Content } = Layout
const { Paragraph, Text, Title } = Typography

const stepItems = [
	{ title: 'Bác sĩ', description: 'Chọn chuyên khoa và bác sĩ' },
	{ title: 'Ngày giờ', description: 'Chọn lịch làm việc và khung giờ' },
	{ title: 'Dịch vụ', description: 'Chọn dịch vụ hoặc gói khám' },
	{ title: 'Xác nhận', description: 'Kiểm tra và xác nhận lịch hẹn' },
]

export default function DatLichPage() {
	const [step, setStep] = useState(0)
	const [keyword, setKeyword] = useState('')
	const [itemMode, setItemMode] = useState('dich_vu')
	const [itemKeyword, setItemKeyword] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [activePackageDetail, setActivePackageDetail] = useState(null)
	const [showReasonError, setShowReasonError] = useState(false)
	const [booking, setBooking] = useState({
		chuyen_khoa_id: specialties[0]?.id || null,
		bac_si_id: null,
		ngay_hen: null,
		khung_gio_id: null,
		ly_do_kham: '',
		ghi_chu: '',
		items: { dich_vu: {}, goi_kham: {} },
	})

	const doctorIdsInSpecialty = useMemo(
		() =>
			doctorSpecialties
				.filter((item) => item.chuyen_khoa_id === booking.chuyen_khoa_id)
				.map((item) => item.bac_si_id),
		[booking.chuyen_khoa_id],
	)

	const filteredDoctors = useMemo(() => {
		const normalized = keyword.trim().toLowerCase()
		return doctors.filter((doctor) => {
			if (!doctorIdsInSpecialty.includes(doctor.id)) {
				return false
			}
			if (!normalized) {
				return true
			}
			return (
				doctor.ho_ten.toLowerCase().includes(normalized) ||
				doctor.gioi_thieu.toLowerCase().includes(normalized)
			)
		})
	}, [doctorIdsInSpecialty, keyword])

	const selectedDoctor = doctors.find((doctor) => doctor.id === booking.bac_si_id)
	const selectedSpecialty = specialties.find((specialty) => specialty.id === booking.chuyen_khoa_id)

	const [calendarSlots, setCalendarSlots] = useState([])
	const selectedSlots = calendarSlots
	const selectedSlot = selectedSlots.find((slot) => slot.slot_key === booking.khung_gio_id)

	const selectedServiceRows = Object.entries(booking.items.dich_vu || {}).map(([id, qty]) => {
		const item = services.find((service) => service.id === Number(id))
		return { type: 'Dịch vụ', name: item?.ten_dich_vu, qty, unitPrice: item?.gia_dich_vu || 0 }
	})

	const selectedPackageRows = Object.entries(booking.items.goi_kham || {}).map(([id, qty]) => {
		const item = packages.find((pkg) => pkg.id === Number(id))
		return { type: 'Gói khám', name: item?.ten_goi_kham, qty, unitPrice: item?.gia_goi_kham || 0 }
	})

	const selectedRows = [...selectedServiceRows, ...selectedPackageRows]
	const selectedTotal = selectedRows.reduce((sum, row) => sum + row.unitPrice * row.qty, 0)

	const canMoveNext = (() => {
		if (step === 0) {
			return Boolean(booking.chuyen_khoa_id && booking.bac_si_id)
		}
		if (step === 1) {
			return Boolean(booking.ngay_hen && booking.khung_gio_id)
		}
		if (step === 2) {
			return selectedRows.length > 0 && booking.ly_do_kham.trim().length > 0
		}
		return true
	})()

	const updateItem = useCallback((type, id, delta) => {
		setBooking(prev => {
			const current = prev.items[type]?.[id] ?? 0
			const next = Math.max(0, current + delta)

			const cloned = {
				dich_vu: { ...(prev.items.dich_vu || {}) },
				goi_kham: { ...(prev.items.goi_kham || {}) },
			}

			if (next === 0) delete cloned[type][id]
			else cloned[type][id] = next

			return { ...prev, items: cloned }
		})
	}, [])

	const handleNext = () => {
		if (!canMoveNext) {
			if (step === 2 && booking.ly_do_kham.trim().length === 0) {
				setShowReasonError(true)
				message.warning('Vui lòng nhập lý do khám trước khi tiếp tục.')
				return
			}

			message.warning('Vui lòng hoàn thành thông tin bắt buộc trước khi tiếp tục.')
			return
		}

		setShowReasonError(false)
		setStep((current) => Math.min(current + 1, stepItems.length - 1))
	}

	const handleBack = () => {
		setStep((current) => Math.max(current - 1, 0))
	}

	const handleConfirm = () => {
		if (!booking.khung_gio_id || selectedRows.length === 0) {
			message.error('Vui lòng chọn đủ khung giờ và dịch vụ/gói khám.')
			return
		}
		if (!booking.ly_do_kham.trim()) {
			message.error('Vui lòng nhập lý do khám.')
			return
		}

		if (selectedSlot && !selectedSlot.existsInDb) {
			const createSlotPayload = {
				lich_lam_viec_bac_si_id: selectedSlot.lich_lam_viec_bac_si_id,
				gio_bat_dau: selectedSlot.gio_bat_dau,
				gio_ket_thuc: selectedSlot.gio_ket_thuc,
				trang_thai: 'da_dat',
			}
			console.info('Mock INSERT khung_gio_kham:', createSlotPayload)
		}

		message.success(`Đặt lịch thành công. Mã lịch dự kiến: LH${Date.now()}`)
	}

	const servicesData = useMemo(() => {
		const normalized = itemKeyword.trim().toLowerCase()
		return services
			.filter((service) => service.chuyen_khoa_id === booking.chuyen_khoa_id)
			.filter((service) => service.ten_dich_vu.toLowerCase().includes(normalized))
			.map((service) => ({
				key: `dv-${service.id}`,
				id: service.id,
				name: service.ten_dich_vu,
				description: service.mo_ta,
				amount: service.gia_dich_vu,
				quantity: booking.items.dich_vu?.[service.id] ?? 0,
				type: 'dich_vu',
			}))
	}, [booking.chuyen_khoa_id, booking.items.dich_vu, itemKeyword])

	const packagesData = useMemo(() => {
		const normalized = itemKeyword.trim().toLowerCase()
		return packages
			.filter((pkg) => pkg.ten_goi_kham.toLowerCase().includes(normalized))
			.map((pkg) => ({
				key: `gk-${pkg.id}`,
				id: pkg.id,
				name: pkg.ten_goi_kham,
				description: pkg.mo_ta,
				amount: pkg.gia_goi_kham,
				quantity: booking.items.goi_kham?.[pkg.id] ?? 0,
				type: 'goi_kham',
				pkg,
			}))
	}, [booking.items.goi_kham, itemKeyword])

	const activeData = itemMode === 'dich_vu' ? servicesData : packagesData
	// const pageSize = 5
	// const pagedData = activeData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

	const columns = useMemo(() => {
		const baseColumns = [
			{
				title: itemMode === 'dich_vu' ? 'Tên dịch vụ' : 'Tên gói khám',
				dataIndex: 'name',
				key: 'name',
				render: (_, row) => (
					<div>
						<Text strong>{row.name}</Text>
						<div className="text-slate-500">{row.description}</div>
					</div>
				),
			},
			{
				title: 'Chi phí',
				dataIndex: 'amount',
				key: 'amount',
				render: (value) => (
					<Text strong className="text-[#2563EB]">
						{formatCurrency(value)}
					</Text>
				),
			},
			{
				title: 'Số lượng',
				dataIndex: 'quantity',
				key: 'quantity',
				render: (_, row) => (
					<Space>
						<Button
							disabled={row.quantity === 0}
							onClick={() => updateItem(row.type, row.id, -1)}
						>
							-
						</Button>
						<Text strong>{row.quantity}</Text>
						<Button
							type="primary"
							onClick={() => updateItem(row.type, row.id, 1)}
						>
							+
						</Button>
					</Space>
				),
			},
		]

		if (itemMode === 'goi_kham') {
			baseColumns.push({
				title: 'Chi tiết',
				key: 'detail',
				render: (_, row) => (
					<Button
						type="text"
						icon={<EyeOutlined />}
						onClick={() => setActivePackageDetail(row.pkg)}
					/>
				),
			})
		}

		return baseColumns
	}, [itemMode, updateItem, setActivePackageDetail])

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#0F766E',
					colorInfo: '#2563EB',
					colorSuccess: '#16A34A',
					colorWarning: '#F59E0B',
					colorError: '#DC2626',
					colorTextBase: '#0F172A',
					colorBorder: '#E2E8F0',
					colorBgLayout: '#F8FAFC',
				},
			}}
		>
			<Layout className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
				<Content className="mx-auto w-full max-w-6xl">
					<Card className="rounded-2xl border-[#E2E8F0]">
						<Space direction="vertical" size={16} className="w-full">
							<div>
								<Title level={3} className="mb-1">Đặt lịch khám bệnh</Title>
								<Paragraph className="mb-0 text-slate-500">
									Quy trình 4 bước: chọn bác sĩ, chọn giờ, chọn dịch vụ và xác nhận.
								</Paragraph>
							</div>

							<Steps current={step} items={stepItems} responsive />

							{step === 0 && (
								<Space direction="vertical" size={12} className="w-full">
									<div className="grid gap-3 md:grid-cols-2">
										<Select
											value={booking.chuyen_khoa_id}
											onChange={(value) =>
												setBooking((prev) => ({
													...prev,
													chuyen_khoa_id: value,
													bac_si_id: null,
													ngay_hen: null,
													khung_gio_id: null,
												}))
											}
											options={specialties.map((item) => ({
												value: item.id,
												label: item.ten_chuyen_khoa,
											}))}
										/>
										<Input
											placeholder="Tìm bác sĩ theo tên hoặc mô tả"
											value={keyword}
											onChange={(event) => setKeyword(event.target.value)}
										/>
									</div>
									<div className="grid gap-3 lg:grid-cols-2">
										{filteredDoctors.map((doctor) => (
											<DoctorCard
												key={doctor.id}
												doctor={doctor}
												selected={booking.bac_si_id === doctor.id}
												onSelect={(value) =>
													setBooking((prev) => ({
														...prev,
														bac_si_id: value.id,
														ngay_hen: null,
														khung_gio_id: null,
													}))
												}
											/>
										))}
									</div>
								</Space>
							)}

							{step === 1 && (
								<CalendarPicker
									doctorId={booking.bac_si_id}
									selectedDate={booking.ngay_hen}
									selectedSlotKey={booking.khung_gio_id}
									onDateChange={(iso) =>
										setBooking((prev) => ({ ...prev, ngay_hen: iso, khung_gio_id: null }))
									}
									onSlotChange={(value) =>
										setBooking((prev) => ({ ...prev, khung_gio_id: value.slot_key }))
									}
									onSlotsChange={setCalendarSlots}
								/>
							)}


							{step === 2 && (
								<Space direction="vertical" size={12} className="w-full">
									<Card className="border-[#E2E8F0]">
										<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
											<Segmented
												className="segmented-options"
												value={itemMode}
												onChange={(value) => {
													setItemMode(value)
													setCurrentPage(1)
												}}
												options={[
													{ label: 'Dịch vụ lẻ', value: 'dich_vu' },
													{ label: 'Gói khám', value: 'goi_kham' },
												]}
											/>
											<Input
												placeholder={
													itemMode === 'dich_vu'
														? 'Tìm dịch vụ theo tên'
														: 'Tìm gói khám theo tên'
												}
												value={itemKeyword}
												onChange={(event) => {
													setItemKeyword(event.target.value)
													setCurrentPage(1)
												}}
												className="w-72"
											/>
										</div>
										{console.log("activeData length:", activeData.length)}
										{console.log(activeData)}
										<Table
											rowKey="key"
											columns={columns}
											dataSource={activeData}
											pagination={{
												pageSize: 5,
												hideOnSinglePage: true,
												// current: currentPage,
												// onChange: setCurrentPage,
											}}
										/>
										{/* <div className="mt-3 flex justify-end">
											<Pagination
												current={currentPage}
												pageSize={pageSize}
												total={activeData.length}
												onChange={setCurrentPage}
												size="small"
											/>
										</div> */}

										<Divider className="my-3" />
										<div className="flex items-center justify-between">
											<Text strong>Tổng tạm tính đã chọn</Text>
											<Text strong type="danger" className="!text-xl">
												{formatCurrency(selectedTotal)}
											</Text>
										</div>
									</Card>

									<Card className="border-[#E2E8F0]">
										<Text strong>Lý do khám <Text type="danger">*</Text></Text>
										<Input.TextArea
											value={booking.ly_do_kham}
											onChange={(event) =>
												setBooking((prev) => ({ ...prev, ly_do_kham: event.target.value }))
											}
											rows={3}
											placeholder="Mô tả triệu chứng hoặc nhu cầu khám"
											className="mt-2"
											status={showReasonError && !booking.ly_do_kham.trim() ? 'error' : ''}
										/>
										{showReasonError && !booking.ly_do_kham.trim() && (
											<Text type="danger">Vui lòng nhập lý do khám.</Text>
										)}
									</Card>
								</Space>
							)}

							{step === 3 && (
								<Space direction="vertical" size={12} className="w-full">
									<Alert
										type="info"
										showIcon
										message="Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt lịch."
									/>

									<Card className="border-[#E2E8F0]">
										<Title level={5}>Thông tin lịch hẹn</Title>
										<div className="grid gap-2 md:grid-cols-2">
											<Text>Chuyên khoa: <Text strong>{selectedSpecialty?.ten_chuyen_khoa || '-'}</Text></Text>
											<Text>Bác sĩ: <Text strong>{selectedDoctor?.ho_ten || '-'}</Text></Text>
											<Text>Ngày khám: <Text strong>{booking.ngay_hen || 'Chưa chọn'}</Text></Text>
											<Text>
												Khung giờ: <Text strong>{selectedSlot ? `${selectedSlot.gio_bat_dau.slice(0, 5)} - ${selectedSlot.gio_ket_thuc.slice(0, 5)}` : 'Chưa chọn'}</Text>
											</Text>
										</div>
									</Card>

									<Card className="border-[#E2E8F0]">
										<Title level={5}>Dịch vụ đã chọn</Title>

										{selectedRows.length > 0 ? (
											<div className="overflow-hidden rounded-lg border border-[#E2E8F0]">
												<table className="w-full text-sm">
													<thead className="bg-slate-50">
														<tr className="text-left">
															<th className="px-3 py-2 w-12">STT</th>
															<th className="px-3 py-2">Tên dịch vụ / gói khám</th>
															<th className="px-3 py-2 w-28">Loại</th>
															<th className="px-3 py-2 w-24 text-center">Số lượng</th>
															<th className="px-3 py-2 w-32 text-right">Đơn giá</th>
														</tr>
													</thead>

													<tbody>
														{selectedRows.map((row, index) => (
															<tr
																key={`${row.type}-${row.name}`}
																className="border-t border-[#E2E8F0]"
															>
																<td className="px-3 py-2">{index + 1}</td>

																<td className="px-3 py-2 font-medium">
																	{row.name}
																</td>

																<td className="px-3 py-2">
																	{row.type}
																</td>

																<td className="px-3 py-2 text-center">
																	{row.qty}
																</td>

																<td className="px-3 py-2 text-right font-medium">
																	{formatCurrency(row.unitPrice * row.qty)}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<Text type="danger">Chưa có dịch vụ/gói khám.</Text>
										)}

										<Divider className="my-4" />

										<div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-[#E2E8F0]">
											<Text strong className="text-base">
												Tổng tạm tính
											</Text>

											<Text strong type="danger" className="!text-xl">
												{formatCurrency(selectedTotal)}
											</Text>
										</div>
									</Card>

									<Card className="border-[#E2E8F0]">
										<Text strong>Ghi chú thêm</Text>
										<Input.TextArea
											value={booking.ghi_chu}
											onChange={(event) =>
												setBooking((prev) => ({ ...prev, ghi_chu: event.target.value }))
											}
											rows={3}
											placeholder="Thông tin bổ sung cho bệnh viện"
											className="mt-2"
										/>
									</Card>
								</Space>
							)}

							<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
								<Button onClick={handleBack} disabled={step === 0}>Quay lại</Button>
								<div className="flex items-center gap-2">
									{step < stepItems.length - 1 && (
										<Button type="primary" onClick={handleNext}>Tiếp tục</Button>
									)}
									{step === stepItems.length - 1 && (
										<Button type="primary" onClick={handleConfirm}>Xác nhận đặt lịch</Button>
									)}
								</div>
							</div>
						</Space>
					</Card>
				</Content>
			</Layout>

			<Modal
				title={activePackageDetail ? `Chi tiết gói: ${activePackageDetail.ten_goi_kham}` : 'Chi tiết gói khám'}
				open={Boolean(activePackageDetail)}
				onCancel={() => setActivePackageDetail(null)}
				footer={null}
				centered
				width={680}
			>
				<List
					size="small"
					dataSource={activePackageDetail ? getPackageServiceNames(activePackageDetail.id) : []}
					renderItem={(item, index) => <List.Item>{index + 1}. {item}</List.Item>}
					locale={{ emptyText: 'Chưa cấu hình dịch vụ trong gói' }}
				/>
			</Modal>
		</ConfigProvider>
	)
}
