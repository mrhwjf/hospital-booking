import { Descriptions, Modal, Tag, Typography } from 'antd'

const { Text } = Typography

const genderLabelMap = {
	nam: 'Nam',
	nu: 'Nữ',
	khac: 'Khác',
}

const statusLabelMap = {
	hoat_dong: { label: 'Hoạt động', color: 'green' },
	khoa: { label: 'Khóa', color: 'red' },
}

export default function PatientDetailModal({ open, patient, onClose }) {
	const genderLabel = genderLabelMap[patient?.gioi_tinh] || '-'
	const statusMeta = statusLabelMap[patient?.trang_thai] || null

	return (
		<Modal
			title="Chi tiết bệnh nhân"
			open={open}
			onCancel={onClose}
			footer={null}
			width={860}
			centered
			destroyOnHidden
			bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
		>
			<div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
				<Descriptions bordered size="small" column={1} className="bg-white">
					<Descriptions.Item label="Mã bệnh nhân">{patient?.ma_benh_nhan || '-'}</Descriptions.Item>
					<Descriptions.Item label="Họ tên">{patient?.ho_ten || '-'}</Descriptions.Item>
					<Descriptions.Item label="Ngày sinh">{patient?.ngay_sinh || '-'}</Descriptions.Item>
					<Descriptions.Item label="Giới tính">{genderLabel}</Descriptions.Item>
					<Descriptions.Item label="Số điện thoại">{patient?.so_dien_thoai || '-'}</Descriptions.Item>
					<Descriptions.Item label="Email">{patient?.email || '-'}</Descriptions.Item>
					<Descriptions.Item label="CCCD">{patient?.so_cccd || '-'}</Descriptions.Item>
					<Descriptions.Item label="Địa chỉ">{patient?.dia_chi || '-'}</Descriptions.Item>
					<Descriptions.Item label="Người liên hệ">{patient?.nguoi_lien_he || '-'}</Descriptions.Item>
					<Descriptions.Item label="SĐT người liên hệ">{patient?.sdt_nguoi_lien_he || '-'}</Descriptions.Item>
					<Descriptions.Item label="Nhóm máu">{patient?.nhom_mau || '-'}</Descriptions.Item>
					<Descriptions.Item label="Tiền sử dị ứng">
						<Text className="whitespace-pre-wrap">{patient?.tien_su_di_ung || '-'}</Text>
					</Descriptions.Item>
					<Descriptions.Item label="Tiền sử bệnh">
						<Text className="whitespace-pre-wrap">{patient?.tien_su_benh || '-'}</Text>
					</Descriptions.Item>
					<Descriptions.Item label="Ghi chú">
						<Text className="whitespace-pre-wrap">{patient?.ghi_chu || '-'}</Text>
					</Descriptions.Item>
					<Descriptions.Item label="Trạng thái">
						{statusMeta ? <Tag color={statusMeta.color}>{statusMeta.label}</Tag> : '-'}
					</Descriptions.Item>
				</Descriptions>
			</div>
		</Modal>
	)
}
