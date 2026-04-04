import { Button, Card, Empty, Space, Table, Tag, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { TABLE_STYLES } from '../../styles/const-styles'

const { Text } = Typography

const typeLabels = {
	ket_qua_xet_nghiem: 'Kết quả xét nghiệm',
	ket_qua_sieu_am: 'Kết quả siêu âm',
	ket_qua_xquang: 'Kết quả X-quang',
	ket_qua_ct_scan: 'Kết quả CT Scan',
	ket_qua_mri: 'Kết quả MRI',
	ket_qua_noi_soi: 'Kết quả nội soi',
	phieu_chi_dinh: 'Phiếu chỉ định',
	bao_cao_phau_thuat: 'Báo cáo phẫu thuật',
	giay_ra_vien: 'Giấy ra viện',
	khac: 'Khác',
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

export default function TaiLieuHoSoPage({
	items = [],
	loading = false,
	onViewDocument,
	loadingDocumentId,
}) {
	if (!loading && items.length === 0) {
		return <Empty description="Phiếu khám chưa có tài liệu hồ sơ." />
	}

	const columns = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'ma_tai_lieu',
			key: 'ma_tai_lieu',
		},
		{
			title: 'Tên tài liệu',
			dataIndex: 'ten_tai_lieu',
			key: 'ten_tai_lieu',
			render: (value) => value || '-',
		},
		{
			title: 'Loại',
			key: 'loai_tai_lieu',
			render: (_, item) => <Tag>{typeLabels[item.loai_tai_lieu] || item.loai_tai_lieu}</Tag>,
		},
		{
			title: 'Ngày tạo',
			key: 'ngay_tao',
			render: (_, item) => formatDate(item.ngay_tao),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghi_chu',
			key: 'ghi_chu',
			render: (value) => value || '-',
		},
		{
			title: 'Tác vụ',
			key: 'actions',
			render: (_, item) => (
				<Button
					icon={<DownloadOutlined />}
					onClick={() => onViewDocument?.(item)}
					loading={loadingDocumentId === item.id}
				>
					Xem/Tải
				</Button>
			),
		},
	]

	return (
		<Space orientation="vertical" size={12} className="w-full">
			<Card className="border-[#E2E8F0] bg-[#fafdff]">
				<Text type="secondary">
					Tài liệu được mở bằng URL có chữ ký thời hạn ngắn. Nếu tài liệu hết hạn, hãy nhấn lại nút Xem/Tải.
				</Text>
			</Card>

			<Table
				className={TABLE_STYLES.header}
				rowKey="id"
				loading={loading}
				columns={columns}
				dataSource={items}
				pagination={{
					hideOnSinglePage: true,
					showSizeChanger: true,
					defaultPageSize: 5,
				}}
				scroll={{ x: 'max-content' }}
			/>
		</Space>
	)
}
