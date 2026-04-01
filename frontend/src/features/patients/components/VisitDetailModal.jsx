import { Empty, Grid, Modal, Segmented, Skeleton, Space } from 'antd'
import ChiDinhPage from '../pages/lich-su-kham/ChiDinhPage'
import DonThuocPage from '../pages/lich-su-kham/DonThuocPage'
import PhieuKhamDetail from '../pages/lich-su-kham/PhieuKhamDetail'
import TaiLieuHoSoPage from '../pages/lich-su-kham/TaiLieuHoSoPage'
import { MODAL_STYLES, SEGMENTED_STYLES } from '../styles/const-styles'

const { useBreakpoint } = Grid

const detailTabOptions = [
	{ label: 'Phiếu khám', value: 'phieu-kham' },
	{ label: 'Chỉ định', value: 'chi-dinh' },
	{ label: 'Đơn thuốc', value: 'don-thuoc' },
	{ label: 'Tài liệu', value: 'tai-lieu' },
]

export default function VisitDetailModal({
	open,
	onClose,
	selectedVisit,
	loading,
	activeTab,
	onChangeTab,
	visitDetail,
	visitChiDinhs,
	visitDonThuoc,
	visitTaiLieus,
	onViewDocument,
	loadingDocumentId,
}) {
	const screens = useBreakpoint()
	const isMobile = !screens.md

	return (
		<Modal
			title={selectedVisit ? `Chi tiết phiếu khám ${selectedVisit.ma_phieu_kham || ''}` : 'Chi tiết phiếu khám'}
			open={open}
			onCancel={onClose}
			footer={null}
			width={isMobile ? 'calc(100vw - 12px)' : 900}
			style={isMobile ? { top: 8, paddingBottom: 8 } : MODAL_STYLES.verticalStatic}
			styles={{
				body: {
					maxHeight: isMobile ? 'calc(100vh - 132px)' : MODAL_STYLES.bodyScrollable.maxHeight,
					overflowY: 'auto',
					paddingRight: isMobile ? 0 : 8,
					paddingLeft: isMobile ? 0 : undefined,
				},
			}}
			destroyOnHidden
		>
			{loading ? (
				<Skeleton active paragraph={{ rows: 10 }} />
			) : !selectedVisit ? (
				<Empty description="Không có dữ liệu phiếu khám." />
			) : (
				<Space direction="vertical" size={12} className="w-full">
					<Segmented
						className={SEGMENTED_STYLES}
						block
						value={activeTab}
						onChange={onChangeTab}
						options={detailTabOptions}
					/>

					{activeTab === 'phieu-kham' && (
						<PhieuKhamDetail detail={visitDetail} loading={loading} />
					)}

					{activeTab === 'chi-dinh' && (
						<ChiDinhPage items={visitChiDinhs} loading={loading} />
					)}

					{activeTab === 'don-thuoc' && (
						<DonThuocPage data={visitDonThuoc} loading={loading} />
					)}

					{activeTab === 'tai-lieu' && (
						<TaiLieuHoSoPage
							items={visitTaiLieus}
							loading={loading}
							onViewDocument={onViewDocument}
							loadingDocumentId={loadingDocumentId}
						/>
					)}
				</Space>
			)}
		</Modal>
	)
}