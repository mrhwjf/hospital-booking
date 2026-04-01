import { useMemo, useState } from 'react'
import { Card, Descriptions, Empty, Input, Select, Space, Table, Tag, Typography } from 'antd'
import { TABLE_STYLES } from '../../styles/const-styles'

const { Text } = Typography

const prescriptionStatusMeta = {
	moi_tao: { label: 'Mới tạo', color: 'gold' },
	da_cap: { label: 'Đã cấp', color: 'green' },
	huy: { label: 'Hủy', color: 'red' },
}

const mealTimeMeta = {
	truoc_an: 'Trước ăn',
	sau_an: 'Sau ăn',
	trong_an: 'Trong ăn',
	khong_lien_quan: 'Không liên quan bữa ăn',
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

export default function DonThuocPage({ data, loading = false }) {
	const [searchText, setSearchText] = useState('')
	const [typeFilter, setTypeFilter] = useState('all')

	const status = prescriptionStatusMeta[data?.trang_thai]
	const details = useMemo(() => data?.chi_tiet || [], [data])

	const typeOptions = useMemo(() => {
		const uniqueValues = Array.from(
			new Set(details.map((item) => item.thuoc?.duong_dung).filter(Boolean)),
		)

		return [
			{ value: 'all', label: 'Tất cả loại thuốc' },
			...uniqueValues.map((value) => ({ value, label: value })),
		]
	}, [details])

	const filteredItems = useMemo(() => {
		const normalizedSearch = searchText.trim().toLowerCase()

		return details.filter((item) => {
			const medName = item.thuoc?.ten_thuoc?.toLowerCase() || ''
			const concentration = item.thuoc?.ham_luong?.toLowerCase() || ''
			const dosage = item.lieu_dung?.toLowerCase() || ''
			const medicationType = item.thuoc?.duong_dung || ''

			const matchedSearch =
				!normalizedSearch ||
				medName.includes(normalizedSearch) ||
				concentration.includes(normalizedSearch) ||
				dosage.includes(normalizedSearch)

			const matchedType = typeFilter === 'all' || medicationType === typeFilter

			return matchedSearch && matchedType
		})
	}, [details, searchText, typeFilter])

	if (!loading && !data) {
		return <Empty description="Phiếu khám chưa có đơn thuốc." />
	}

	const columns = [
		{
			title: 'Thuốc',
			key: 'thuoc',
			render: (_, item) => (
				<Space direction="vertical" size={2}>
					<Text strong>{item.thuoc?.ten_thuoc || '-'}</Text>
					<Text type="secondary">{item.thuoc?.ham_luong || '-'}</Text>
					<Text type="secondary">{item.thuoc?.duong_dung || 'Không rõ loại thuốc'}</Text>
				</Space>
			),
		},
		{
			title: 'SL',
			dataIndex: 'so_luong',
			key: 'so_luong',
		},
		{
			title: 'Liều dùng',
			dataIndex: 'lieu_dung',
			key: 'lieu_dung',
		},
		{
			title: 'Thời điểm',
			key: 'thoi_diem',
			render: (_, item) => mealTimeMeta[item.thoi_diem] || item.thoi_diem,
		},
		{
			title: 'Số ngày',
			dataIndex: 'so_ngay',
			key: 'so_ngay',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghi_chu',
			key: 'ghi_chu',
			render: (value) => value || '-',
		},
	]

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Card className="border-[#E2E8F0]" loading={loading}>
				<Descriptions size="small" column={2} bordered>
					<Descriptions.Item label="Mã đơn thuốc">{data?.ma_don_thuoc || '-'}</Descriptions.Item>
					<Descriptions.Item label="Ngày kê">{formatDate(data?.ngay_ke)}</Descriptions.Item>
					<Descriptions.Item label="Trạng thái" span={2}>
						<Tag color={status?.color || 'default'}>{status?.label || data?.trang_thai || '-'}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="Ghi chú" span={2}>
						{data?.ghi_chu || '-'}
					</Descriptions.Item>
				</Descriptions>
			</Card>

			<div className="grid gap-3 md:grid-cols-2">
				<Input
					value={searchText}
					onChange={(event) => setSearchText(event.target.value)}
					placeholder="Tìm theo tên thuốc, hàm lượng, liều dùng"
				/>
				<Select
					value={typeFilter}
					onChange={setTypeFilter}
					options={typeOptions}
				/>
			</div>

			<Table
				className={TABLE_STYLES.header}
				rowKey="id"
				loading={loading}
				columns={columns}
				dataSource={filteredItems}
				pagination={
					filteredItems.length > 10
						? {
							defaultPageSize: 10,
							showSizeChanger: true,
						}
						: false
				}
				scroll={{ x: 'max-content' }}
			/>
		</Space>
	)
}
