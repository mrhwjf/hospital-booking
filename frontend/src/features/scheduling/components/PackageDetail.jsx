import { Modal, Table, Typography } from 'antd'
import { TABLE_STYLES } from '../styles/const-styles'

const { Text } = Typography

export default function PackageDetailModal({ pkg, open, onClose }) {

	const data =
		pkg?.chi_tiet_goi_khams?.map((row, index) => ({
			key: index,
			stt: index + 1,
			ten_dich_vu: row?.dich_vu?.ten_dich_vu,
			gia: row?.dich_vu?.gia_dich_vu,
		})) || []

	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
			width: 70,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'ten_dich_vu',
		},
	]

	return (
		<Modal
			title={pkg ? `Chi tiết gói: ${pkg.ten_goi_kham}` : 'Chi tiết gói khám'}
			open={open}
			onCancel={onClose}
			footer={null}
			centered
			width={720}
		>

			<Table
				className={TABLE_STYLES.header}
				columns={columns}
				dataSource={data}
				pagination={false}
				size="small"
				rowClassName={() => 'hover:bg-slate-50'}
				locale={{ emptyText: 'Chưa cấu hình dịch vụ trong gói' }}
			/>

		</Modal>
	)
}