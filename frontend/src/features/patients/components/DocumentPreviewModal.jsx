import { Alert, Button, Modal, Space, Spin, Typography, Grid } from 'antd'
const { useBreakpoint } = Grid
const { Link, Text } = Typography

export default function DocumentPreviewModal({
	open,
	onClose,
	title = 'Xem tài liệu',
	url,
	loading = false,
}) {
	const screens = useBreakpoint()
	return (
		<Modal
			width={screens.md ? 800 : '100%'}
			open={open}
			onCancel={onClose}
			title={title}
			footer={[
				<Button key="close" onClick={onClose}>
					Đóng
				</Button>,
			]}
			style={{ top: '4vh' }}
			styles={{
				body: {
					maxHeight: '78vh',
					overflow: 'hidden',
				},
			}}
			destroyOnHidden
		>
			{loading ? (
				<div className="flex h-[60vh] items-center justify-center">
					<Spin size="large" />
				</div>
			) : !url ? (
				<Alert
					type="warning"
					showIcon
					message="Không có URL xem tài liệu hợp lệ."
					description="Vui lòng đóng cửa sổ và thử lại thao tác mở tài liệu."
				/>
			) : (
				<Space direction="vertical" size={12} className="w-full">
					<div className="h-[65vh] overflow-hidden rounded-md border border-[#E2E8F0]">
						<iframe
							title={title}
							src={url}
							className="h-full w-full border-0"
							allow="fullscreen"
						/>
					</div>
					<Text type="secondary">
						Nếu không hiển thị được nội dung, mở trực tiếp tại: <Link href={url} target="_blank">liên kết tài liệu</Link>
					</Text>
				</Space>
			)}
		</Modal>
	)
}
