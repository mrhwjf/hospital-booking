import { useMemo, useState } from 'react'
import { Card, DatePicker, Empty, Grid, Input, Select, Space, Table, Tag, Typography } from 'antd'
import { TABLE_STYLES } from '../../styles/const-styles'

const { useBreakpoint } = Grid
const { Text } = Typography

const statusMeta = {
	cho_thuc_hien: { label: 'Chờ thực hiện', color: 'gold' },
	da_hoan_thanh: { label: 'Đã hoàn thành', color: 'green' },
	huy: { label: 'Hủy', color: 'red' },
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

export default function ChiDinhPage({ items = [], loading = false }) {
	const screens = useBreakpoint()
	const [searchText, setSearchText] = useState('')
	const [typeFilter, setTypeFilter] = useState('all')
	const [dateFilter, setDateFilter] = useState(null)

	const formatCurrency = (value) =>
		Number(value || 0).toLocaleString('vi-VN', {
			style: 'currency',
			currency: 'VND',
			maximumFractionDigits: 0,
		})

	const getServiceType = (item) => (item.dich_vu_id ? 'dich_vu' : 'goi_kham')
	const getServiceTypeLabel = (item) => (item.dich_vu_id ? 'Dịch vụ' : 'Gói khám')
	const getName = (item) => item.dich_vu?.ten_dich_vu || item.goi_kham?.ten_goi_kham || '-'
	const getUnitPrice = (item) => Number(item.dich_vu?.gia_dich_vu || item.goi_kham?.gia_goi_kham || 0)
	const getLineTotal = (item) => getUnitPrice(item) * Number(item.so_luong || 0)

	const filteredItems = useMemo(() => {
		const normalizedSearch = searchText.trim().toLowerCase()
		const expectedDate = dateFilter?.format?.('YYYY-MM-DD')

		return items.filter((item) => {
			const name = getName(item).toLowerCase()
			const type = getServiceType(item)
			const itemDate = item.ngay_chi_dinh || ''

			const matchedSearch = !normalizedSearch || name.includes(normalizedSearch)
			const matchedType = typeFilter === 'all' || type === typeFilter
			const matchedDate = !expectedDate || itemDate === expectedDate

			return matchedSearch && matchedType && matchedDate
		})
	}, [items, searchText, typeFilter, dateFilter])

	const totalAmount = useMemo(
		() =>
			filteredItems.reduce((sum, item) => {
				const unitPrice = Number(item.dich_vu?.gia_dich_vu || item.goi_kham?.gia_goi_kham || 0)
				return sum + unitPrice * Number(item.so_luong || 0)
			}, 0),
		[filteredItems],
	)

	const columns = [
		{
			title: 'Loại dịch vụ',
			key: 'loai_dich_vu',
			render: (_, record) => (
				<Tag color={record.dich_vu_id ? 'cyan' : 'purple'}>{getServiceTypeLabel(record)}</Tag>
			),
		},
		{
			title: 'Tên chỉ định',
			key: 'loai',
			render: (_, record) => getName(record),
		},
		{
			title: 'Ngày chỉ định',
			key: 'ngay_chi_dinh',
			render: (_, record) => formatDate(record.ngay_chi_dinh),
		},
		{
			title: 'Trạng thái',
			key: 'trang_thai',
			render: (_, record) => {
				const status = statusMeta[record.trang_thai]
				return <Tag color={status?.color || 'default'}>{status?.label || record.trang_thai}</Tag>
			},
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghi_chu',
			key: 'ghi_chu',
			render: (value) => value || '-',
		},
		{
			title: 'Số lượng',
			dataIndex: 'so_luong',
			key: 'so_luong',
		},
		{
			title: 'Giá',
			key: 'gia',
			align: 'right',
			render: (_, record) => formatCurrency(getUnitPrice(record)),
		},
		{
			title: 'Thành tiền',
			key: 'thanh_tien',
			align: 'right',
			render: (_, record) => formatCurrency(getLineTotal(record)),
		},
	]

	if (!loading && items.length === 0) {
		return <Empty description="Phiếu khám chưa có chỉ định." />
	}

	const searchAndFilterBar = (
		<div className="grid gap-3 md:grid-cols-3">
			<Input
				value={searchText}
				onChange={(event) => setSearchText(event.target.value)}
				placeholder="Tìm theo tên dịch vụ/gói khám"
			/>
			<Select
				value={typeFilter}
				onChange={setTypeFilter}
				options={[
					{ value: 'all', label: 'Tất cả loại dịch vụ' },
					{ value: 'dich_vu', label: 'Dịch vụ' },
					{ value: 'goi_kham', label: 'Gói khám' },
				]}
			/>
			<DatePicker
				value={dateFilter}
				onChange={setDateFilter}
				allowClear
				className="w-full"
				placeholder="Lọc theo ngày chỉ định"
			/>
		</div>
	)

	if (screens.md) {
		return (
			<Space direction="vertical" size={12} className="w-full">
				{searchAndFilterBar}
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
					summary={() => (
						<Table.Summary>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={8}>
									<div className="my-1 border-t-2 border-dashed border-[#94A3B8]" />
								</Table.Summary.Cell>
							</Table.Summary.Row>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={7} align="right">
									<Text strong className="text-base">Tổng tiền</Text>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align="right">
									<Text strong className="text-base text-red-600!">{formatCurrency(totalAmount)}</Text>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={2} colSpan={3} />
							</Table.Summary.Row>
						</Table.Summary>
					)}
				/>
			</Space>
		)
	}

	return (
		<Space direction="vertical" size={10} className="w-full">
			{searchAndFilterBar}
			{filteredItems.map((item) => {
				const status = statusMeta[item.trang_thai]
				return (
					<Card key={item.id} className="border-[#E2E8F0]">
						<Space direction="vertical" size={6} className="w-full">
							<Tag color={item.dich_vu_id ? 'cyan' : 'purple'}>{getServiceTypeLabel(item)}</Tag>
							<Text strong>{getName(item)}</Text>
							<Text type="secondary">Ngày chỉ định: {formatDate(item.ngay_chi_dinh)}</Text>
							<Tag color={status?.color || 'default'}>{status?.label || item.trang_thai}</Tag>
							<Text>{item.ghi_chu || 'Không có ghi chú.'}</Text>
							<Text type="secondary">Số lượng: {item.so_luong || 0}</Text>
							<Text type="secondary">Giá: {formatCurrency(getUnitPrice(item))}</Text>
							<Text strong>Thành tiền: {formatCurrency(getLineTotal(item))}</Text>
						</Space>
					</Card>
				)
			})}
			<Card className="border-[#E2E8F0]">
				<Space direction="vertical" size={8} className="w-full">
					<div className="border-t-2 border-dashed border-[#94A3B8]" />
					<div className="flex justify-end gap-4">
						<Text strong className="text-base">Tổng tiền</Text>
						<Text strong className="text-base text-red-600!">{formatCurrency(totalAmount)}</Text>
					</div>
				</Space>
			</Card>
		</Space>
	)
}
