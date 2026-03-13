import { Avatar, Card, Tag, Typography } from 'antd'

const { Paragraph, Title } = Typography

export default function DoctorCard({ doctor, selected = false, onSelect, specialtyNames = [] }) {
	if (!doctor) {
		return null
	}

	const resolvedSpecialtyNames =
		specialtyNames.length > 0
			? specialtyNames
			: (doctor.bac_si_chuyen_khoas || [])
				.map((item) => item?.chuyen_khoa?.ten_chuyen_khoa)
				.filter(Boolean)

	return (
		<Card
			hoverable
			onClick={() => onSelect?.(doctor)}
			className={selected ? 'border-[#0F766E] bg-teal-50/40' : 'border-slate-200'}
		>
			<div className="flex items-start gap-3">
				<Avatar src={doctor.avatar || doctor.hinh_anh || undefined} size={60}>
					{doctor.ho_ten?.slice(0, 1) || 'B'}
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<Title level={5} className="mb-0 text-[#0F172A]">{doctor.ho_ten}</Title>
						{selected && <Tag color="cyan">Đã chọn</Tag>}
					</div>
					<Paragraph className="mb-1 mt-1 text-slate-500">{doctor.gioi_thieu || 'Chua co mo ta gioi thieu.'}</Paragraph>
					<div className="flex flex-wrap items-center gap-2">
						{doctor.hoc_vi && <Tag color="blue">{doctor.hoc_vi.replace('_', ' ')}</Tag>}
						{doctor.kinh_nghiem !== null && doctor.kinh_nghiem !== undefined && (
							<Tag color="green">{doctor.kinh_nghiem} nam kinh nghiem</Tag>
						)}
						{resolvedSpecialtyNames.map((name) => (
							<Tag key={`${doctor.id}-${name}`}>{name}</Tag>
						))}
					</div>
				</div>
			</div>
		</Card>
	)
}
