import { Avatar, Card, Tag, Typography } from 'antd'
import { doctorSpecialties, doctors, specialties } from '../mockData'

const { Paragraph, Title } = Typography

export default function DoctorCard({ doctor = doctors[0], selected = false, onSelect }) {
	if (!doctor) {
		return null
	}

	const specialtyIds = doctorSpecialties
		.filter((item) => item.bac_si_id === doctor.id)
		.map((item) => item.chuyen_khoa_id)

	const specialtyNames = specialties
		.filter((specialty) => specialtyIds.includes(specialty.id))
		.map((specialty) => specialty.ten_chuyen_khoa)

	return (
		<Card
			hoverable
			onClick={() => onSelect?.(doctor)}
			className={selected ? 'border-[#0F766E] bg-teal-50/40' : 'border-slate-200'}
		>
			<div className="flex items-start gap-3">
				<Avatar src={doctor.avatar} size={60} />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<Title level={5} className="mb-0 text-[#0F172A]">{doctor.ho_ten}</Title>
						{selected && <Tag color="cyan">Đã chọn</Tag>}
					</div>
					<Paragraph className="mb-1 mt-1 text-slate-500">{doctor.gioi_thieu}</Paragraph>
					<div className="flex flex-wrap items-center gap-2">
						<Tag color="blue">{doctor.hoc_vi.replace('_', ' ')}</Tag>
						<Tag color="green">{doctor.kinh_nghiem} năm kinh nghiệm</Tag>
						{specialtyNames.map((name) => (
							<Tag key={`${doctor.id}-${name}`}>{name}</Tag>
						))}
					</div>
				</div>
			</div>
		</Card>
	)
}
