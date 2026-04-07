import { useCallback, useEffect, useState } from 'react'
import {
	Alert,
	Button,
	Card,
	Descriptions,
	Empty,
	Skeleton,
	Space,
	Tag,
	Typography,
	message,
} from 'antd'
import {
	CalendarOutlined,
	IdcardOutlined,
	MailOutlined,
	PhoneOutlined,
	ReloadOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { getThongTinNhanVienHienTai } from '../../../Services/schedulingService'
import { getApiErrorMessage } from '../../../utils/apiError'

const { Paragraph, Text, Title } = Typography

const roleLabelMap = {
	le_tan: 'Lễ tân',
	nhan_vien_y_te: 'Nhân viên y tế',
	dieu_duong: 'Điều dưỡng',
}

const staffStatusMeta = {
	hoat_dong: { label: 'Hoạt động', color: 'green' },
	tam_khoa: { label: 'Tạm khóa', color: 'gold' },
	nghi_viec: { label: 'Nghỉ việc', color: 'red' },
}

const accountStatusMeta = {
	hoat_dong: { label: 'Hoạt động', color: 'green' },
	tam_khoa: { label: 'Tạm khóa', color: 'gold' },
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

export default function StaffProfilePage() {
	const [loading, setLoading] = useState(false)
	const [profile, setProfile] = useState(null)

	const loadProfile = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getThongTinNhanVienHienTai()
			setProfile(response || null)
		} catch (error) {
			message.error(getApiErrorMessage(error, 'Không thể tải hồ sơ nhân viên.'))
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadProfile()
	}, [loadProfile])

	const staffStatus = staffStatusMeta[profile?.trang_thai]
	const accountStatus = accountStatusMeta[profile?.nguoi_dung?.trang_thai]

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
			<div className="mx-auto w-full max-w-4xl">
				<Space direction="vertical" size={16} className="w-full">
					<Card className="rounded-2xl border-[#E2E8F0]">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<Title level={3} className="mb-1">
									Hồ sơ nhân viên
								</Title>
								<Paragraph className="mb-0 text-slate-500">
									Xem thông tin hồ sơ công tác của nhân viên lâm sàng.
								</Paragraph>
							</div>
							<Button icon={<ReloadOutlined />} onClick={loadProfile}>
								Làm mới
							</Button>
						</div>
					</Card>

					{loading ? (
						<Card className="rounded-2xl border-[#E2E8F0]">
							<Skeleton active paragraph={{ rows: 8 }} />
						</Card>
					) : !profile ? (
						<Card className="rounded-2xl border-[#E2E8F0]">
							<Empty description="Không có dữ liệu hồ sơ nhân viên." />
						</Card>
					) : (
						<Card className="rounded-2xl border-[#E2E8F0]" title="Thông tin nhân viên">
							<Space direction="vertical" size={12} className="w-full">
								<div className="flex flex-wrap items-center gap-2">
									<Tag color={staffStatus?.color || 'default'}>
										{staffStatus?.label || profile.trang_thai}
									</Tag>
									{profile?.nguoi_dung?.trang_thai && (
										<Tag color={accountStatus?.color || 'default'}>
											Tài khoản: {accountStatus?.label || profile.nguoi_dung.trang_thai}
										</Tag>
									)}
								</div>

								<Descriptions bordered size="middle" column={1}>
									<Descriptions.Item
										label={<span><UserOutlined className="mr-2" />Họ tên</span>}
									>
										<Text strong>{profile.ho_ten || '-'}</Text>
									</Descriptions.Item>
									<Descriptions.Item
										label={<span><IdcardOutlined className="mr-2" />Mã nhân viên</span>}
									>
										{profile.ma_nhan_vien || '-'}
									</Descriptions.Item>
									<Descriptions.Item
										label={<span><PhoneOutlined className="mr-2" />Số điện thoại</span>}
									>
										{profile.so_dien_thoai || '-'}
									</Descriptions.Item>
									<Descriptions.Item
										label={<span><MailOutlined className="mr-2" />Email</span>}
									>
										{profile?.nguoi_dung?.email || '-'}
									</Descriptions.Item>
									<Descriptions.Item label="Chức vụ">
										{roleLabelMap[profile.chuc_vu] || profile.chuc_vu || '-'}
									</Descriptions.Item>
									<Descriptions.Item
										label={<span><CalendarOutlined className="mr-2" />Ngày vào làm</span>}
									>
										{formatDate(profile.ngay_vao_lam)}
									</Descriptions.Item>
									<Descriptions.Item label="Vai trò hệ thống">
										{profile?.nguoi_dung?.vai_tro?.ten_vai_tro || '-'}
									</Descriptions.Item>
									<Descriptions.Item label="Ghi chú">
										{profile.ghi_chu || '-'}
									</Descriptions.Item>
								</Descriptions>
							</Space>
						</Card>
					)}
				</Space>
			</div>
		</div>
	)
}
