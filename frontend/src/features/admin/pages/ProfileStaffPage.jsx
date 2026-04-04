import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Avatar,
	Button,
	DatePicker,
	Drawer,
	Form,
	Input,
	Modal,
	Select,
	Table,
	Tag,
	Tooltip,
	Upload,
	message,
} from 'antd';
import {
	CameraOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	PlusOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { taiAnhDaiDienCloudinary } from '../../../Services/admin/cloudinaryService';
import {
	capNhatNhanVien,
	layDanhSachNhanVien,
	// layDanhSachTaiKhoanNhanVien,
	layDanhSachTaiKhoanNhanVienChuaLienKet,
	taoNhanVien,
	xoaNhanVien,
} from '../../../Services/admin/staffServices';

const STAFF_STATUS_OPTIONS = [
	{ value: 'hoat_dong', label: 'Hoạt động' },
	{ value: 'tam_khoa', label: 'Tạm khóa' },
	{ value: 'nghi_viec', label: 'Nghỉ việc' },
];

const CHUC_VU_OPTIONS = [
	{ value: 'le_tan', label: 'Lễ tân' },
	{ value: 'nhan_vien_y_te', label: 'NV y tế' },
	{ value: 'dieu_duong', label: 'Điều dưỡng' },
];

const ACCOUNT_STATUS_STYLE_MAP = {
	hoat_dong: { label: 'Hoạt động', color: 'green' },
	tam_khoa: { label: 'Tạm khóa', color: 'orange' },
	khoa: { label: 'Khóa', color: 'red' },
};

const CHUC_VU_STYLE = {
	le_tan: 'text-amber-600',
	nhan_vien_y_te: 'text-violet-600',
	dieu_duong: 'text-blue-600',
};

const STATUS_STYLE = {
	hoat_dong: { label: 'Hoạt động', color: 'success' },
	tam_khoa: { label: 'Tạm khóa', color: 'warning' },
	nghi_viec: { label: 'Nghỉ việc', color: 'default' },
};

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

const isValidImageFile = (file) => {
	const mimeType = String(file?.type || '').toLowerCase();
	if (mimeType.startsWith('image/')) {
		return true;
	}

	const fileName = String(file?.name || '');
	const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
	return IMAGE_EXTENSIONS.includes(ext);
};

const getLabel = (options, value) => options.find((item) => item.value === value)?.label || value;

const getInitials = (fullName) => {
	if (!fullName) return 'NV';
	const words = fullName.trim().split(' ').filter(Boolean);
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const formatDate = (value) => {
	if (!value) return '';
	const parsed = dayjs(value);
	return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value;
};

export default function ProfileStaffPage() {
	const [form] = Form.useForm();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState('');
	const [avatarAsset, setAvatarAsset] = useState(null);
	const [editingStaff, setEditingStaff] = useState(null);
	const [staffList, setStaffList] = useState([]);
	const [staffAccountList, setStaffAccountList] = useState([]);
	const [isLoadingStaffAccounts, setIsLoadingStaffAccounts] = useState(false);
	const [selectedExistingAccountId, setSelectedExistingAccountId] = useState(null);
	const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

	const [keyword, setKeyword] = useState('');
	const [debouncedKeyword, setDebouncedKeyword] = useState('');
	const [selectedPosition, setSelectedPosition] = useState();
	const [selectedStatus, setSelectedStatus] = useState();

	const staffAccountSelectOptions = useMemo(
		() =>
			staffAccountList.map((account) => ({
				value: account.id,
				label: account.email,
				disabled: false,
			})),
		[staffAccountList]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(keyword.trim());
		}, 350);

		return () => clearTimeout(timer);
	}, [keyword]);

	const fetchStaffList = useCallback(
		async (page = 1, pageSize = pagination.pageSize) => {
			setIsLoading(true);
			try {
				const params = {
					page,
					per_page: pageSize,
				};

				if (debouncedKeyword) {
					params.q = debouncedKeyword;
				}
				if (selectedPosition) {
					params.chuc_vu = selectedPosition;
				}
				if (selectedStatus) {
					params.trang_thai = selectedStatus;
				}

				const response = await layDanhSachNhanVien(params);
				const sortedStaff = [...response.data].sort((a, b) => Number(a.id) - Number(b.id));
				setStaffList(sortedStaff);
				setPagination({
					current: response.meta.page,
					pageSize: response.meta.perPage,
					total: response.meta.total,
				});
			} catch {
				message.error('Không thể tải danh sách nhân viên.');
			} finally {
				setIsLoading(false);
			}
		},
		[debouncedKeyword, pagination.pageSize, selectedPosition, selectedStatus]
	);

	useEffect(() => {
		fetchStaffList(1, pagination.pageSize);
	}, [fetchStaffList, pagination.pageSize]);

	const fetchStaffAccounts = useCallback(async () => {
		setIsLoadingStaffAccounts(true);
		try {
			const res = await layDanhSachTaiKhoanNhanVienChuaLienKet({
				vai_tro: 'NHANVIEN',
			});

			if (!res.data.length) {
				message.info('Không còn tài khoản nào chưa liên kết.');
			}

			setStaffAccountList(res.data); // depends on your API shape
		} catch {
			message.error('Không thể tải danh sách tài khoản chưa liên kết.');
		} finally {
			setIsLoadingStaffAccounts(false);
		}
	}, []);

	const openCreateDrawer = () => {
		setEditingStaff(null);
		setSelectedExistingAccountId(null);
		setAvatarPreview('');
		setAvatarAsset(null);
		setPendingAvatarFile(null);
		form.resetFields();
		form.setFieldsValue({
			trang_thai: 'hoat_dong',
		});
		fetchStaffAccounts();
		setIsDrawerOpen(true);
	};

	const openEditDrawer = (staff) => {
		setEditingStaff(staff);
		form.resetFields();
		form.setFieldsValue({
			ho_ten: staff.ho_ten,
			so_dien_thoai: staff.so_dien_thoai,
			chuc_vu: staff.chuc_vu,
			ngay_vao_lam: staff.ngay_vao_lam ? dayjs(staff.ngay_vao_lam) : null,
			trang_thai: staff.trang_thai,
			ghi_chu: staff.ghi_chu,
		});
		setAvatarPreview(staff.hinh_anh || '');
		setAvatarAsset(staff.hinh_anh ? { url: staff.hinh_anh, public_id: null } : null);
		setPendingAvatarFile(null);
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setEditingStaff(null);
		setSelectedExistingAccountId(null);
		setAvatarAsset(null);
		setPendingAvatarFile(null);
		setIsSubmitting(false);
	};

	const getAvatarUploadTargetUserId = () => {
		if (editingStaff?.nguoi_dung_id) return editingStaff.nguoi_dung_id;
		if (selectedExistingAccountId) return selectedExistingAccountId;
		return null;
	};

	const uploadAvatarForUser = useCallback(
		async (targetUserId, rawFile, { successMessage } = {}) => {
			setIsUploadingAvatar(true);
			try {
				const uploaded = await taiAnhDaiDienCloudinary(targetUserId, rawFile);
				setAvatarAsset(uploaded);
				setAvatarPreview(uploaded.url || '');
				setPendingAvatarFile(null);
				if (successMessage) {
					message.success(successMessage);
				}
			} catch (error) {
				message.error(error?.response?.data?.message || 'Không thể tải ảnh đại diện lên Cloudinary.');
			} finally {
				setIsUploadingAvatar(false);
			}
		},
		[]
	);

	const handleSelectExistingAccount = useCallback(
		(accountId) => {
			setSelectedExistingAccountId(accountId);

			if (!accountId) {
				if (!pendingAvatarFile) {
					setAvatarPreview('');
					setAvatarAsset(null);
				}
				return;
			}

			if (!pendingAvatarFile) {
				const selectedAccount = staffAccountList.find((account) => account.id === accountId);
				setAvatarPreview(selectedAccount?.hinh_anh || '');
				setAvatarAsset(selectedAccount?.hinh_anh ? { url: selectedAccount.hinh_anh, public_id: null } : null);
			}
		},
		[pendingAvatarFile, staffAccountList]
	);

	useEffect(() => {
		if (!selectedExistingAccountId || !pendingAvatarFile || isUploadingAvatar) {
			return;
		}

		uploadAvatarForUser(selectedExistingAccountId, pendingAvatarFile, {
			successMessage: 'Đã tải ảnh đại diện lên cho tài khoản đã chọn.',
		});
	}, [isUploadingAvatar, pendingAvatarFile, selectedExistingAccountId, uploadAvatarForUser]);

	const handleUploadAvatar = async (rawFile) => {
		if (!rawFile) return;

		if (!isValidImageFile(rawFile)) {
			message.error('Tệp tải lên phải là hình ảnh hợp lệ.');
			return;
		}

		setAvatarPreview(URL.createObjectURL(rawFile));
		setPendingAvatarFile(rawFile);
		setAvatarAsset(null);

		const targetUserId = getAvatarUploadTargetUserId();
		if (!targetUserId) {
			message.info('Ảnh đã được chọn. Hãy chọn tài khoản nhân viên để hệ thống tải ảnh lên.');
			return;
		}

		await uploadAvatarForUser(targetUserId, rawFile, {
			successMessage: 'Tải ảnh đại diện thành công.',
		});
	};

	const handleSaveStaff = async () => {
		try {
			const values = await form.validateFields();

			if (isUploadingAvatar) {
				message.warning('Ảnh đại diện đang được tải lên. Vui lòng chờ trong giây lát.');
				return;
			}

			if (!editingStaff && !selectedExistingAccountId) {
				message.warning('Vui lòng chọn tài khoản nhân viên chưa có hồ sơ trước khi lưu.');
				return;
			}

			setIsSubmitting(true);

			const payload = {
				ho_ten: values.ho_ten,
				so_dien_thoai: values.so_dien_thoai,
				chuc_vu: values.chuc_vu,
				ngay_vao_lam: values.ngay_vao_lam?.format('YYYY-MM-DD'),
				trang_thai: values.trang_thai,
				ghi_chu: values.ghi_chu,
			};

			if (avatarAsset?.url) {
				payload.hinh_anh = avatarAsset.url;
			}

			if (editingStaff) {
				await capNhatNhanVien(editingStaff.id, payload);
				message.success(`Đã cập nhật hồ sơ nhân viên ${values.ho_ten}`);
				await fetchStaffList(pagination.current, pagination.pageSize);
			} else {
				await taoNhanVien({
					...payload,
					nguoi_dung_id: selectedExistingAccountId,
				});
				message.success(`Đã tạo hồ sơ nhân viên ${values.ho_ten}`);
				await fetchStaffList(1, pagination.pageSize);
				await fetchStaffAccounts();
			}

			closeDrawer();
			form.resetFields();
			setAvatarPreview('');
			setAvatarAsset(null);
			setPendingAvatarFile(null);
		} catch (err) {
			if (err?.response?.data?.errors) {
				const fieldErrors = Object.entries(err.response.data.errors).map(([name, msgs]) => ({
					name,
					errors: msgs,
				}));
				form.setFields(fieldErrors);
			} else if (!err?.errorFields) {
				message.error(err?.response?.data?.message || 'Không thể lưu hồ sơ nhân viên.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteStaff = (staff) => {
		Modal.confirm({
			title: 'Xóa hồ sơ nhân viên',
			content: `Bạn có chắc chắn muốn xóa hồ sơ nhân viên ${staff.ho_ten}?`,
			okText: 'Xóa',
			okButtonProps: { danger: true },
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await xoaNhanVien(staff.id);
					message.success('Đã xóa hồ sơ nhân viên.');
					await fetchStaffList(pagination.current, pagination.pageSize);
					await fetchStaffAccounts();
				} catch (err) {
					message.error(err?.response?.data?.message || 'Không thể xóa hồ sơ nhân viên.');
				}
			},
		});
	};

	const columns = [
		{
			title: 'MÃ NV',
			dataIndex: 'ma_nhan_vien',
			key: 'ma_nhan_vien',
			width: 88,
			render: (value) => <span className="text-xs font-semibold text-slate-500">{value}</span>,
		},
		{
			title: 'HỌ TÊN',
			dataIndex: 'ho_ten',
			key: 'ho_ten',
			width: 220,
			render: (_, record) => (
				<div className="flex items-center gap-3">
					<Avatar
						size={30}
						src={record.hinh_anh}
						icon={<UserOutlined />}
						className="bg-slate-200 text-slate-600 text-xs font-semibold"
					>
						{getInitials(record.ho_ten)}
					</Avatar>
					<div>
						<p className="mb-0 text-sm font-semibold text-slate-700 leading-5">{record.ho_ten}</p>
						<p className="mb-0 text-xs text-slate-400">{record.email}</p>
					</div>
				</div>
			),
		},
		{
			title: 'CHỨC VỤ',
			dataIndex: 'chuc_vu',
			key: 'chuc_vu',
			width: 140,
			render: (value) => (
				<span className={`text-sm font-semibold ${CHUC_VU_STYLE[value] || 'text-slate-600'}`}>
					{getLabel(CHUC_VU_OPTIONS, value)}
				</span>
			),
		},
		{
			title: 'SỐ ĐIỆN THOẠI',
			dataIndex: 'so_dien_thoai',
			key: 'so_dien_thoai',
			width: 130,
			render: (value) => <span className="text-sm text-slate-600">{value}</span>,
		},
		{
			title: 'NGÀY VÀO LÀM',
			dataIndex: 'ngay_vao_lam',
			key: 'ngay_vao_lam',
			width: 120,
			render: (value) => <span className="text-sm text-slate-600">{formatDate(value)}</span>,
		},
		{
			title: 'TRẠNG THÁI',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			width: 120,
			render: (value) => {
				const status = STATUS_STYLE[value] || STATUS_STYLE.nghi_viec;
				return <Tag color={status.color}>{status.label}</Tag>;
			},
		},
		{
			title: 'THAO TÁC',
			key: 'actions',
			width: 100,
			align: 'center',
			render: (_, record) => (
				<div className="flex items-center justify-center gap-1">
					<Tooltip title="Sửa">
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => openEditDrawer(record)}
							className="text-slate-500 hover:text-teal-700"
						/>
					</Tooltip>
					<Tooltip title="Xóa">
						<Button
							type="text"
							icon={<DeleteOutlined />}
							onClick={() => handleDeleteStaff(record)}
							className="text-slate-400 hover:text-rose-600"
						/>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<div className="min-h-screen bg-slate-100 p-4 md:p-6">
			<div className="mx-auto w-full max-w-350 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="mb-1 text-[28px] font-bold leading-9 text-slate-800">Quản lý nhân viên</h1>
						<p className="mb-0 text-sm text-slate-500">
							Quản lý hồ sơ và phân quyền đội ngũ nhân sự.
						</p>
					</div>

					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={openCreateDrawer}
						className="h-10 w-full rounded-full border-0 bg-teal-700 px-5 font-semibold hover:!bg-teal-800 sm:w-auto"
					>
						Thêm nhân viên mới
					</Button>
				</div>

				<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
					<div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_180px_160px] md:gap-3">
						<Input
							placeholder="Tên, mã nhân viên, SĐT hoặc email..."
							prefix={<SearchOutlined className="text-slate-400" />}
							allowClear
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
						/>
						<Select
							placeholder="Tất cả chức vụ"
							allowClear
							options={CHUC_VU_OPTIONS}
							value={selectedPosition}
							onChange={setSelectedPosition}
						/>
						<div className="flex items-center gap-2">
							<Select
								placeholder="Tất cả trạng thái"
								allowClear
								options={STAFF_STATUS_OPTIONS}
								value={selectedStatus}
								onChange={setSelectedStatus}
								className="flex-1"
							/>
							<Tooltip title="Làm mới bộ lọc">
								<Button
									icon={<FilterOutlined />}
									onClick={() => {
										setKeyword('');
										setSelectedPosition(undefined);
										setSelectedStatus(undefined);
									}}
								/>
							</Tooltip>
						</div>
					</div>
				</div>

				<div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
					<Table
						columns={columns}
						dataSource={staffList}
						loading={isLoading}
						rowKey="id"
						pagination={{
							current: pagination.current,
							pageSize: pagination.pageSize,
							total: pagination.total,
							showSizeChanger: true,
							pageSizeOptions: [5, 10, 20, 50],
							onChange: (page, pageSize) => fetchStaffList(page, pageSize),
							showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} nhân viên`,
						}}
						scroll={{ x: 1120 }}
					/>
				</div>
			</div>

			<Drawer
				title={
					<span className="text-lg font-bold text-slate-800">
						{editingStaff ? 'Cập nhật hồ sơ nhân viên' : 'Thêm nhân viên mới'}
					</span>
				}
				open={isDrawerOpen}
				onClose={closeDrawer}
				style={{ width: 420, maxWidth: '100vw' }}
				destroyOnHidden
				forceRender
			>
				<Form
					form={form}
					layout="vertical"
					requiredMark={false}
					initialValues={{
						trang_thai: 'hoat_dong',
					}}
				>
					<div className="mb-5 flex justify-center">
						<Upload
							showUploadList={false}
							beforeUpload={(file) => {
								handleUploadAvatar(file);
								return Upload.LIST_IGNORE;
							}}
							disabled={isUploadingAvatar}
							accept="image/*"
						>
							<div className="group cursor-pointer text-center">
								<div className="relative mx-auto h-24 w-24">
									<Avatar
										size={96}
										src={avatarPreview}
										icon={!avatarPreview && <UserOutlined />}
										className="border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500"
									/>
									<div className="absolute -bottom-1 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
										<CameraOutlined className="text-xs" />
									</div>
								</div>
								<p className="mt-2 mb-0 text-xs text-slate-400">
									{isUploadingAvatar ? 'Đang tải ảnh lên...' : 'Tải ảnh đại diện nhân viên (JPG, PNG)'}
								</p>
							</div>
						</Upload>
					</div>

					{!editingStaff && (
						<>
							<Form.Item label="Chọn tài khoản nhân viên chưa có hồ sơ">
								<Select
									showSearch
									allowClear
									loading={isLoadingStaffAccounts}
									options={staffAccountSelectOptions}
									value={selectedExistingAccountId}
									onChange={handleSelectExistingAccount}
									placeholder="Chọn tài khoản nhân viên"
									optionFilterProp="label"
								/>
							</Form.Item>

							<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
								<p className="mb-2 text-xs font-semibold text-slate-500">Danh sách tài khoản nhân viên</p>
								<div className="max-h-32 space-y-1 overflow-y-auto">
									{staffAccountList.map((account) => {
										const accountStatus = ACCOUNT_STATUS_STYLE_MAP[account.trang_thai] || ACCOUNT_STATUS_STYLE_MAP.hoat_dong;
										return (
											<div
												key={account.id}
												className={`flex items-center justify-between rounded-lg border px-2 py-1 text-xs cursor-pointer`}
											>
												<div className="flex items-center gap-2">
													<Avatar size={24} src={account.hinh_anh} icon={!account.hinh_anh && <UserOutlined />} className="bg-slate-200 text-slate-500" />
													<span className="text-slate-700">{account.email}</span>
												</div>
												<div className="flex items-center gap-1">
													<Tag color={accountStatus.color} className="m-0 text-[10px]">
														{accountStatus.label}
													</Tag>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{!selectedExistingAccountId && (
								<div className="mb-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
									Vui lòng chọn tài khoản nhân viên chưa có hồ sơ để nhập thông tin nhân viên.
								</div>
							)}
						</>
					)}

					<Form.Item
						label="Họ tên"
						name="ho_ten"
						rules={[{ required: true, message: 'Vui lòng nhập họ tên.' }]}
					>
						<Input placeholder="Nhập họ và tên" />
					</Form.Item>

					<Form.Item
						label="Số điện thoại"
						name="so_dien_thoai"
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại.' },
							{ pattern: /^0\d{9,10}$/, message: 'Số điện thoại phải gồm 10-11 chữ số và bắt đầu bằng số 0.' },
						]}
					>
						<Input placeholder="0xxx" />
					</Form.Item>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<Form.Item
							label="Chức vụ"
							name="chuc_vu"
							rules={[{ required: true, message: 'Vui lòng chọn chức vụ.' }]}
						>
							<Select options={CHUC_VU_OPTIONS} placeholder="Chọn chức vụ" />
						</Form.Item>

						<Form.Item
							label="Trạng thái"
							name="trang_thai"
							rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
						>
							<Select options={STAFF_STATUS_OPTIONS} />
						</Form.Item>
					</div>

					<Form.Item
						label="Ngày vào làm"
						name="ngay_vao_lam"
						rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm.' }]}
					>
						<DatePicker className="w-full" format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
					</Form.Item>

					<Form.Item label="Ghi chú" name="ghi_chu">
						<Input.TextArea rows={4} placeholder="Ghi chú thêm về nhân sự..." maxLength={250} />
					</Form.Item>
				</Form>

				<div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
					<Button onClick={closeDrawer} className="w-full sm:w-auto">Hủy</Button>
					<Button
						type="primary"
						loading={isSubmitting}
						onClick={handleSaveStaff}
						className="w-full border-0 bg-teal-700 px-5 font-semibold hover:!bg-teal-800 sm:w-auto"
					>
						{editingStaff ? 'Cập nhật nhân viên' : 'Lưu thông tin'}
					</Button>
				</div>
			</Drawer>
		</div>
	);
}
