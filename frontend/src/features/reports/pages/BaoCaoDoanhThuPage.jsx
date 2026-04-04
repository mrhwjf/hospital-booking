import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Col, DatePicker, Progress, Row, Select, Space, Spin, Statistic, Table, Tag, Typography, message } from 'antd'
import { DollarCircleOutlined, FundOutlined, RiseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { layBaoCaoDoanhThu } from '../../../api/reportApi'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const palette = {
	primary: '#0F766E',
	secondary: '#2563EB',
	success: '#16A34A',
	warning: '#F59E0B',
	danger: '#DC2626',
	bg: '#F8FAFC',
	border: '#E2E8F0',
}

const moneyFormat = (value) =>
	new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value)

const numberFormat = (value) => new Intl.NumberFormat('vi-VN').format(value)

export default function BaoCaoDoanhThuPage() {
	const [loading, setLoading] = useState(false)
	const [baoCaoData, setBaoCaoData] = useState(null)
	const [khoangNgay, setKhoangNgay] = useState(() => [dayjs().subtract(30, 'day'), dayjs()])
	const [chuyenKhoaId, setChuyenKhoaId] = useState(undefined)
	const [loaiDichVu, setLoaiDichVu] = useState(undefined)

	useEffect(() => {
		const fetchBaoCao = async () => {
			setLoading(true)
			try {
				const params = {}
				if (khoangNgay?.[0] && khoangNgay?.[1]) {
					params.tu_ngay = khoangNgay[0].format('YYYY-MM-DD')
					params.den_ngay = khoangNgay[1].format('YYYY-MM-DD')
				}
				if (chuyenKhoaId) {
					params.chuyen_khoa_id = chuyenKhoaId
				}
				if (loaiDichVu) {
					params.loai_dich_vu = loaiDichVu
				}

				const response = await layBaoCaoDoanhThu(params)
				setBaoCaoData(response?.data ?? null)
			} catch {
				message.error('Không thể tải dữ liệu báo cáo doanh thu.')
			} finally {
				setLoading(false)
			}
		}

		fetchBaoCao()
	}, [khoangNgay, chuyenKhoaId, loaiDichVu])

	const doanhThuTheoChuyenKhoa = baoCaoData?.doanhThuTheoChuyenKhoa ?? []
	const xuHuongDoanhThuThang = baoCaoData?.xuHuongDoanhThuThang ?? []
	const summary = baoCaoData?.summary ?? {
		tongDoanhThu: 0,
		tongLuotKham: 0,
		doanhThuTrungBinh: 0,
		mucTieuThang: 1,
		doanhThuThangGanNhat: 0,
	}
	const tongDoanhThu = summary.tongDoanhThu
	const tongLuotKham = summary.tongLuotKham
	const doanhThuTrungBinh = summary.doanhThuTrungBinh
	const mucTieuThang = summary.mucTieuThang || 1
	const doanhThuThangGanNhat = summary.doanhThuThangGanNhat
	const progressTarget = Number(((doanhThuThangGanNhat / mucTieuThang) * 100).toFixed(1))
	const maxRevenue = Math.max(...xuHuongDoanhThuThang.map((item) => item.doanhThu), 1)

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
			title: 'Chuyên khoa',
			dataIndex: 'tenChuyenKhoa',
			key: 'tenChuyenKhoa',
			render: (value) => <Text strong>{value}</Text>,
		},
		{
			title: 'Số lượt khám',
			dataIndex: 'soLuotKham',
			key: 'soLuotKham',
			align: 'right',
			render: (value) => numberFormat(value),
		},
		{
			title: 'Doanh thu',
			dataIndex: 'doanhThu',
			key: 'doanhThu',
			align: 'right',
			render: (value) => <Text style={{ color: palette.primary, fontWeight: 600 }}>{moneyFormat(value)}</Text>,
		},
		{
			title: 'Tăng trưởng',
			dataIndex: 'tangTruong',
			key: 'tangTruong',
			align: 'right',
			render: (value) => <Tag color={value >= 10 ? 'success' : 'processing'}>{value}%</Tag>,
		},
	]

	return (
		<div
			style={{
				background: `radial-gradient(circle at 0% 0%, #D1FAE5 0%, ${palette.bg} 35%, ${palette.bg} 100%)`,
				minHeight: '100vh',
				padding: 24,
				fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
			}}
		>
			<Card
				bordered={false}
				style={{ borderRadius: 16, marginBottom: 16, background: 'linear-gradient(120deg, #0F766E 0%, #0EA5A4 100%)' }}
			>
				<Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
					Báo cáo doanh thu theo chuyên khoa
				</Title>
				<Text style={{ color: 'rgba(255,255,255,0.9)' }}>
					Theo dõi doanh thu, số lượt khám và mức tăng trưởng theo từng khoa trong kỳ phân tích.
				</Text>
			</Card>

			<Card style={{ borderRadius: 12, borderColor: palette.border, marginBottom: 16 }}>
				<Row gutter={[12, 12]}>
					<Col xs={24} md={12} xl={10}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Kỳ báo cáo</Text>
							<RangePicker
								style={{ width: '100%' }}
								format="DD/MM/YYYY"
								value={khoangNgay}
								onChange={(value) => setKhoangNgay(value)}
							/>
						</Space>
					</Col>
					<Col xs={24} md={6} xl={7}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Chuyên khoa</Text>
							<Select
								allowClear
								placeholder="Tất cả chuyên khoa"
								value={chuyenKhoaId}
								onChange={setChuyenKhoaId}
								options={chuyenKhoaOptions}
							/>
						</Space>
					</Col>
					<Col xs={24} md={6} xl={7}>
						<Space orientation="vertical" size={4} style={{ width: '100%' }}>
							<Text strong>Loại dịch vụ</Text>
							<Select
								allowClear
								placeholder="Tất cả"
								value={loaiDichVu}
								onChange={setLoaiDichVu}
								options={[
									{ label: 'Khám bệnh', value: 'kham_benh' },
									{ label: 'Xét nghiệm', value: 'xet_nghiem' },
									{ label: 'Chẩn đoán hình ảnh', value: 'chan_doan_hinh_anh' },
									{ label: 'Thủ thuật', value: 'thu_thuat' },
									{ label: 'Phẫu thuật', value: 'phau_thuat' },
									{ label: 'Khác', value: 'khac' },
								]}
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
					message="Chưa có dữ liệu báo cáo doanh thu"
					description="Vui lòng kiểm tra endpoint backend hoặc dữ liệu seed."
					style={{ marginBottom: 16 }}
				/>
			) : null}

			<Row gutter={[16, 16]}>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic
							title="Tổng doanh thu"
							value={tongDoanhThu}
							formatter={(v) => moneyFormat(v)}
							prefix={<DollarCircleOutlined style={{ color: palette.primary }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title="Tổng lượt khám" value={tongLuotKham} formatter={(v) => numberFormat(v)} prefix={<FundOutlined style={{ color: palette.secondary }} />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Statistic title="Doanh thu trung bình/lượt" value={doanhThuTrungBinh} formatter={(v) => moneyFormat(v)} prefix={<RiseOutlined style={{ color: palette.success }} />} />
					</Card>
				</Col>
				<Col xs={24} md={12} xl={6}>
					<Card style={{ borderRadius: 12, borderColor: palette.border }}>
						<Text strong>Tiến độ mục tiêu tháng</Text>
						<Progress percent={Math.min(progressTarget, 100)} strokeColor={palette.primary} style={{ marginTop: 8 }} />
						<Text type="secondary">{moneyFormat(doanhThuThangGanNhat)} / {moneyFormat(mucTieuThang)}</Text>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 2 }}>
				<Col xs={24} xl={15}>
					<Card title="Doanh thu theo chuyên khoa" style={{ borderRadius: 12, borderColor: palette.border }}>
						<Table rowKey="key" columns={columns} dataSource={doanhThuTheoChuyenKhoa} pagination />
					</Card>
				</Col>
				<Col xs={24} xl={9}>
					<Card title="Xu hướng doanh thu 6 tháng" style={{ borderRadius: 12, borderColor: palette.border, height: '100%' }}>
						<Space orientation="vertical" size={12} style={{ width: '100%' }}>
							{xuHuongDoanhThuThang.map((item) => (
								<div key={item.thang}>
									<Row justify="space-between">
										<Col>
											<Text strong>{item.thang}</Text>
										</Col>
										<Col>
											<Text>{moneyFormat(item.doanhThu)}</Text>
										</Col>
									</Row>
									<div
										style={{
											marginTop: 6,
											background: '#E2E8F0',
											borderRadius: 999,
											height: 10,
											overflow: 'hidden',
										}}
									>
										<div
											style={{
												width: `${(item.doanhThu / maxRevenue) * 100}%`,
												height: '100%',
												background: 'linear-gradient(90deg, #2563EB, #06B6D4)',
											}}
										/>
									</div>
								</div>
							))}
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	)
}
