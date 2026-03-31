import { useMemo, useState } from 'react'
import { Avatar, Card, Input, Radio, Rate, Space, Tag, Typography } from 'antd'
import {
	doctorSpecialties as defaultDoctorSpecialties,
	doctors as defaultDoctors,
	specialties as defaultSpecialties,
} from '../mockData'

const { Text, Title } = Typography

export default function DoctorPicker({
	doctors = defaultDoctors,
	specialties = defaultSpecialties,
	doctorSpecialties = defaultDoctorSpecialties,
	value,
	specialtyId,
	onChange,
	onSpecialtyChange,
}) {
	const [internalDoctorId, setInternalDoctorId] = useState(doctors[0]?.id)
	const [internalSpecialtyId, setInternalSpecialtyId] = useState(specialties[0]?.id)
	const [keyword, setKeyword] = useState('')

	const selectedDoctorId = value ?? internalDoctorId
	const selectedSpecialtyId = specialtyId ?? internalSpecialtyId

	const filteredDoctors = useMemo(() => {
		const normalizedKeyword = keyword.trim().toLowerCase()
		return doctors.filter((doctor) => {
			const sameSpecialty = doctorSpecialties.some(
				(item) => item.bac_si_id === doctor.id && item.chuyen_khoa_id === selectedSpecialtyId,
			)
			const matchesKeyword =
				normalizedKeyword.length === 0 ||
				doctor.ho_ten.toLowerCase().includes(normalizedKeyword) ||
				doctor.gioi_thieu.toLowerCase().includes(normalizedKeyword)

			return sameSpecialty && matchesKeyword
		})
	}, [doctorSpecialties, doctors, keyword, selectedSpecialtyId])

	const handleDoctorChange = (doctorId) => {
		if (onChange) {
			onChange(doctorId)
			return
		}
		setInternalDoctorId(doctorId)
	}

	const handleSpecialtyChange = (nextSpecialtyId) => {
		if (onSpecialtyChange) {
			onSpecialtyChange(nextSpecialtyId)
		} else {
			setInternalSpecialtyId(nextSpecialtyId)
		}

		const firstDoctor = doctors.find((doctor) =>
			doctorSpecialties.some(
				(item) => item.bac_si_id === doctor.id && item.chuyen_khoa_id === nextSpecialtyId,
			),
		)
		if (firstDoctor) {
			handleDoctorChange(firstDoctor.id)
		}
	}

	return (
		<Space direction="vertical" size={12} className="w-full">
			<div className="rounded-xl border border-slate-500 bg-white p-4">
				<Title level={5} className="mb-2">Chọn chuyên khoa</Title>
				<Radio.Group
					value={selectedSpecialtyId}
					onChange={(event) => handleSpecialtyChange(event.target.value)}
					className="w-full"
				>
					<Space wrap>
						{specialties.map((specialty) => (
							<Radio.Button key={specialty.id} value={specialty.id}>
								{specialty.ten_chuyen_khoa}
							</Radio.Button>
						))}
					</Space>
				</Radio.Group>

				<Input
					className="mt-3"
					placeholder="Tìm bác sĩ theo tên hoặc mô tả"
					value={keyword}
					onChange={(event) => setKeyword(event.target.value)}
				/>
			</div>

			<div className="grid gap-3">
				{filteredDoctors.map((doctor) => {
					const selected = selectedDoctorId === doctor.id
					return (
						<Card
							key={doctor.id}
							className={selected ? 'border-teal-600 bg-teal-50/50' : 'border-slate-500'}
							hoverable
							onClick={() => handleDoctorChange(doctor.id)}
						>
							<div className="flex items-start gap-3">
								<Avatar src={doctor.avatar} size={56} />
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<Title level={5} className="mb-0 text-slate-900">
											{doctor.ho_ten}
										</Title>
										{selected && <Tag color="cyan">Đã chọn</Tag>}
									</div>
									<Text className="text-slate-500">{doctor.gioi_thieu}</Text>
									<div className="mt-2 flex flex-wrap items-center gap-3">
										<Tag color="blue">{doctor.kinh_nghiem} năm kinh nghiệm</Tag>
										<span className="flex items-center gap-1">
											<Rate disabled allowHalf defaultValue={doctor.rating} className="text-sm" />
											<Text>{doctor.rating} ({doctor.reviews} đánh giá)</Text>
										</span>
									</div>
								</div>
							</div>
						</Card>
					)
				})}

				{filteredDoctors.length === 0 && (
					<Card className="border-dashed border-slate-500">
						<Text className="text-slate-500">Không tìm thấy bác sĩ phù hợp.</Text>
					</Card>
				)}
			</div>
		</Space>
	)
}
