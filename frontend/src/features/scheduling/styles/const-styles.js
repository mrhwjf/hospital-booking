export const SEGMENTED_STYLES = [
	'border border-slate-500 rounded-lg p-1 bg-slate-50',
	'[&_.ant-segmented-thumb]:!bg-[#0f766e]',
	'[&_.ant-segmented-item-selected]:!bg-[#0f766e]',
	'[&_.ant-segmented-item-selected]:!text-white',
].join(' ');

export const MODAL_STYLES = {
	verticalStatic: {
		top: '10vh',
	},
}

export const TABLE_STYLES = {
	header: `
		[&_.ant-table-thead>tr>th]:!bg-[#0f766e]
		[&_.ant-table-thead>tr>th]:!text-white
	`,
}