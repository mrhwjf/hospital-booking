import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Col, DatePicker, Progress, Row, Segmented, Select, Space, Spin, Statistic, Table, Tag, Typography, message } from 'antd'
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, UserSwitchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { layBaoCaoLichHen } from '../../../api/reportApi'

const { Title, Text } = Typography

const palette = {
	primary: '#0F766E',
	secondary: '#2563EB',
	success: '#16A34A',
	warning: '#F59E0B',
	danger: '#DC2626',
	bg: '#F8FAFC',
	border: '#E2E8F0',
}

const numberFormat = (value) => new Intl.NumberFormat('vi-VN').format(value)

const statusText = {
	ngay: 'Theo ngày',
	tuan: 'Theo tuần',
	thang: 'Theo tháng',
}

export default function BaoCaoLichHenPage() {
	const [loading, setLoading] = useState(false)
	const [baoCaoData, setBaoCaoData] = useState(null)
	const [period, setPeriod] = useState('ngay')
	const [khoangNgay, setKhoangNgay] = useState(() => [dayjs().subtract(30, 'day'), dayjs()])
	const [khoaLoc, setKhoaLoc] = useState(undefined)

	useEffect(() => {
		const fetchBaoCao = async () => {
			setLoading(true)
			try {
				const params = {}
				if (khoangNgay?.[0] && khoangNgay?.[1]) {
					params.tu_ngay = khoangNgay[0].format('YYYY-MM-DD')
					params.den_ngay = khoangNgay[1].format('YYYY-MM-DD')
					params.moc_phan_tich = khoangNgay[1].format('YYYY-MM-DD')
				}
				if (khoaLoc) {
					params.chuyen_khoa_id = khoaLoc
				}

				const response = await layBaoCaoLichHen(params)
				setBaoCaoData(response?.data ?? null)
			} catch {
				message.error('Không thể tải báo cáo lịch hẹn.')
			} finally {
				setLoading(false)
			}
		}

		fetchBaoCao()
	}, [khoaLoc, khoangNgay])

	const lichHenTheoThoiGian = useMemo(
		() =>
			baoCaoData?.lichHenTheoThoiGian ?? {
				ngay: { daDat: 0, daHoanTat: 0, daHuy: 0, khongDen: 0, tongLich: 0 },
				tuan: { daDat: 0, daHoanTat: 0, daHuy: 0, khongDen: 0, tongLich: 0 },
				thang: { daDat: 0, daHoanTat: 0, daHuy: 0, khongDen: 0, tongLich: 0 },
			},
		[baoCaoData],
	)

	const data = useMemo(() => lichHenTheoThoiGian[period] ?? lichHenTheoThoiGian.ngay, [lichHenTheoThoiGian, period])
	const tyLeHoanTat = data.tongLich > 0 ? Number(((data.daHoanTat / data.tongLich) * 100).toFixed(1)) : 0
	const tyLeHuy = data.tongLich > 0 ? Number(((data.daHuy / data.tongLich) * 100).toFixed(1)) : 0

	const tableData = baoCaoData?.taiBacSi ?? []
	const heatmapLichHen = baoCaoData?.phanTichTheoKhungGio ?? []

	const maxDatLich = Math.max(...heatmapLichHen.map((item) => item.datLich), 1)

	const chuyenKhoaOptions = useMemo(
		() =>
			(baoCaoData?.danhMucChuyenKhoa ?? []).map((item) => ({
				label: item.ten_chuyen_khoa,
				value: item.id,
			})),
		[baoCaoData],
	)

	const columns = [
		{
			title: 'Bác sĩ',
			dataIndex: 'tenBacSi',
			key: 'tenBacSi',
			render: (value, record) => (
				<Space orientation="vertical" size={0}>
					<Text strong>{value}</Text>
					<Text type="secondary">{record.chuyenKhoa}</Text>
				</Space>
			),
		},
		{
			title: 'Lịch đã đặt',
			dataIndex: 'lichDaDat',
			key: 'lichDaDat',
			align: 'right',
			render: (value) => numberFormat(value),
		},
		{
			title: 'Lịch hoàn tất',
			dataIndex: 'lichHoanTat',
			key: 'lichHoanTat',
			align: 'right',
			render: (value) => <Text style={{ color: palette.success }}>{numberFormat(value)}</Text>,
		},
		{
			title: 'Lịch hủy',
			dataIndex: 'lichHuy',
			key: 'lichHuy',
			align: 'right',
			render: (value) => <Text style={{ color: palette.danger }}>{numberFormat(value)}</Text>,
		},
		{
			title: 'Tỷ lệ hoàn thành',
			dataIndex: 'tyLeHoanThanh',
			key: 'tyLeHoanThanh',
			width: 220,
			render: (value) => <Progress percent={value} size="small" strokeColor={palette.primary} />,
		},
	]

	return (
		<div
			style={{
				minHeight: '100vh',
				padding: 24,
				background: `linear-gradient(160deg, #E0F2FE 0%, ${palette.bg} 25%, ${palette.bg} 100%)`,
				fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
			}}
		>
			<Card
				bordered={false}
				style={{
					borderRadius: 16,
					marginBottom: 16,
					background: 'linear-gradient(120deg, #2563EB 0%, #0F766E 100%)',
				}}
			>
				<Title level={3} style={{ marginBottom: 4, color: '#fff' }}>
					Báo cáo lịch hẹn & lịch làm việc bác sĩ
				</Title>
				<Text style={{ color: 'rgba(255,255,255,0.9)' }}>
					Theo dõi tình trạng lịch hẹn đã đặt, hoàn tất, hủy và phân tích theo mốc thời gian.
				</Text>
			</Card>

			<Card style={{ borderRadius: 12, borderColor: palette.border, marginBottom: 16 }}>
				<Row gutter={[12, 12]} align="middle">
					<Col xs={24} md={8}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Kỳ phân tích</Text>
							<Segmented
								value={period}
								onChange={setPeriod}
								options={[
									{ label: 'Ngày', value: 'ngay' },
									{ label: 'Tuần', value: 'tuan' },
									{ label: 'Tháng', value: 'thang' },
								]}
								block
							/>
						</Space>
					</Col>
					<Col xs={24} md={8}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Khoảng ngày</Text>
							<DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} value={khoangNgay} onChange={setKhoangNgay} />
						</Space>
					</Col>
					<Col xs={24} md={8}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Lọc theo khoa</Text>
							<Select
								allowClear
								value={khoaLoc}
								onChange={setKhoaLoc}
								placeholder="Tất cả chuyên khoa"
								options={chuyenKhoaOptions}
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			{loading ? (
				<Card style={{ borderRadius: 12, borderColor: palette.border, marginBottom: 16 }}>
					<Spin />
				</Card>
			) : null}

			{!loading && !baoCaoData ? (
				<Alert
					showIcon
					type="warning"
					message="Chưa có dữ liệu báo cáo lịch hẹn"
					description="Vui lòng kiểm tra dữ liệu lịch hẹn tại backend hoặc seed dữ liệu mẫu."
					style={{ marginBottom: 16 }}
				/>
			) : null}

			<Row gutter={[16, 16]}>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title={`Lịch hẹn (${statusText[period]})`} value={data.tongLich} formatter={(v) => numberFormat(v)} prefix={<CalendarOutlined style={{ color: palette.secondary }} />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title="Đã đặt" value={data.daDat} formatter={(v) => numberFormat(v)} prefix={<UserSwitchOutlined style={{ color: palette.primary }} />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title="Đã hoàn tất" value={data.daHoanTat} formatter={(v) => numberFormat(v)} prefix={<CheckCircleOutlined style={{ color: palette.success }} />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title="Đã hủy" value={data.daHuy} formatter={(v) => numberFormat(v)} prefix={<CloseCircleOutlined style={{ color: palette.danger }} />} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 2 }}>
				<Col xs={24} xl={10}>
					<Card title="Chỉ số vận hành lịch hẹn" style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}>
						<Space orientation="vertical" size={18} style={{ width: '100%' }}>
							<div>
								<Row justify="space-between">
									<Col>
										<Text strong>Tỷ lệ hoàn tất lịch hẹn</Text>
									</Col>
									<Col>
										<Tag color="success">{tyLeHoanTat}%</Tag>
									</Col>
								</Row>
								<Progress percent={tyLeHoanTat} strokeColor={palette.success} />
							</div>
							<div>
								<Row justify="space-between">
									<Col>
										<Text strong>Tỷ lệ hủy lịch hẹn</Text>
									</Col>
									<Col>
										<Tag color="error">{tyLeHuy}%</Tag>
									</Col>
								</Row>
								<Progress percent={tyLeHuy} strokeColor={palette.danger} />
							</div>
							<div>
								<Text strong>Lịch không đến</Text>
								<Card size="small" style={{ marginTop: 8, background: '#FFFBEB' }}>
									<Statistic value={data.khongDen} suffix="lịch" valueStyle={{ color: palette.warning, fontSize: 22 }} />
								</Card>
							</div>
						</Space>
					</Card>
				</Col>
				<Col xs={24} xl={14}>
					<Card title="Phân tích theo khung giờ" style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}>
						{heatmapLichHen.length === 0 ? (
							<Alert showIcon type="info" message="Chưa có dữ liệu theo khung giờ trong kỳ lọc." />
						) : (
							<Row gutter={[12, 12]}>
								{heatmapLichHen.map((item) => {
									const intensity = item.datLich / maxDatLich
									return (
										<Col xs={12} md={8} key={item.khungGio}>
											<Card
												size="small"
												style={{
													borderRadius: 10,
													borderColor: '#BFDBFE',
													background: `rgba(37, 99, 235, ${0.12 + intensity * 0.45})`,
												}}
											>
												<Text strong>{item.khungGio}</Text>
												<div>
													<Text>Đặt: {item.datLich}</Text>
												</div>
												<div>
													<Text style={{ color: palette.success }}>Hoàn tất: {item.hoanTat}</Text>
												</div>
												<div>
													<Text style={{ color: palette.danger }}>Hủy: {item.huy}</Text>
												</div>
											</Card>
										</Col>
									)
								})}
							</Row>
						)}
					</Card>
				</Col>
			</Row>

			<Card
				title="Tải công việc của bác sĩ"
				style={{ borderRadius: 12, borderColor: palette.border, marginTop: 16 }}
				extra={<Text type="secondary">Bảng theo dõi đã đặt, hoàn tất, hủy theo bác sĩ</Text>}
			>
				<Table rowKey="key" columns={columns} dataSource={tableData} pagination scroll={{ x: 720 }} />
			</Card>
		</div>
	)
}
