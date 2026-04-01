import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	Space,
	Spin,
	Tag,
	Typography,
	message,
} from 'antd';
import { MailOutlined, PhoneOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import {
	capNhatCauHinhHeThong,
	layDanhSachCauHinhHeThong,
} from '../../../services/admin/systemConfigService';

const { Title, Text } = Typography;

const CONFIG_DEFINITIONS = [
	{
		khoa: 'THOI_GIAN_HUY_TOI_THIEU',
		label: 'Thời gian hủy tối thiểu (giờ)',
		nhom: 'lich_hen',
		type: 'number',
		min: 1,
		max: 72,
		requiredMessage: 'Vui lòng nhập số giờ hủy tối thiểu.',
	},
	{
		khoa: 'THOI_GIAN_DOI_TOI_THIEU',
		label: 'Thời gian đổi lịch tối thiểu (giờ)',
		nhom: 'lich_hen',
		type: 'number',
		min: 1,
		max: 168,
		requiredMessage: 'Vui lòng nhập số giờ đổi lịch tối thiểu.',
	},
	{
		khoa: 'SO_NGAY_DAT_TRUOC_TOI_DA',
		label: 'Số ngày đặt trước tối đa',
		nhom: 'lich_hen',
		type: 'number',
		min: 1,
		max: 365,
		requiredMessage: 'Vui lòng nhập số ngày đặt trước tối đa.',
	},
	{
		khoa: 'THOI_LUONG_KHAM_MAC_DINH',
		label: 'Thời lượng khám mặc định (phút)',
		nhom: 'lich_hen',
		type: 'number',
		min: 5,
		max: 240,
		requiredMessage: 'Vui lòng nhập thời lượng khám mặc định.',
	},
	{
		khoa: 'TEN_BENH_VIEN',
		label: 'Tên bệnh viện/phòng khám',
		nhom: 'chung',
		type: 'text',
		requiredMessage: 'Vui lòng nhập tên bệnh viện.',
	},
	{
		khoa: 'DIA_CHI',
		label: 'Địa chỉ',
		nhom: 'chung',
		type: 'textarea',
		requiredMessage: 'Vui lòng nhập địa chỉ.',
	},
	{
		khoa: 'SO_DIEN_THOAI',
		label: 'Số điện thoại liên hệ',
		nhom: 'chung',
		type: 'phone',
		requiredMessage: 'Vui lòng nhập số điện thoại.',
	},
	{
		khoa: 'EMAIL',
		label: 'Email liên hệ',
		nhom: 'chung',
		type: 'email',
		requiredMessage: 'Vui lòng nhập email liên hệ.',
	},
];

const NHOM_LABEL = {
	lich_hen: 'Thiết lập lịch hẹn',
	chung: 'Thông tin chung',
};

const ORDERED_GROUPS = ['lich_hen', 'chung'];

const parseGiaTriForm = (definition, rawValue) => {
	if (definition.type === 'number') {
		const parsed = Number(rawValue);
		return Number.isFinite(parsed) ? parsed : undefined;
	}

	return rawValue ?? '';
};

const toStoredGiaTri = (definition, formValue) => {
	if (definition.type === 'number') {
		return String(formValue);
	}

	return String(formValue ?? '').trim();
};

export default function SystemConfigPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [configItems, setConfigItems] = useState([]);
	const [form] = Form.useForm();

	const configDefinitionMap = useMemo(
		() =>
			CONFIG_DEFINITIONS.reduce((acc, definition) => {
				acc[definition.khoa] = definition;
				return acc;
			}, {}),
		[]
	);

	const groupedDefinitions = useMemo(() => {
		const grouped = CONFIG_DEFINITIONS.reduce((acc, definition) => {
			if (!acc[definition.nhom]) {
				acc[definition.nhom] = [];
			}
			acc[definition.nhom].push(definition);
			return acc;
		}, {});

		return ORDERED_GROUPS.map((groupKey) => ({
			groupKey,
			title: NHOM_LABEL[groupKey] ?? groupKey,
			items: grouped[groupKey] ?? [],
		})).filter((group) => group.items.length > 0);
	}, []);

	const fetchConfigs = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await layDanhSachCauHinhHeThong({ page: 1, per_page: 100 });
			const items = response.data;

			setConfigItems(items);

			const initialValues = items.reduce((acc, item) => {
				const definition = configDefinitionMap[item.khoa];
				if (!definition) return acc;
				acc[item.khoa] = parseGiaTriForm(definition, item.gia_tri);
				return acc;
			}, {});

			form.setFieldsValue(initialValues);
		} catch (error) {
			message.error(error?.response?.data?.message ?? 'Không tải được cấu hình hệ thống.');
		} finally {
			setIsLoading(false);
		}
	}, [configDefinitionMap, form]);

	useEffect(() => {
		fetchConfigs();
	}, [fetchConfigs]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setIsSaving(true);

			const payload = configItems
				.map((item) => {
					const definition = configDefinitionMap[item.khoa];
					if (!definition) return null;

					return {
						khoa: item.khoa,
						mo_ta: item.mo_ta,
						nhom: item.nhom,
						gia_tri: toStoredGiaTri(definition, values[item.khoa]),
					};
				})
				.filter(Boolean);

			if (payload.length === 0) {
				message.warning('Không tìm thấy cấu hình phù hợp để cập nhật.');
				return;
			}

			await capNhatCauHinhHeThong(payload);
			message.success('Cập nhật cấu hình hệ thống thành công.');
			fetchConfigs();
		} catch (error) {
			if (!error?.errorFields) {
				message.warning(error?.response?.data?.message ?? 'Vui lòng kiểm tra lại các trường cấu hình.');
			}
		} finally {
			setIsSaving(false);
		}
	};

	const extraConfigItems = useMemo(() => {
		const knownKeys = new Set(CONFIG_DEFINITIONS.map((definition) => definition.khoa));
		return configItems.filter((item) => !knownKeys.has(item.khoa));
	}, [configItems]);

	return (
		<div
			className="p-4 md:p-6"
			style={{
				minHeight: 'calc(100vh - 180px)',
				background: 'linear-gradient(160deg, #E6F4F1 0%, #F8FAFC 35%, #F8FAFC 100%)',
			}}
		>
			<div className="mx-auto w-full max-w-[1280px]">
			<Card
				bordered={false}
				style={{
					borderRadius: 14,
					marginBottom: 16,
					background: 'linear-gradient(120deg, #0F766E 0%, #2563EB 100%)',
				}}
			>
				<Space orientation="vertical" size={4}>
					<Title level={3} style={{ margin: 0, color: '#ffffff' }}>
						Cấu hình hệ thống đặt lịch
					</Title>
					<Text style={{ color: 'rgba(255,255,255,0.9)' }}>
						Thiết lập ngưỡng nghiệp vụ và trạng thái vận hành cho toàn bộ hệ thống.
					</Text>
				</Space>
			</Card>

			<Card title="Thông số cấu hình" style={{ borderRadius: 12 }}>
				<Spin spinning={isLoading}>
					<Form form={form} layout="vertical">
						{groupedDefinitions.map((group, groupIndex) => (
							<div key={group.groupKey}>
								<Space align="center" style={{ marginBottom: 12 }}>
									<Text strong>{group.title}</Text>
									<Tag color="blue">{group.groupKey}</Tag>
								</Space>

								<Row gutter={[16, 8]}>
									{group.items.map((item) => {
										const rules = [{ required: true, message: item.requiredMessage }];
										if (item.type === 'email') {
											rules.push({ type: 'email', message: 'Email không đúng định dạng.' });
										}

										if (item.type === 'phone') {
											rules.push({
												pattern: /^[0-9+\-\s()]{8,20}$/,
												message: 'Số điện thoại không hợp lệ.',
											});
										}

										return (
											<Col key={item.khoa} xs={24} md={12} xl={item.type === 'textarea' ? 24 : 12}>
												<Form.Item label={item.label} name={item.khoa} rules={rules}>
													{item.type === 'number' ? (
														<InputNumber min={item.min} max={item.max} style={{ width: '100%' }} />
													) : item.type === 'textarea' ? (
														<Input.TextArea rows={3} />
													) : (
														<Input
															prefix={item.type === 'email' ? <MailOutlined /> : item.type === 'phone' ? <PhoneOutlined /> : null}
														/>
													)}
												</Form.Item>
											</Col>
										);
									})}
								</Row>

								{groupIndex < groupedDefinitions.length - 1 && <Divider style={{ marginTop: 8 }} />}
							</div>
						))}

						{extraConfigItems.length > 0 && (
							<Alert
								type="warning"
								showIcon
								message="Có cấu hình chưa được đưa vào form"
								description={`Phát hiện ${extraConfigItems.length} khóa cấu hình khác trong cơ sở dữ liệu. Bạn có thể mở rộng UI để quản lý thêm nếu cần.`}
								style={{ marginBottom: 16 }}
							/>
						)}

						<Button type="primary" icon={<SaveOutlined />} loading={isSaving} onClick={handleSubmit} className="w-full sm:w-auto">
							Lưu cấu hình
						</Button>
					</Form>
				</Spin>
			</Card>

			<Card title="Hướng dẫn vận hành" style={{ borderRadius: 12, marginTop: 16 }}>
				<Space orientation="vertical" size={6}>
					<Text>
						<SettingOutlined /> Mỗi cấu hình được quản lý theo khoa trong bảng cau_hinh_he_thong để dễ tra cứu và kiểm toán.
					</Text>
					<Text>
						<SettingOutlined /> Với nhóm lich_hen, nên giữ các ngưỡng giờ/ngày hợp lý để hạn chế đổi hoặc hủy sát giờ khám.
					</Text>
					<Text>
						<SettingOutlined /> Sau khi cập nhật cấu hình, nên kiểm tra lại các luồng đặt lịch để đảm bảo nghiệp vụ hoạt động đúng.
					</Text>
				</Space>
			</Card>
			</div>
		</div>
	);
}
