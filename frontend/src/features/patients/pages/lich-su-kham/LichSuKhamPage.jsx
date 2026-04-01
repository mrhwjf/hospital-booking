import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Alert,
	Badge,
	Button,
	Card,
	DatePicker,
	Empty,
	Grid,
	Input,
	Pagination,
	Select,
	Space,
	Skeleton,
	Table,
	Tag,
	Typography,
	message,
} from 'antd'
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import useDebounce from '../../../../hooks/useDebounce'
import {
	fetchCurrentPatientProfile,
	fetchVisitDetail,
	fetchVisitHistory,
	fetchVisitTaiLieuSignedUrl,
	getApiErrorMessage,
} from '../../../../services/patientVisitHistoryService'
import VisitDetailModal from '../../components/VisitDetailModal'
import DocumentPreviewModal from '../../components/DocumentPreviewModal'
import { TABLE_STYLES } from '../../styles/const-styles'

const { RangePicker } = DatePicker
const { useBreakpoint } = Grid
const { Paragraph, Text, Title } = Typography

const visitStatusMeta = {
	tiep_nhan: { label: 'Tiếp nhận', color: 'gold' },
	dang_kham: { label: 'Đang khám', color: 'blue' },
	cho_ke_don: { label: 'Chờ kê đơn', color: 'purple' },
	hoan_thanh: { label: 'Hoàn thành', color: 'green' },
}

const formatDateTime = (value) => {
	if (!value) {
		return '-'
	}

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) {
		return value
	}

	return date.toLocaleString('vi-VN')
}

const formatDate = (value) => {
	if (!value) {
		return '-'
	}

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) {
		return value
	}

	return date.toLocaleDateString('vi-VN')
}

const renderStatusTag = (status) => {
	const meta = visitStatusMeta[status]
	return <Tag color={meta?.color || 'default'}>{meta?.label || status}</Tag>
}

export default function LichSuKhamPage() {
	const screens = useBreakpoint()
	const [loading, setLoading] = useState(false)
	const [loadingDetail, setLoadingDetail] = useState(false)
	const [loadingDocumentId, setLoadingDocumentId] = useState(null)
	const [patientProfile, setPatientProfile] = useState(null)
	const [visits, setVisits] = useState([])
	const [totalItems, setTotalItems] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [keyword, setKeyword] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [dateRange, setDateRange] = useState(null)
	const [selectedVisitId, setSelectedVisitId] = useState(null)
	const [activeDetailTab, setActiveDetailTab] = useState('phieu-kham')
	const [detailOpen, setDetailOpen] = useState(false)
	const [visitDetail, setVisitDetail] = useState(null)
	const [visitChiDinhs, setVisitChiDinhs] = useState([])
	const [visitDonThuoc, setVisitDonThuoc] = useState(null)
	const [visitTaiLieus, setVisitTaiLieus] = useState([])
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewUrl, setPreviewUrl] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')

	const debouncedKeyword = useDebounce(keyword, 350)

	const loadPatientProfile = useCallback(async () => {
		try {
			const profile = await fetchCurrentPatientProfile()
			setPatientProfile(profile)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải hồ sơ bệnh nhân.'))
		}
	}, [])

	const loadVisits = useCallback(async () => {
		setLoading(true)
		try {
			const tuNgay = dateRange?.[0]?.format?.('YYYY-MM-DD')
			const denNgay = dateRange?.[1]?.format?.('YYYY-MM-DD')

			const result = await fetchVisitHistory({
				page: currentPage,
				pageSize,
				q: debouncedKeyword,
				trangThai: statusFilter,
				tuNgay,
				denNgay,
			})

			setVisits(result.items)
			setTotalItems(result.pagination?.totalItems || 0)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải lịch sử khám.'))
		} finally {
			setLoading(false)
		}
	}, [currentPage, pageSize, debouncedKeyword, statusFilter, dateRange])

	const loadVisitDetailBundle = useCallback(async (visitId) => {
		setLoadingDetail(true)
		try {
			const detailBundle = await fetchVisitDetail(visitId)

			setVisitDetail(detailBundle.visit)
			setVisitChiDinhs(detailBundle.chiDinhs)
			setVisitDonThuoc(detailBundle.donThuoc)
			setVisitTaiLieus(detailBundle.taiLieus)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải chi tiết phiếu khám.'))
		} finally {
			setLoadingDetail(false)
		}
	}, [])

	useEffect(() => {
		loadPatientProfile()
	}, [loadPatientProfile])

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedKeyword, statusFilter, dateRange])

	useEffect(() => {
		loadVisits()
	}, [loadVisits])

	const openDetail = async (visitId) => {
		setSelectedVisitId(visitId)
		setActiveDetailTab('phieu-kham')
		setDetailOpen(true)
		await loadVisitDetailBundle(visitId)
	}

	const closeDetail = () => {
		setDetailOpen(false)
		setSelectedVisitId(null)
		setVisitDetail(null)
		setVisitChiDinhs([])
		setVisitDonThuoc(null)
		setVisitTaiLieus([])
	}

	const closePreview = () => {
		setPreviewOpen(false)
		setPreviewUrl('')
		setPreviewTitle('')
	}

	const handleOpenDocument = async (document) => {
		if (!selectedVisitId || !document?.id) {
			return
		}

		setLoadingDocumentId(document.id)
		try {
			const response = await fetchVisitTaiLieuSignedUrl({
				visitId: selectedVisitId,
				taiLieuId: document.id,
			})

			if (!response?.url) {
				message.warning('Không lấy được URL tài liệu.')
				return
			}

			setPreviewTitle(document.ten_tai_lieu || document.ma_tai_lieu || 'Xem tài liệu')
			setPreviewUrl(response.url)
			setPreviewOpen(true)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể mở tài liệu hồ sơ.'))
		} finally {
			setLoadingDocumentId(null)
		}
	}

	const selectedVisit = useMemo(() => {
		if (visitDetail) {
			return visitDetail
		}

		return visits.find((item) => item.id === selectedVisitId) || null
	}, [visitDetail, visits, selectedVisitId])

	const columns = [
		{
			title: 'Mã phiếu',
			dataIndex: 'ma_phieu_kham',
			key: 'ma_phieu_kham',
		},
		{
			title: 'Bác sĩ',
			key: 'bac_si',
			render: (_, record) => record.bac_si?.ho_ten || '-',
		},
		{
			title: 'Ngày khám',
			key: 'thoi_gian_tiep_nhan',
			render: (_, record) => formatDateTime(record.thoi_gian_tiep_nhan || record.created_at),
		},
		{
			title: 'Chẩn đoán',
			dataIndex: 'chan_doan',
			key: 'chan_doan',
			render: (value) => value || 'Chưa cập nhật',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			render: renderStatusTag,
		},
		{
			title: 'Tài liệu',
			key: 'tai_lieu',
			render: (_, record) => <Badge color="#0F766E" text={`${record.so_tai_lieu || 0} tệp`} />,
		},
		{
			title: 'Hành động',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<Button icon={<EyeOutlined />} onClick={() => openDetail(record.id)}>
					Xem chi tiết
				</Button>
			),
		},
	]

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
			<div className="mx-auto w-full max-w-7xl">
				<Card className="rounded-2xl border-[#E2E8F0]">
					<Space direction="vertical" size={14} className="w-full">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<Title level={3} className="mb-1">
									Lịch sử khám
								</Title>
								<Paragraph className="mb-0 text-slate-500">
									Theo dõi toàn bộ phiếu khám và tài liệu hồ sơ bệnh án của bạn.
								</Paragraph>
							</div>
							<Button icon={<ReloadOutlined />} onClick={loadVisits}>
								Làm mới
							</Button>
						</div>

						<Alert
							type="info"
							showIcon
							message="Dữ liệu được giới hạn theo hồ sơ bệnh nhân hiện tại (benh_nhan_id mô phỏng khi chưa có đăng nhập)."
						/>

						<Card className="border-[#E2E8F0] bg-[#fafdff]">
							{patientProfile ? (
								<Space direction="vertical" size={4}>
									<Text strong>{patientProfile.ho_ten}</Text>
									<Text type="secondary">Mã bệnh nhân: {patientProfile.ma_benh_nhan}</Text>
									<Text type="secondary">
										Ngày sinh: {formatDate(patientProfile.ngay_sinh)} | SĐT: {patientProfile.so_dien_thoai || '-'}
									</Text>
								</Space>
							) : (
								<Skeleton active paragraph={{ rows: 2 }} title={false} />
							)}
						</Card>

						<div className="grid gap-3 md:grid-cols-4">
							<Input
								value={keyword}
								onChange={(event) => setKeyword(event.target.value)}
								placeholder="Tìm theo mã phiếu, chẩn đoán, bác sĩ"
							/>
							<Select
								value={statusFilter}
								onChange={setStatusFilter}
								options={[
									{ value: 'all', label: 'Mặc định: Hoàn thành' },
									...Object.entries(visitStatusMeta).map(([value, meta]) => ({
										value,
										label: meta.label,
									})),
								]}
							/>
							<RangePicker
								value={dateRange}
								onChange={(nextValue) => setDateRange(nextValue)}
								className="w-full"
								allowClear
							/>
							<Badge color="#2563EB" text={`${totalItems} phiếu khám`} />
						</div>

						{loading && !visits.length ? (
							<Skeleton active paragraph={{ rows: 8 }} />
						) : screens.md ? (
							<Table
								className={TABLE_STYLES.header}
								rowKey="id"
								columns={columns}
								dataSource={visits}
								loading={loading}
								scroll={{ x: 'max-content' }}
								locale={{ emptyText: <Empty description="Chưa có lịch sử khám phù hợp." /> }}
								pagination={{
									current: currentPage,
									pageSize,
									total: totalItems,
									showSizeChanger: true,
									onChange: (page, nextPageSize) => {
										setCurrentPage(page)
										setPageSize(nextPageSize)
									},
								}}
							/>
						) : (
							<Space direction="vertical" size={10} className="w-full">
								{visits.length === 0 && <Empty description="Chưa có lịch sử khám phù hợp." />}
								{visits.map((record) => (
									<Card key={record.id} className="border-[#E2E8F0]">
										<Space direction="vertical" size={8} className="w-full">
											<div className="flex items-center justify-between gap-2">
												<Text strong>{record.ma_phieu_kham}</Text>
												{renderStatusTag(record.trang_thai)}
											</div>
											<Text>{record.bac_si?.ho_ten || '-'}</Text>
											<Text type="secondary">{formatDateTime(record.thoi_gian_tiep_nhan || record.created_at)}</Text>
											<Text type="secondary">{record.chan_doan || 'Chưa cập nhật chẩn đoán'}</Text>
											<Badge color="#0F766E" text={`${record.so_tai_lieu || 0} tệp tài liệu`} />
											<Button icon={<EyeOutlined />} onClick={() => openDetail(record.id)}>
												Xem chi tiết
											</Button>
										</Space>
									</Card>
								))}
								<Pagination
									current={currentPage}
									pageSize={pageSize}
									total={totalItems}
									onChange={(page, nextPageSize) => {
										setCurrentPage(page)
										setPageSize(nextPageSize)
									}}
									showSizeChanger
								/>
							</Space>
						)}
					</Space>
				</Card>
			</div>

			<VisitDetailModal
				open={detailOpen}
				onClose={closeDetail}
				selectedVisit={selectedVisit}
				loading={loadingDetail}
				activeTab={activeDetailTab}
				onChangeTab={setActiveDetailTab}
				visitDetail={visitDetail}
				visitChiDinhs={visitChiDinhs}
				visitDonThuoc={visitDonThuoc}
				visitTaiLieus={visitTaiLieus}
				onViewDocument={handleOpenDocument}
				loadingDocumentId={loadingDocumentId}
			/>

			<DocumentPreviewModal
				open={previewOpen}
				onClose={closePreview}
				title={previewTitle}
				url={previewUrl}
				loading={loadingDocumentId !== null}
			/>
		</div>
	)
}
