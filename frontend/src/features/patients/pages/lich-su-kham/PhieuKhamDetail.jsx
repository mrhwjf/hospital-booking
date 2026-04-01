import { Card, Descriptions, Empty, Skeleton, Space, Tag, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

const statusMeta = {
	tiep_nhan: { label: 'Tiếp nhận', color: 'gold' },
	dang_kham: { label: 'Đang khám', color: 'blue' },
	cho_ke_don: { label: 'Chờ kê đơn', color: 'purple' },
	hoan_thanh: { label: 'Hoàn thành', color: 'green' },
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

export default function PhieuKhamDetail({ detail, loading }) {
	if (loading) {
		return <Skeleton active paragraph={{ rows: 10 }} />
	}

	if (!detail) {
		return <Empty description="Không có dữ liệu phiếu khám." />
	}

	const status = statusMeta[detail.trang_thai]

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Card className="border-[#E2E8F0]">
				<Space direction="vertical" size={4} className="w-full">
					<Title level={5} className="mb-0">
						{detail.ma_phieu_kham}
					</Title>
					<Text type="secondary">
						Thời gian tiếp nhận: {formatDateTime(detail.thoi_gian_tiep_nhan)}
					</Text>
					<div>
						<Tag color={status?.color || 'default'}>{status?.label || detail.trang_thai}</Tag>
					</div>
				</Space>
			</Card>

			<Card className="border-[#E2E8F0]" title="Thông tin khám bệnh">
				<Descriptions column={1} size="small" bordered>
					<Descriptions.Item label="Bác sĩ phụ trách">
						{detail.bac_si?.ho_ten || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Mã lịch hẹn">
						{detail.lich_hen?.ma_lich_hen || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Ngày hẹn">
						{formatDate(detail.lich_hen?.ngay_hen)}
					</Descriptions.Item>
					<Descriptions.Item label="Mã ICD10">
						{detail.ma_icd10_chinh || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Tên chẩn đoán ICD10">
						{detail.icd10?.ten_chan_doan || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Chẩn đoán lâm sàng">
						{detail.chan_doan || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Triệu chứng">
						{detail.trieu_chung || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Kết quả khám">
						{detail.ket_qua_kham || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Hướng điều trị">
						{detail.huong_dieu_tri || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Lời dặn">
						{detail.loi_dan || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Hẹn tái khám">
						{formatDate(detail.hen_tai_kham)}
					</Descriptions.Item>
				</Descriptions>
			</Card>

			<Card className="border-[#E2E8F0]" title="Dấu hiệu sinh tồn">
				<Descriptions column={2} size="small" bordered>
					<Descriptions.Item label="Mạch">{detail.mach || '-'}</Descriptions.Item>
					<Descriptions.Item label="Nhiệt độ">{detail.nhiet_do || '-'}</Descriptions.Item>
					<Descriptions.Item label="Huyết áp">{detail.huyet_ap || '-'}</Descriptions.Item>
					<Descriptions.Item label="Cân nặng">{detail.can_nang || '-'}</Descriptions.Item>
					<Descriptions.Item label="Chiều cao">{detail.chieu_cao || '-'}</Descriptions.Item>
				</Descriptions>
			</Card>

			{/* <Paragraph className="mb-0 text-slate-500">
				Ghi chú nội bộ của bác sĩ/nhân viên không hiển thị ở màn hình bệnh nhân theo quy tắc phân quyền.
			</Paragraph> */}
		</Space>
	)
}
