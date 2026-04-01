import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Button,
	Checkbox,
	Divider,
	Drawer,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Select,
	Space,
	Table,
	Tabs,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	LockOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	capNhatQuyen,
	capNhatVaiTro,
	layDanhSachQuyen,
	layDanhSachVaiTro,
	taoQuyen,
	taoVaiTro,
	xoaQuyen,
	xoaVaiTro,
} from '../../../services/admin/rolePermissionService';

const { Text } = Typography;

const STATUS_OPTIONS = [
	{ label: 'Hoạt động', value: 'hoat_dong' },
	{ label: 'Tạm khóa', value: 'khoa' },
];

const STATUS_LABEL_MAP = {
	hoat_dong: { label: 'Hoạt động', color: 'success' },
	khoa: { label: 'Tạm khóa', color: 'error' },
};

const PERMISSION_GROUP_LABEL = {
	'Quản lý': 'Quản lý',
	'Nghiệp vụ': 'Nghiệp vụ',
	'Báo cáo': 'Báo cáo',
	'Hệ thống': 'Hệ thống',
	quan_ly: 'Quản lý',
	nghiep_vu: 'Nghiệp vụ',
	bao_cao: 'Báo cáo',
	he_thong: 'Hệ thống',
	khac: 'Khác',
};

const normalizeGroupLabel = (group) => {
	if (!group) return 'Khác';
	return PERMISSION_GROUP_LABEL[group] ?? group;
};

const toRolePermissionIds = (role) =>
	Array.isArray(role?.quyens)
		? role.quyens
				.map((permission) => permission.id)
				.filter(Boolean)
		: [];

const sortByCode = (a, b, key) => String(a?.[key] ?? '').localeCompare(String(b?.[key] ?? ''));

export default function RolePermissionPage() {
	const [activeTab, setActiveTab] = useState('roles');

	const [roleData, setRoleData] = useState([]);
	const [roleLoading, setRoleLoading] = useState(false);
	const [rolePagination, setRolePagination] = useState({ page: 1, perPage: 10, total: 0 });
	const [roleKeyword, setRoleKeyword] = useState('');
	const [roleStatus, setRoleStatus] = useState(undefined);

	const [permissionData, setPermissionData] = useState([]);
	const [permissionLoading, setPermissionLoading] = useState(false);
	const [permissionPagination, setPermissionPagination] = useState({ page: 1, perPage: 10, total: 0 });
	const [permissionKeyword, setPermissionKeyword] = useState('');
	const [permissionGroup, setPermissionGroup] = useState(undefined);

	const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
	const [roleSaving, setRoleSaving] = useState(false);
	const [editingRole, setEditingRole] = useState(null);
	const [permissionSearchInDrawer, setPermissionSearchInDrawer] = useState('');

	const [permissionModalOpen, setPermissionModalOpen] = useState(false);
	const [permissionSaving, setPermissionSaving] = useState(false);
	const [editingPermission, setEditingPermission] = useState(null);

	const [roleForm] = Form.useForm();
	const [permissionForm] = Form.useForm();

	const permissionGroupOptions = useMemo(() => {
		const groups = new Set(permissionData.map((item) => item.nhom_quyen).filter(Boolean));
		return [...groups]
			.sort((a, b) => String(a).localeCompare(String(b)))
			.map((group) => ({ value: group, label: normalizeGroupLabel(group) }));
	}, [permissionData]);

	const groupedPermissionsForDrawer = useMemo(() => {
		const keyword = permissionSearchInDrawer.trim().toLowerCase();
		const filtered = permissionData.filter((item) => {
			if (!keyword) return true;
			return (
				item.ma_quyen.toLowerCase().includes(keyword) ||
				item.ten_quyen.toLowerCase().includes(keyword) ||
				normalizeGroupLabel(item.nhom_quyen).toLowerCase().includes(keyword)
			);
		});

		const grouped = filtered.reduce((acc, item) => {
			const group = normalizeGroupLabel(item.nhom_quyen);
			if (!acc[group]) acc[group] = [];
			acc[group].push(item);
			return acc;
		}, {});

		return Object.entries(grouped)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([group, items]) => ({
				group,
				items: [...items].sort((a, b) => sortByCode(a, b, 'ma_quyen')),
			}));
	}, [permissionData, permissionSearchInDrawer]);

	const fetchPermissions = useCallback(async (page = 1, appendOptions = {}) => {
		setPermissionLoading(true);
		try {
			const params = {
				page,
				per_page: permissionPagination.perPage,
				...appendOptions,
			};

			if (permissionKeyword.trim()) params.q = permissionKeyword.trim();
			if (permissionGroup) params.nhom_quyen = permissionGroup;

			const response = await layDanhSachQuyen(params);
			setPermissionData(response.data);
			setPermissionPagination((prev) => ({
				...prev,
				page: response.meta.page,
				total: response.meta.total,
			}));
		} catch (error) {
			message.error(error?.response?.data?.message ?? 'Không tải được danh sách quyền.');
		} finally {
			setPermissionLoading(false);
		}
	}, [permissionGroup, permissionKeyword, permissionPagination.perPage]);

	const fetchRoles = useCallback(async (page = 1) => {
		setRoleLoading(true);
		try {
			const params = {
				page,
				per_page: rolePagination.perPage,
			};

			if (roleKeyword.trim()) params.q = roleKeyword.trim();
			if (roleStatus) params.trang_thai = roleStatus;

			const response = await layDanhSachVaiTro(params);
			setRoleData(response.data);
			setRolePagination((prev) => ({
				...prev,
				page: response.meta.page,
				total: response.meta.total,
			}));
		} catch (error) {
			message.error(error?.response?.data?.message ?? 'Không tải được danh sách vai trò.');
		} finally {
			setRoleLoading(false);
		}
	}, [roleKeyword, rolePagination.perPage, roleStatus]);

	useEffect(() => {
		fetchRoles(1);
	}, [fetchRoles]);

	useEffect(() => {
		fetchPermissions(1);
	}, [fetchPermissions]);

	const openCreateRole = () => {
		setEditingRole(null);
		setPermissionSearchInDrawer('');
		roleForm.resetFields();
		roleForm.setFieldsValue({
			trang_thai: 'hoat_dong',
			quyen_ids: [],
		});
		setRoleDrawerOpen(true);
	};

	const openEditRole = (record) => {
		setEditingRole(record);
		setPermissionSearchInDrawer('');
		roleForm.resetFields();
		roleForm.setFieldsValue({
			ma_vai_tro: record.ma_vai_tro,
			ten_vai_tro: record.ten_vai_tro,
			mo_ta: record.mo_ta,
			trang_thai: record.trang_thai,
			quyen_ids: toRolePermissionIds(record),
		});
		setRoleDrawerOpen(true);
	};

	const closeRoleDrawer = () => {
		setRoleDrawerOpen(false);
		setEditingRole(null);
		setPermissionSearchInDrawer('');
		roleForm.resetFields();
	};

	const handleSaveRole = async () => {
		try {
			const values = await roleForm.validateFields();
			setRoleSaving(true);

			const payload = {
				ma_vai_tro: String(values.ma_vai_tro).trim().toUpperCase(),
				ten_vai_tro: String(values.ten_vai_tro).trim(),
				mo_ta: values.mo_ta?.trim() || null,
				trang_thai: values.trang_thai,
				quyen_ids: values.quyen_ids ?? [],
			};

			if (editingRole) {
				await capNhatVaiTro(editingRole.id, payload);
				message.success('Cập nhật vai trò thành công.');
			} else {
				await taoVaiTro(payload);
				message.success('Tạo vai trò mới thành công.');
			}

			closeRoleDrawer();
			fetchRoles(editingRole ? rolePagination.page : 1);
		} catch (error) {
			if (error?.errorFields) return;
			if (error?.response?.data?.errors) {
				const fieldErrors = Object.entries(error.response.data.errors).map(([name, errors]) => ({
					name,
					errors,
				}));
				roleForm.setFields(fieldErrors);
			} else {
				message.error(error?.response?.data?.message ?? 'Không thể lưu vai trò.');
			}
		} finally {
			setRoleSaving(false);
		}
	};

	const handleDeleteRole = (record) => {
		const usedCount = Number(record.so_tai_khoan || 0);
		if (usedCount > 0) {
			message.warning('Không thể xóa vai trò đang được gán cho tài khoản người dùng.');
			return;
		}

		Modal.confirm({
			title: 'Xóa vai trò',
			icon: <ExclamationCircleOutlined />,
			content: `Bạn có chắc muốn xóa vai trò ${record.ma_vai_tro}?`,
			okText: 'Xác nhận xóa',
			okButtonProps: { danger: true },
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await xoaVaiTro(record.id);
					message.success('Xóa vai trò thành công.');
					fetchRoles(1);
				} catch (error) {
					message.error(error?.response?.data?.message ?? 'Không thể xóa vai trò.');
				}
			},
		});
	};

	const openCreatePermission = () => {
		setEditingPermission(null);
		permissionForm.resetFields();
		permissionForm.setFieldsValue({ nhom_quyen: 'quan_ly' });
		setPermissionModalOpen(true);
	};

	const openEditPermission = (record) => {
		setEditingPermission(record);
		permissionForm.resetFields();
		permissionForm.setFieldsValue({
			ma_quyen: record.ma_quyen,
			ten_quyen: record.ten_quyen,
			mo_ta: record.mo_ta,
			nhom_quyen: record.nhom_quyen,
		});
		setPermissionModalOpen(true);
	};

	const closePermissionModal = () => {
		setPermissionModalOpen(false);
		setEditingPermission(null);
		permissionForm.resetFields();
	};

	const handleSavePermission = async () => {
		try {
			const values = await permissionForm.validateFields();
			setPermissionSaving(true);

			const payload = {
				ma_quyen: String(values.ma_quyen).trim().toUpperCase(),
				ten_quyen: String(values.ten_quyen).trim(),
				mo_ta: values.mo_ta?.trim() || null,
				nhom_quyen: values.nhom_quyen,
			};

			if (editingPermission) {
				await capNhatQuyen(editingPermission.id, payload);
				message.success('Cập nhật quyền thành công.');
			} else {
				await taoQuyen(payload);
				message.success('Tạo quyền thành công.');
			}

			closePermissionModal();
			fetchPermissions(editingPermission ? permissionPagination.page : 1);
		} catch (error) {
			if (error?.errorFields) return;
			if (error?.response?.data?.errors) {
				const fieldErrors = Object.entries(error.response.data.errors).map(([name, errors]) => ({
					name,
					errors,
				}));
				permissionForm.setFields(fieldErrors);
			} else {
				message.error(error?.response?.data?.message ?? 'Không thể lưu quyền.');
			}
		} finally {
			setPermissionSaving(false);
		}
	};

	const handleDeletePermission = (record) => {
		Modal.confirm({
			title: 'Xóa quyền',
			icon: <ExclamationCircleOutlined />,
			content: `Bạn có chắc muốn xóa quyền ${record.ma_quyen}?`,
			okText: 'Xác nhận xóa',
			okButtonProps: { danger: true },
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await xoaQuyen(record.id);
					message.success('Xóa quyền thành công.');
					fetchPermissions(1);
				} catch (error) {
					message.error(error?.response?.data?.message ?? 'Không thể xóa quyền.');
				}
			},
		});
	};

	const roleColumns = [
		{
			title: 'Mã vai trò',
			dataIndex: 'ma_vai_tro',
			key: 'ma_vai_tro',
			width: 140,
			render: (value) => <Text strong style={{ color: '#0F766E' }}>{value}</Text>,
		},
		{
			title: 'Tên vai trò',
			dataIndex: 'ten_vai_tro',
			key: 'ten_vai_tro',
			width: 220,
		},
		{
			title: 'Mô tả',
			dataIndex: 'mo_ta',
			key: 'mo_ta',
			ellipsis: true,
			render: (value) => value || <Text type="secondary">Chưa có mô tả</Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			width: 120,
			render: (value) => {
				const mapped = STATUS_LABEL_MAP[value] ?? { label: value, color: 'default' };
				return <Tag color={mapped.color}>{mapped.label}</Tag>;
			},
		},
		{
			title: 'Tài khoản dùng',
			dataIndex: 'so_tai_khoan',
			key: 'so_tai_khoan',
			width: 140,
			align: 'right',
			render: (value) => <Text strong>{Number(value || 0)}</Text>,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 130,
			fixed: 'right',
			render: (_, record) => {
				const isUsed = Number(record.so_tai_khoan || 0) > 0;
				return (
					<Space size="small">
						<Tooltip title="Sửa vai trò">
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={() => openEditRole(record)}
							/>
						</Tooltip>
						<Tooltip
							title={
								isUsed
									? 'Không thể xóa vì vai trò đang được gán cho tài khoản.'
									: 'Xóa vai trò'
							}
						>
							<Button
								type="text"
								danger
								icon={isUsed ? <LockOutlined /> : <DeleteOutlined />}
								disabled={isUsed}
								onClick={() => handleDeleteRole(record)}
							/>
						</Tooltip>
					</Space>
				);
			},
		},
	];

	const permissionColumns = [
		{
			title: 'Mã quyền',
			dataIndex: 'ma_quyen',
			key: 'ma_quyen',
			width: 180,
			render: (value) => <Text strong style={{ color: '#0F766E' }}>{value}</Text>,
		},
		{
			title: 'Tên quyền',
			dataIndex: 'ten_quyen',
			key: 'ten_quyen',
			width: 260,
		},
		{
			title: 'Nhóm quyền',
			dataIndex: 'nhom_quyen',
			key: 'nhom_quyen',
			width: 160,
			render: (value) => <Tag color="cyan">{normalizeGroupLabel(value)}</Tag>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'mo_ta',
			key: 'mo_ta',
			ellipsis: true,
			render: (value) => value || <Text type="secondary">Chưa có mô tả</Text>,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 110,
			fixed: 'right',
			render: (_, record) => (
				<Space size="small">
					<Tooltip title="Sửa quyền">
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => openEditPermission(record)}
						/>
					</Tooltip>
					<Tooltip title="Xóa quyền">
						<Button
							type="text"
							danger
							icon={<DeleteOutlined />}
							onClick={() => handleDeletePermission(record)}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-6">
				<div className="mx-auto w-full max-w-[1320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
					<div className="mb-4 flex flex-col gap-1 md:mb-6">
						<h1 className="text-2xl font-bold text-slate-900">Quản lý Vai trò và Phân quyền</h1>
						<p className="text-sm text-slate-500">
							Tạo, cập nhật, tìm kiếm vai trò và quyền theo đúng mô hình RBAC. Vai trò chỉ được xóa khi chưa gán cho bất kỳ tài khoản nào.
						</p>
					</div>

					<Tabs
						activeKey={activeTab}
						onChange={setActiveTab}
						items={[
							{
								key: 'roles',
								label: 'Vai trò',
								children: (
									<>
										<div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
											<Input
												allowClear
												placeholder="Tìm theo mã hoặc tên vai trò"
												prefix={<SearchOutlined className="text-slate-400" />}
												value={roleKeyword}
												onChange={(event) => setRoleKeyword(event.target.value)}
												onPressEnter={() => fetchRoles(1)}
												className="w-full lg:max-w-[320px]"
											/>
											<Select
												allowClear
												placeholder="Lọc trạng thái"
												value={roleStatus}
												options={STATUS_OPTIONS}
												onChange={setRoleStatus}
												className="w-full lg:max-w-[180px]"
											/>
											<div className="flex flex-wrap gap-2 lg:ml-auto">
												<Button onClick={() => fetchRoles(1)}>Tìm kiếm</Button>
												<Button
													type="primary"
													icon={<PlusOutlined />}
													onClick={openCreateRole}
												>
													Thêm vai trò mới
												</Button>
											</div>
										</div>

										<Table
											rowKey="id"
											columns={roleColumns}
											dataSource={roleData}
											loading={roleLoading}
											locale={{
												emptyText: <Empty description="Chưa có vai trò phù hợp điều kiện tìm kiếm." />,
											}}
											scroll={{ x: 1000 }}
											pagination={{
												current: rolePagination.page,
												pageSize: rolePagination.perPage,
												total: rolePagination.total,
												showSizeChanger: false,
												showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} vai trò`,
												onChange: (page) => fetchRoles(page),
											}}
										/>
									</>
								),
							},
							{
								key: 'permissions',
								label: 'Quyền',
								children: (
									<>
										<div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
											<Input
												allowClear
												placeholder="Tìm theo mã hoặc tên quyền"
												prefix={<SearchOutlined className="text-slate-400" />}
												value={permissionKeyword}
												onChange={(event) => setPermissionKeyword(event.target.value)}
												onPressEnter={() => fetchPermissions(1)}
												className="w-full lg:max-w-[320px]"
											/>
											<Select
												allowClear
												placeholder="Lọc nhóm quyền"
												value={permissionGroup}
												options={permissionGroupOptions}
												onChange={setPermissionGroup}
												className="w-full lg:max-w-[220px]"
											/>
											<div className="flex flex-wrap gap-2 lg:ml-auto">
												<Button onClick={() => fetchPermissions(1)}>Tìm kiếm</Button>
												<Button
													type="primary"
													icon={<PlusOutlined />}
													onClick={openCreatePermission}
												>
													Thêm quyền mới
												</Button>
											</div>
										</div>

										<Table
											rowKey="id"
											columns={permissionColumns}
											dataSource={permissionData}
											loading={permissionLoading}
											locale={{
												emptyText: <Empty description="Chưa có quyền phù hợp điều kiện tìm kiếm." />,
											}}
											scroll={{ x: 1000 }}
											pagination={{
												current: permissionPagination.page,
												pageSize: permissionPagination.perPage,
												total: permissionPagination.total,
												showSizeChanger: false,
												showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} quyền`,
												onChange: (page) => fetchPermissions(page),
											}}
										/>
									</>
								),
							},
						]}
					/>
				</div>

				<Drawer
					title={editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}
					open={roleDrawerOpen}
					style={{ width: 560, maxWidth: '100vw' }}
					onClose={closeRoleDrawer}
					destroyOnHidden
					forceRender
					extra={(
						<Space>
							<Button onClick={closeRoleDrawer}>Hủy</Button>
							<Button
								type="primary"
								loading={roleSaving}
								onClick={handleSaveRole}
							>
								{editingRole ? 'Lưu thay đổi' : 'Tạo vai trò'}
							</Button>
						</Space>
					)}
				>
					<Form form={roleForm} layout="vertical" requiredMark="optional">
						<Form.Item
							label="Mã vai trò"
							name="ma_vai_tro"
							rules={[
								{ required: true, message: 'Vui lòng nhập mã vai trò.' },
								{ max: 20, message: 'Mã vai trò tối đa 20 ký tự.' },
								{ pattern: /^[A-Z0-9_]+$/, message: 'Chỉ dùng chữ in hoa, số và dấu gạch dưới.' },
							]}
							normalize={(value) => String(value || '').toUpperCase().replace(/\s+/g, '')}
							// Bổ sung helper text rõ ràng và Khóa ô input nếu đang ở chế độ Edit
							extra={editingRole ? "Mã vai trò không được phép thay đổi sau khi tạo." : "Sử dụng chữ in hoa, không dấu và gạch dưới (VD: QUAN_LY_KHOA)"}
						>
							<Input placeholder="VD: DIEUDUONG" disabled={!!editingRole} />
						</Form.Item>

						<Form.Item
							label="Tên vai trò"
							name="ten_vai_tro"
							rules={[
								{ required: true, message: 'Vui lòng nhập tên vai trò.' },
								{ max: 100, message: 'Tên vai trò tối đa 100 ký tự.' },
							]}
							extra="Tên hiển thị thân thiện với người dùng (VD: Điều dưỡng)."
						>
							<Input placeholder="VD: Điều dưỡng" />
						</Form.Item>

						<Form.Item
							label="Mô tả"
							name="mo_ta"
							rules={[{ max: 500, message: 'Mô tả tối đa 500 ký tự.' }]}
						>
							<Input.TextArea rows={3} placeholder="Nhập mô tả ngắn về phạm vi quyền của vai trò." />
						</Form.Item>

						<Form.Item
							label="Trạng thái"
							name="trang_thai"
							rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
						>
							<Select options={STATUS_OPTIONS} />
						</Form.Item>

						<Divider className="!my-4" />

						<Form.Item
							label="Phân quyền"
							name="quyen_ids"
							tooltip="Có thể chọn nhiều quyền cho một vai trò."
						>
							<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<Input
									allowClear
									value={permissionSearchInDrawer}
									onChange={(event) => setPermissionSearchInDrawer(event.target.value)}
									placeholder="Tìm nhanh quyền trong danh sách"
									prefix={<SearchOutlined className="text-slate-400" />}
									className="mb-3"
								/>

								{groupedPermissionsForDrawer.length === 0 ? (
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có quyền phù hợp." />
								) : (
									<div className="max-h-[360px] overflow-y-auto pr-1">
										{groupedPermissionsForDrawer.map((groupItem) => (
											<div key={groupItem.group} className="mb-4 last:mb-0">
												<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
													{groupItem.group}
												</p>
												<Form.Item noStyle shouldUpdate>
													{({ getFieldValue, setFieldValue }) => {
														const selected = getFieldValue('quyen_ids') ?? [];
														const groupIds = groupItem.items.map((permission) => permission.id);
														const checkedCount = groupIds.filter((id) => selected.includes(id)).length;
														const allChecked = checkedCount > 0 && checkedCount === groupIds.length;
														const indeterminate = checkedCount > 0 && checkedCount < groupIds.length;

														return (
															<>
																<div className="mb-2">
																	<Checkbox
																		checked={allChecked}
																		indeterminate={indeterminate}
																		onChange={(event) => {
																			const checked = event.target.checked;
																			const next = checked
																				? Array.from(new Set([...selected, ...groupIds]))
																				: selected.filter((id) => !groupIds.includes(id));
																			setFieldValue('quyen_ids', next);
																		}}
																	>
																		Chọn toàn bộ nhóm {groupItem.group}
																	</Checkbox>
																</div>
																<div className="grid grid-cols-1 gap-2">
																	{groupItem.items.map((permission) => (
																		<Checkbox
																			key={permission.id}
																			checked={selected.includes(permission.id)}
																			onChange={(event) => {
																				const next = event.target.checked
																					? Array.from(new Set([...selected, permission.id]))
																					: selected.filter((id) => id !== permission.id);
																				setFieldValue('quyen_ids', next);
																			}}
																		>
																			<span className="font-medium text-slate-800">
																				{permission.ten_quyen}
																			</span>
																			<span className="ml-2 text-xs text-slate-500">
																				({permission.ma_quyen})
																			</span>
																		</Checkbox>
																	))}
																</div>
															</>
														);
													}}
												</Form.Item>
											</div>
										))}
									</div>
								)}
							</div>
						</Form.Item>
					</Form>
				</Drawer>

				<Modal
					title={editingPermission ? 'Cập nhật quyền' : 'Thêm quyền mới'}
					open={permissionModalOpen}
					onCancel={closePermissionModal}
					onOk={handleSavePermission}
					okText={editingPermission ? 'Lưu thay đổi' : 'Tạo quyền'}
					cancelText="Hủy"
					okButtonProps={{ loading: permissionSaving }}
					destroyOnHidden
					forceRender
				>
					<Form form={permissionForm} layout="vertical" requiredMark="optional">
						<Form.Item
							label="Mã quyền"
							name="ma_quyen"
							rules={[
								{ required: true, message: 'Vui lòng nhập mã quyền.' },
								{ max: 50, message: 'Mã quyền tối đa 50 ký tự.' },
								{ pattern: /^[A-Z0-9_]+$/, message: 'Chỉ dùng chữ in hoa, số và dấu gạch dưới.' },
							]}
							normalize={(value) => String(value || '').toUpperCase().replace(/\s+/g, '')}
							extra={editingPermission ? "Mã quyền không được phép thay đổi sau khi tạo." : "Sử dụng chữ in hoa (VD: QUAN_LY_BAO_CAO)"}
						>
							<Input placeholder="VD: QUAN_LY_BAO_CAO" disabled={!!editingPermission} />
						</Form.Item>

						<Form.Item
							label="Tên quyền"
							name="ten_quyen"
							rules={[
								{ required: true, message: 'Vui lòng nhập tên quyền.' },
								{ max: 100, message: 'Tên quyền tối đa 100 ký tự.' },
							]}
						>
							<Input placeholder="VD: Quản lý báo cáo" />
						</Form.Item>

						<Form.Item
							label="Nhóm quyền"
							name="nhom_quyen"
							rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền.' }]}
						>
							<Select
								options={[
									{ value: 'quan_ly', label: 'Quản lý' },
									{ value: 'nghiep_vu', label: 'Nghiệp vụ' },
									{ value: 'bao_cao', label: 'Báo cáo' },
									{ value: 'he_thong', label: 'Hệ thống' },
									{ value: 'khac', label: 'Khác' },
								]}
							/>
						</Form.Item>

						<Form.Item
							label="Mô tả"
							name="mo_ta"
							rules={[{ max: 500, message: 'Mô tả tối đa 500 ký tự.' }]}
						>
							<Input.TextArea rows={3} placeholder="Nhập mô tả quyền" />
						</Form.Item>
					</Form>
				</Modal>
			</div>
	);
}