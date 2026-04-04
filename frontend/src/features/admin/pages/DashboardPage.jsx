import { useEffect, useState } from 'react'
import {
	Alert,
	Card,
	Col,
	Divider,
	message,
	Progress,
	Row,
	Segmented,
	Spin,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
} from 'antd'
import {
	TeamOutlined,
	UserOutlined,
	UserSwitchOutlined,
	DollarCircleOutlined,
	CalendarOutlined,
	RiseOutlined,
} from '@ant-design/icons'
import { layDashboardAdmin } from '../../../api/reportApi'

const { Title, Text } = Typography

const palette = {
	primary: '#0F766E',
	secondary: '#2563EB',
	accent: '#06B6D4',
	success: '#16A34A',
	warning: '#F59E0B',
	danger: '#DC2626',
	bg: '#F8FAFC',
	surface: '#FFFFFF',
	border: '#E2E8F0',
	text: '#0F172A',
	muted: '#64748B',
}

const moneyFormat = (value) =>
	new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value)

const numberFormat = (value) => new Intl.NumberFormat('vi-VN').format(value)

export default function DashboardPage() {
	const [period, setPeriod] = useState('thang')
	const [loading, setLoading] = useState(false)
	const [dashboardData, setDashboardData] = useState(null)

	useEffect(() => {
		const fetchDashboard = async () => {
			setLoading(true)
			try {
				const response = await layDashboardAdmin()
				setDashboardData(response?.data ?? null)
			} catch {
				message.error('Không thể tải dữ liệu dashboard quản trị.')
			} finally {
				setLoading(false)
			}
		}

		fetchDashboard()
	}, [])

	const adminKpi = dashboardData?.adminKpi ?? {
		tongTaiKhoan: 0,
		benhNhan: 0,
		bacSi: 0,
		nhanVien: 0,
		tangTruongTaiKhoan: 0,
	}

	const nhanSuTongQuan = dashboardData?.nhanSuTongQuan ?? {
		tongBacSi: 0,
		tongNhanVien: 0,
		tongBacSiHoatDong: 0,
		tongNhanVienHoatDong: 0,
		tyLeBacSiHoatDong: 0,
		tyLeNhanVienHoatDong: 0,
	}

	const nhanSuTheoKhoa = dashboardData?.nhanSuTheoKhoa ?? []
	const doanhThuTheoChuyenKhoa = dashboardData?.doanhThuTheoChuyenKhoa ?? []
	const lichHenTheoThoiGian = dashboardData?.lichHenTheoThoiGian ?? {}
	// const taiBacSi = dashboardData?.taiBacSi ?? []

	const lichHenData = lichHenTheoThoiGian[period]
	const tongNhanSu = nhanSuTongQuan.tongBacSi + nhanSuTongQuan.tongNhanVien
	const doanhThuTong = doanhThuTheoChuyenKhoa.reduce((sum, item) => sum + item.doanhThu, 0)
	const doanhThuMax = Math.max(...doanhThuTheoChuyenKhoa.map((item) => item.doanhThu), 1)

	const nhanSuColumns = [
		{
			title: 'Chuyên khoa',
			dataIndex: 'tenKhoa',
			key: 'tenKhoa',
			render: (value) => <Text strong>{value}</Text>,
		},
		{
			title: 'Bác sĩ',
			dataIndex: 'bacSi',
			key: 'bacSi',
			align: 'right',
			render: (value) => <Tag color="cyan">{value}</Tag>,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanVien',
			key: 'nhanVien',
			align: 'right',
			render: (value) => <Tag color="blue">{value}</Tag>,
		},
		{
			title: 'Tổng',
			key: 'tong',
			align: 'right',
			render: (_, record) => <Text strong>{record.bacSi + record.nhanVien}</Text>,
		},
	]

	// const taiBacSiColumns = [
	// 	{
	// 		title: 'Bác sĩ',
	// 		dataIndex: 'tenBacSi',
	// 		key: 'tenBacSi',
	// 		render: (value, record) => (
	// 			<Space orientation="vertical" size={0}>
	// 				<Text strong>{value}</Text>
	// 				<Text type="secondary">{record.chuyenKhoa}</Text>
	// 			</Space>
	// 		),
	// 	},
	// 	{
	// 		title: 'Đã đặt',
	// 		dataIndex: 'lichDaDat',
	// 		key: 'lichDaDat',
	// 		align: 'right',
	// 	},
	// 	{
	// 		title: 'Hoàn tất',
	// 		dataIndex: 'lichHoanTat',
	// 		key: 'lichHoanTat',
	// 		align: 'right',
	// 	},
	// 	{
	// 		title: 'Hủy',
	// 		dataIndex: 'lichHuy',
	// 		key: 'lichHuy',
	// 		align: 'right',
	// 		render: (value) => <Text style={{ color: palette.danger }}>{value}</Text>,
	// 	},
	// 	{
	// 		title: 'Tỷ lệ hoàn thành',
	// 		dataIndex: 'tyLeHoanThanh',
	// 		key: 'tyLeHoanThanh',
	// 		width: 220,
	// 		render: (value) => <Progress percent={Number(value.toFixed(1))} strokeColor={palette.success} size="small" />,
	// 	},
	// ]

	return (
		<div
			className="p-3 md:p-6"
			style={{
				background: `linear-gradient(180deg, #E6F4F1 0%, ${palette.bg} 22%, ${palette.bg} 100%)`,
				minHeight: '100vh',
				color: palette.text,
				fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
			}}
		>
			<Card
				bordered={false}
				style={{
					borderRadius: 16,
					marginBottom: 20,
					background: 'linear-gradient(120deg, #0F766E 0%, #2563EB 100%)',
					color: '#fff',
					overflow: 'hidden',
				}}
			>
				<Row align="middle" justify="space-between" gutter={[16, 16]}>
					<Col>
						<Space orientation="vertical" size={2}>
							<Title level={3} style={{ color: '#fff', margin: 0 }}>
								Dashboard Quản trị hệ thống
							</Title>
							<Text style={{ color: 'rgba(255,255,255,0.9)' }}>
								Toàn cảnh tài khoản, nhân sự, doanh thu và lịch hẹn bác sĩ.
							</Text>
							{dashboardData?.moc_phan_tich ? (
								<Text style={{ color: 'rgba(255,255,255,0.85)' }}>Mốc phân tích: {dashboardData.moc_phan_tich}</Text>
							) : null}
						</Space>
					</Col>
					<Col>
						<Tag color="gold" style={{ borderRadius: 999, paddingInline: 12, fontWeight: 600 }}>
							+{adminKpi.tangTruongTaiKhoan}% tài khoản trong 30 ngày gần nhất
						</Tag>
					</Col>
				</Row>
			</Card>

			{loading ? (
				<Card style={{ borderRadius: 12, borderColor: palette.border, marginBottom: 16 }}>
					<Spin />
				</Card>
			) : null}

			{!loading && !dashboardData ? (
				<Alert
					showIcon
					type="warning"
					title="Chưa có dữ liệu dashboard"
					description="Hệ thống chưa trả về dữ liệu báo cáo. Vui lòng kiểm tra backend và dữ liệu seed."
					style={{ marginBottom: 16 }}
				/>
			) : null}

			{/* <Row gutter={[16, 16]}>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderColor: palette.border, borderRadius: 12 }}>
						<Statistic title="Tổng tài khoản" value={adminKpi.tongTaiKhoan} formatter={(v) => numberFormat(v)} prefix={<TeamOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderColor: palette.border, borderRadius: 12 }}>
						<Statistic title="Bệnh nhân" value={adminKpi.benhNhan} formatter={(v) => numberFormat(v)} prefix={<UserOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderColor: palette.border, borderRadius: 12 }}>
						<Statistic title="Bác sĩ" value={adminKpi.bacSi} formatter={(v) => numberFormat(v)} prefix={<UserSwitchOutlined />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderColor: palette.border, borderRadius: 12 }}>
						<Statistic title="Nhân viên" value={adminKpi.nhanVien} formatter={(v) => numberFormat(v)} prefix={<TeamOutlined />} />
					</Card>
				</Col>
			</Row> */}

			<Row gutter={[16, 16]} style={{ marginTop: 4 }}>
				<Col xs={24} xl={10}>
					<Card
						title="Tổng quan nhân sự"
						style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}
						extra={<Tag color="geekblue">{tongNhanSu} nhân sự</Tag>}
					>
						<Space orientation="vertical" size={12} style={{ width: '100%' }}>
							<div>
								<Text strong>Tỷ lệ bác sĩ đang hoạt động</Text>
								<Progress
									percent={Number(nhanSuTongQuan.tyLeBacSiHoatDong || 0)}
									strokeColor={palette.secondary}
									trailColor="#DBEAFE"
									format={(value) => `${value}% hoạt động`}
								/>
							</div>
							<div>
								<Text strong>Tỷ lệ nhân viên đang hoạt động</Text>
								<Progress
									percent={Number(nhanSuTongQuan.tyLeNhanVienHoatDong || 0)}
									strokeColor={palette.primary}
									trailColor="#CCFBF1"
									format={(value) => `${value}% hoạt động`}
								/>
							</div>
							<Divider style={{ margin: '8px 0' }} />
							<Space size={18} wrap>
								<Statistic title="Tổng bác sĩ" value={nhanSuTongQuan.tongBacSi} formatter={(v) => numberFormat(v)} />
								<Statistic title="Tổng nhân viên" value={nhanSuTongQuan.tongNhanVien} formatter={(v) => numberFormat(v)} />
							</Space>
						</Space>
					</Card>
				</Col>
				<Col xs={24} xl={14}>
					<Card title="Phân bố nhân sự theo khoa" style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}>
						<Table
							rowKey="key"
							size="small"
							dataSource={nhanSuTheoKhoa}
							columns={nhanSuColumns}
							pagination
							scroll={{ x: 560 }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 4 }}>
				<Col xs={24} xl={12}>
					<Card
						title="Doanh thu theo chuyên khoa"
						style={{ borderRadius: 12, borderColor: palette.border }}
						extra={<Text strong style={{ color: palette.primary }}>{moneyFormat(doanhThuTong)}</Text>}
					>
						<Space orientation="vertical" size={14} style={{ width: '100%', overflowY: 'auto', maxHeight: 450 }}>
							{doanhThuTheoChuyenKhoa.map((item) => {
								const width = (item.doanhThu / doanhThuMax) * 100
								return (
									<div key={item.key}>
										<Row justify="space-between">
											<Col>
												<Text strong>{item.tenChuyenKhoa}</Text>
											</Col>
											<Col>
												<Space size={6}>
													<Text>{moneyFormat(item.doanhThu)}</Text>
													<Tag color={item.tangTruong >= 0 ? 'success' : 'error'}>
														<RiseOutlined /> {item.tangTruong}%
													</Tag>
												</Space>
											</Col>
										</Row>
										<div
											style={{
												width: '100%',
												height: 10,
												background: '#E2E8F0',
												borderRadius: 999,
												marginTop: 6,
												overflow: 'hidden',
											}}
										>
											<div
												style={{
													width: `${width}%`,
													height: '100%',
													background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
												}}
											/>
										</div>
									</div>
								)
							})}
						</Space>
					</Card>
				</Col>
				<Col xs={24} xl={12}>
					<Card
						title="Lịch làm việc & lịch hẹn bác sĩ"
						style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}
						extra={
							<Segmented
								options={[
									{ label: 'Ngày', value: 'ngay' },
									{ label: 'Tuần', value: 'tuan' },
									{ label: 'Tháng', value: 'thang' },
								]}
								value={period}
								onChange={setPeriod}
							/>
						}
					>
						<Row gutter={[12, 12]}>
							<Col span={12}>
								<Card size="small" bordered={false} style={{ background: '#ECFDF5' }}>
									<Statistic title="Lịch đã đặt" value={lichHenData?.daDat || 0} prefix={<CalendarOutlined />} />
								</Card>
							</Col>
							<Col span={12}>
								<Card size="small" bordered={false} style={{ background: '#EFF6FF' }}>
									<Statistic title="Lịch hoàn tất" value={lichHenData?.daHoanTat || 0} />
								</Card>
							</Col>
							<Col span={12}>
								<Card size="small" bordered={false} style={{ background: '#FEF2F2' }}>
									<Statistic title="Lịch hủy" value={lichHenData?.daHuy || 0} valueStyle={{ color: palette.danger }} />
								</Card>
							</Col>
							<Col span={12}>
								<Card size="small" bordered={false} style={{ background: '#FFFBEB' }}>
									<Statistic title="Không đến" value={lichHenData?.khongDen || 0} valueStyle={{ color: palette.warning }} />
								</Card>
							</Col>
						</Row>
						<Divider />
						<Row gutter={16}>
							<Col xs={24} md={8}>
								<Progress
									type="circle"
									percent={Number((((lichHenData?.daDat || 0) / Math.max(lichHenData?.tongLich || 0, 1)) * 100).toFixed(1))}
									strokeColor={palette.secondary}
									size={88}
								/>
								<div>
									<Text type="secondary">Tỷ lệ đã đặt</Text>
								</div>
							</Col>
							<Col xs={24} md={8}>
								<Progress
									type="circle"
									percent={Number((((lichHenData?.daHoanTat || 0) / Math.max(lichHenData?.tongLich || 0, 1)) * 100).toFixed(1))}
									strokeColor={palette.success}
									size={88}
								/>
								<div>
									<Text type="secondary">Tỷ lệ hoàn tất</Text>
								</div>
							</Col>
							<Col xs={24} md={8}>
								<Progress
									type="circle"
									percent={Number((((lichHenData?.daHuy || 0) / Math.max(lichHenData?.tongLich || 0, 1)) * 100).toFixed(1))}
									strokeColor={palette.danger}
									size={88}
								/>
								<div>
									<Text type="secondary">Tỷ lệ hủy</Text>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			{/* <Card
				title="Tải công việc bác sĩ"
				style={{ borderRadius: 12, borderColor: palette.border, marginTop: 16 }}
				extra={<Text type="secondary">Mốc phân tích: 7 ngày gần nhất</Text>}
			>
				<Table rowKey="key" dataSource={taiBacSi} columns={taiBacSiColumns} pagination={false} scroll={{ x: 720 }} />
			</Card> */}
		</div>
	)
}
