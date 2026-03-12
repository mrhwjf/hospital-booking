import { useMemo, useState } from 'react'
import { Button, Card, Input, Segmented, Space, Tag, Typography } from 'antd'
import { formatCurrency, packages as defaultPackages, services as defaultServices } from '../mockData'

const { Paragraph, Text, Title } = Typography

export default function ServicePicker({
	selectedItems,
	onChange,
	services = defaultServices,
	packages = defaultPackages,
}) {
	const [mode, setMode] = useState('dich_vu')
	const [keyword, setKeyword] = useState('')

	const items = selectedItems ?? {}

	const list = useMemo(() => {
		const source = mode === 'dich_vu' ? services : packages
		const keyName = mode === 'dich_vu' ? 'ten_dich_vu' : 'ten_goi_kham'
		const normalizedKeyword = keyword.trim().toLowerCase()

		return source.filter((item) => item[keyName].toLowerCase().includes(normalizedKeyword))
	}, [keyword, mode, packages, services])

	const updateItem = (type, id, delta) => {
		const current = items[type]?.[id] ?? 0
		const next = Math.max(0, current + delta)

		const cloned = {
			dich_vu: { ...(items.dich_vu || {}) },
			goi_kham: { ...(items.goi_kham || {}) },
		}

		if (next === 0) {
			delete cloned[type][id]
		} else {
			cloned[type][id] = next
		}

		onChange?.(cloned)
	}

	const total = useMemo(() => {
		const serviceTotal = Object.entries(items.dich_vu || {}).reduce((sum, [id, qty]) => {
			const item = services.find((service) => service.id === Number(id))
			return sum + (item?.gia_dich_vu || 0) * qty
		}, 0)

		const packageTotal = Object.entries(items.goi_kham || {}).reduce((sum, [id, qty]) => {
			const item = packages.find((pkg) => pkg.id === Number(id))
			return sum + (item?.gia_goi_kham || 0) * qty
		}, 0)

		return serviceTotal + packageTotal
	}, [items.dich_vu, items.goi_kham, packages, services])

	return (
		<Space direction="vertical" size={12} className="w-full">
			<Card className="border-slate-200">
				<Title level={5} className="mb-2">Chọn dịch vụ hoặc gói khám</Title>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Segmented
						options={[
							{ label: 'Dịch vụ lẻ', value: 'dich_vu' },
							{ label: 'Gói khám', value: 'goi_kham' },
						]}
						value={mode}
						onChange={setMode}
					/>
					<Input
						placeholder="Tìm dịch vụ/gói khám"
						value={keyword}
						onChange={(event) => setKeyword(event.target.value)}
						className="sm:max-w-72"
					/>
				</div>
			</Card>

			<div className="grid gap-3">
				{list.map((item) => {
					const isService = mode === 'dich_vu'
					const name = isService ? item.ten_dich_vu : item.ten_goi_kham
					const price = isService ? item.gia_dich_vu : item.gia_goi_kham
					const qty = isService ? items.dich_vu?.[item.id] ?? 0 : items.goi_kham?.[item.id] ?? 0

					return (
						<Card key={`${mode}-${item.id}`} className={qty > 0 ? 'border-teal-600 bg-teal-50/40' : 'border-slate-200'}>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<div className="flex items-center gap-2">
										<Title level={5} className="mb-0">{name}</Title>
										{qty > 0 && <Tag color="cyan">Đã chọn</Tag>}
									</div>
									<Paragraph className="mb-1 mt-1 text-slate-500">
										{item.mo_ta}
									</Paragraph>
									<Text strong className="text-teal-700">{formatCurrency(price)}</Text>
								</div>

								<div className="flex items-center gap-2">
									<Button disabled={qty === 0} onClick={() => updateItem(mode, item.id, -1)}>-</Button>
									<Text className="min-w-6 text-center">{qty}</Text>
									<Button type="primary" onClick={() => updateItem(mode, item.id, 1)}>+</Button>
								</div>
							</div>
						</Card>
					)
				})}
			</div>

			<Card className="border-slate-200 bg-slate-50">
				<div className="flex items-center justify-between">
					<Text>Tổng tạm tính</Text>
					<Text strong className="text-lg text-teal-700">{formatCurrency(total)}</Text>
				</div>
			</Card>
		</Space>
	)
}