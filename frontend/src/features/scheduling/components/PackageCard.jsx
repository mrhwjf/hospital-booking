import { useState } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Card, List, Modal, Tag, Typography } from 'antd'
import { formatCurrency, getPackageServiceNames, packages } from '../mockData'

const { Paragraph, Text, Title } = Typography

export default function PackageCard({ pkg = packages[0], quantity = 0, onIncrease, onDecrease }) {
	const [openDetail, setOpenDetail] = useState(false)

	if (!pkg) {
		return null
	}

	const includedServices = getPackageServiceNames(pkg.id)

	return (
		<>
			<Card className={quantity > 0 ? 'border-[#0F766E] bg-teal-50/40' : 'border-slate-500'}>
				<div className="flex flex-col gap-3">
					<div className="flex items-start justify-between gap-3">
						<div>
							<Title level={5} className="mb-1">{pkg.ten_goi_kham}</Title>
							<Paragraph className="mb-0 text-slate-500">{pkg.mo_ta}</Paragraph>
						</div>
						<div className="flex items-center gap-2">
							<Tag color="blue">{formatCurrency(pkg.gia_goi_kham)}</Tag>
							<Button
								type="text"
								icon={<EyeOutlined />}
								onClick={() => setOpenDetail(true)}
								title="Xem chi tiết dịch vụ trong gói"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<Text className="text-slate-500">Số lượng đã chọn: <Text strong>{quantity}</Text></Text>
						<div className="flex items-center gap-2">
							<Button disabled={quantity === 0} onClick={() => onDecrease?.(pkg)}>-</Button>
							<Button type="primary" onClick={() => onIncrease?.(pkg)}>+</Button>
						</div>
					</div>
				</div>
			</Card>

			<Modal
				title={`Chi tiết gói: ${pkg.ten_goi_kham}`}
				open={openDetail}
				onCancel={() => setOpenDetail(false)}
				footer={null}
				centered
				width={680}
			>
				<List
					size="small"
					dataSource={includedServices}
					renderItem={(item, index) => <List.Item>{index + 1}. {item}</List.Item>}
					locale={{ emptyText: 'Chưa cấu hình dịch vụ trong gói' }}
				/>
			</Modal>
		</>
	)
}
