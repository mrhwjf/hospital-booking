import { Link } from 'react-router-dom'
import { Alert, Button, Card, Space, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

const LAYOUT_LINKS = [
	{
		key: 'admin',
		title: 'Admin Layout',
		description: 'Kiểm tra sidebar, header, breadcrumb và trạng thái responsive của khu vực quản trị.',
		path: '/__preview/layouts/admin',
	},
	{
		key: 'staff',
		title: 'Staff Layout',
		description: 'Xem lại nav trái, profile dropdown và bố cục nội dung dành cho nhân viên/lễ tân.',
		path: '/__preview/layouts/staff',
	},
	{
		key: 'doctor',
		title: 'Doctor Layout',
		description: 'Đánh giá header cố định, sidebar thu gọn và khu vực nội dung dành cho bác sĩ.',
		path: '/__preview/layouts/doctor',
	},
	{
		key: 'patient',
		title: 'Patient Layout',
		description: 'Theo dõi shell phía bệnh nhân với thông tin hồ sơ và vùng nội dung chính.',
		path: '/__preview/layouts/patient',
	},
]

export default function LayoutPlaygroundPage() {
	return (
		<div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F0FDFA 0%, #EFF6FF 100%)', padding: 20 }}>
			<div style={{ maxWidth: 1080, margin: '0 auto' }}>
				<Card style={{ borderRadius: 16 }}>
					<Space direction="vertical" size={14} style={{ width: '100%' }}>
						<div>
							<Text style={{ color: '#0F766E', fontWeight: 600 }}>Visual QA</Text>
							<Title level={3} style={{ marginTop: 6, marginBottom: 6 }}>
								Layout Playground
							</Title>
							<Paragraph style={{ margin: 0 }}>
								Trang tổng hợp để kiểm tra nhanh tất cả shell layout trước khi merge hoặc chạy visual regression.
							</Paragraph>
						</div>

						<Alert
							type="info"
							showIcon
							message="Route này chỉ bật ở môi trường development."
						/>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
								gap: 12,
							}}
						>
							{LAYOUT_LINKS.map((layout) => (
								<Card key={layout.key} size="small" style={{ borderRadius: 12, borderColor: '#D1FAE5' }}>
									<Space direction="vertical" size={10} style={{ width: '100%' }}>
										<Title level={5} style={{ margin: 0 }}>
											{layout.title}
										</Title>
										<Text type="secondary">{layout.description}</Text>
										<Link to={layout.path}>
											<Button type="primary" block>
												Mở preview
											</Button>
										</Link>
									</Space>
								</Card>
							))}
						</div>
					</Space>
				</Card>
			</div>
		</div>
	)
}
