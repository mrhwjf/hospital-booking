import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Avatar,
	Button,
	Drawer,
	Form,
	Input,
	InputNumber,
	Modal,
	Select,
	Tag,
	Table,
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
import {
	capNhatBacSi,
	layDanhMucChuyenKhoa,
	layDanhSachBacSi,
	layDanhSachTaiKhoanBacSi,
	taoBacSi,
	xoaBacSi,
} from '../../../services/admin/doctorServices';
import { taiAnhDaiDienCloudinary } from '../../../services/admin/cloudinaryService';

const DOCTOR_STATUS_OPTIONS = [
	{ value: 'hoat_dong', label: 'Hoạt động' },
	{ value: 'tam_nghi', label: 'Tạm nghỉ' },
	{ value: 'nghi_viec', label: 'Nghỉ việc' },
];

const HOC_VI_OPTIONS = [
	{ value: 'bac_si', label: 'BS' },
	{ value: 'thac_si', label: 'Thạc sĩ' },
	{ value: 'tien_si', label: 'Tiến sĩ' },
	{ value: 'pgs', label: 'PGS' },
	{ value: 'gs', label: 'GS' },
];

const STATUS_STYLE_MAP = {
	hoat_dong: { label: 'Hoạt động', color: 'success', dot: 'bg-emerald-500' },
	tam_nghi: { label: 'Tạm nghỉ', color: 'warning', dot: 'bg-amber-500' },
	nghi_viec: { label: 'Nghỉ việc', color: 'default', dot: 'bg-slate-400' },
};

const ACCOUNT_STATUS_STYLE_MAP = {
	hoat_dong: { label: 'Hoạt động', color: 'green' },
	tam_khoa: { label: 'Tạm khóa', color: 'orange' },
	khoa: { label: 'Khóa', color: 'red' },
};

const CREATE_MODE_OPTIONS = [
	{ value: 'tai_khoan_co_san', label: 'Dùng tài khoản bác sĩ đã có' },
	{ value: 'tao_moi_tai_khoan', label: 'Tạo mới tài khoản + hồ sơ bác sĩ' },
];

const getHocViLabel = (value) => HOC_VI_OPTIONS.find((item) => item.value === value)?.label || value;

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

export default function ProfileDoctorPage() {
	const [form] = Form.useForm();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState('');
	const [avatarAsset, setAvatarAsset] = useState(null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [editingDoctor, setEditingDoctor] = useState(null);
	const [doctorList, setDoctorList] = useState([]);
	const [doctorAccountList, setDoctorAccountList] = useState([]);
	const [isLoadingDoctorAccounts, setIsLoadingDoctorAccounts] = useState(false);
	const [createMode, setCreateMode] = useState('tai_khoan_co_san');
	const [selectedExistingAccountId, setSelectedExistingAccountId] = useState(null);
	const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
	const [chuyenKhoaOptions, setChuyenKhoaOptions] = useState([]);

	const [keyword, setKeyword] = useState('');
	const [debouncedKeyword, setDebouncedKeyword] = useState('');
	const [selectedChuyenKhoa, setSelectedChuyenKhoa] = useState();
	const [selectedHocVi, setSelectedHocVi] = useState();
	const [selectedTrangThai, setSelectedTrangThai] = useState();

	const specialtySelectOptions = useMemo(
		() =>
			chuyenKhoaOptions.map((item) => ({
				value: item.id,
				label: item.ten_chuyen_khoa,
			})),
		[chuyenKhoaOptions]
	);

	const doctorAccountSelectOptions = useMemo(
		() =>
			doctorAccountList.map((account) => ({
				value: account.id,
				label: `${account.email}${account.co_ho_so_bac_si ? ' • đã có hồ sơ' : ''}`,
				disabled: account.co_ho_so_bac_si,
			})),
		[doctorAccountList]
	);

	const shouldShowProfileForm =
		!!editingDoctor || createMode === 'tao_moi_tai_khoan' || !!selectedExistingAccountId;

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(keyword.trim());
		}, 350);

		return () => clearTimeout(timer);
	}, [keyword]);

	const fetchDoctorList = useCallback(
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
				if (selectedChuyenKhoa) {
					params.chuyen_khoa_id = selectedChuyenKhoa;
				}
				if (selectedHocVi) {
					params.hoc_vi = selectedHocVi;
				}
				if (selectedTrangThai) {
					params.trang_thai = selectedTrangThai;
				}

				const response = await layDanhSachBacSi(params);
				const sortedDoctors = [...response.data].sort((a, b) => Number(a.id) - Number(b.id));
				setDoctorList(sortedDoctors);
				setPagination({
					current: response.meta.page,
					pageSize: response.meta.perPage,
					total: response.meta.total,
				});
			} catch {
				message.error('Không thể tải danh sách bác sĩ.');
			} finally {
				setIsLoading(false);
			}
		},
		[debouncedKeyword, pagination.pageSize, selectedChuyenKhoa, selectedHocVi, selectedTrangThai]
	);

	useEffect(() => {
		fetchDoctorList(1, pagination.pageSize);
	}, [fetchDoctorList, pagination.pageSize]);

	useEffect(() => {
		const fetchSpecialties = async () => {
			try {
				const items = await layDanhMucChuyenKhoa({ per_page: 100, trang_thai: 'hoat_dong' });
				setChuyenKhoaOptions(items);
			} catch {
				message.error('Không thể tải danh mục chuyên khoa.');
			}
		};

		fetchSpecialties();
	}, []);

	const fetchDoctorAccounts = useCallback(async () => {
		setIsLoadingDoctorAccounts(true);
		try {
			const items = await layDanhSachTaiKhoanBacSi();
			setDoctorAccountList(items);
		} catch {
			message.error('Không thể tải danh sách tài khoản bác sĩ.');
		} finally {
			setIsLoadingDoctorAccounts(false);
		}
	}, []);

	const openCreateDrawer = () => {
		setEditingDoctor(null);
		setCreateMode('tai_khoan_co_san');
		setSelectedExistingAccountId(null);
		form.resetFields();
		form.setFieldsValue({
			hoc_vi: 'bac_si',
			trang_thai: 'hoat_dong',
			chuyen_khoa: [],
			kinh_nghiem: 0,
		});
		fetchDoctorAccounts();
		setAvatarPreview('');
		setAvatarAsset(null);
		setPendingAvatarFile(null);
		setIsDrawerOpen(true);
	};

	const openEditDrawer = (doctor) => {
		setEditingDoctor(doctor);
		form.resetFields();
		form.setFieldsValue({
			ho_ten: doctor.ho_ten,
			email: doctor.email,
			so_dien_thoai: doctor.so_dien_thoai,
			chuyen_khoa: doctor.chuyen_khoa_ids,
			hoc_vi: doctor.hoc_vi,
			so_chung_chi: doctor.chung_chi_hanh_nghe,
			kinh_nghiem: doctor.kinh_nghiem ?? 0,
			gioi_thieu: doctor.gioi_thieu,
			trang_thai: doctor.trang_thai,
		});
		setAvatarPreview(doctor.hinh_anh || '');
		setAvatarAsset(doctor.hinh_anh ? { url: doctor.hinh_anh, public_id: null } : null);
		setPendingAvatarFile(null);
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setEditingDoctor(null);
		setCreateMode('tai_khoan_co_san');
		setSelectedExistingAccountId(null);
		setAvatarAsset(null);
		setPendingAvatarFile(null);
		setIsSubmitting(false);
	};

	const getAvatarUploadTargetUserId = () => {
		if (editingDoctor?.nguoi_dung_id) return editingDoctor.nguoi_dung_id;
		if (createMode === 'tai_khoan_co_san' && selectedExistingAccountId) return selectedExistingAccountId;
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
		async (accountId) => {
			setSelectedExistingAccountId(accountId);

			if (!accountId) {
				if (!pendingAvatarFile) {
					setAvatarPreview('');
					setAvatarAsset(null);
				}
				return;
			}

			if (!pendingAvatarFile) {
				const selectedAccount = doctorAccountList.find((account) => account.id === accountId);
				setAvatarPreview(selectedAccount?.hinh_anh || '');
				setAvatarAsset(selectedAccount?.hinh_anh ? { url: selectedAccount.hinh_anh, public_id: null } : null);
			}

			if (!accountId || !pendingAvatarFile) return;

			await uploadAvatarForUser(accountId, pendingAvatarFile, {
				successMessage: 'Đã tải ảnh đại diện lên cho tài khoản đã chọn.',
			});
		},
		[doctorAccountList, pendingAvatarFile, uploadAvatarForUser]
	);

	useEffect(() => {
		if (!selectedExistingAccountId || !pendingAvatarFile || isUploadingAvatar) {
			return;
		}

		uploadAvatarForUser(selectedExistingAccountId, pendingAvatarFile, {
			successMessage: 'Đã tải ảnh đại diện lên cho tài khoản đã chọn.',
		});
	}, [isUploadingAvatar, pendingAvatarFile, selectedExistingAccountId, uploadAvatarForUser]);

	const handleSaveDoctor = async () => {
		try {
			const values = await form.validateFields();

			if (isUploadingAvatar) {
				message.warning('Ảnh đại diện đang được tải lên. Vui lòng chờ trong giây lát.');
				return;
			}

			if (!editingDoctor && createMode === 'tai_khoan_co_san' && !selectedExistingAccountId) {
				message.warning('Vui lòng chọn tài khoản bác sĩ chưa có hồ sơ trước khi lưu.');
				return;
			}

			setIsSubmitting(true);

			const payload = {
				ho_ten: values.ho_ten,
				so_dien_thoai: values.so_dien_thoai,
				chuyen_khoa_ids: values.chuyen_khoa,
				hoc_vi: values.hoc_vi,
				chung_chi_hanh_nghe: values.so_chung_chi,
				kinh_nghiem: values.kinh_nghiem,
				gioi_thieu: values.gioi_thieu,
				trang_thai: values.trang_thai,
			};

			if (avatarAsset?.url) {
				payload.hinh_anh = avatarAsset.url;
			}

			if (editingDoctor) {
				payload.email = values.email;
				await capNhatBacSi(editingDoctor.id, payload);
				message.success(`Đã cập nhật hồ sơ bác sĩ ${values.ho_ten}`);
				await fetchDoctorList(pagination.current, pagination.pageSize);
			} else {
				let createdDoctor = null;
				if (createMode === 'tai_khoan_co_san') {
					payload.kieu_tao = 'tai_khoan_co_san';
					payload.nguoi_dung_id = selectedExistingAccountId;
				} else {
					payload.kieu_tao = 'tao_moi_tai_khoan';
					payload.email = values.email;
					payload.mat_khau = values.mat_khau;
				}

				createdDoctor = await taoBacSi(payload);

				if (pendingAvatarFile && createdDoctor?.nguoi_dung_id && createdDoctor?.id) {
					const uploadedAvatar = await taiAnhDaiDienCloudinary(createdDoctor.nguoi_dung_id, pendingAvatarFile);
					if (uploadedAvatar?.url) {
						await capNhatBacSi(createdDoctor.id, { hinh_anh: uploadedAvatar.url });
					}
				}

				message.success(`Đã tạo hồ sơ bác sĩ ${values.ho_ten}`);
				await fetchDoctorList(1, pagination.pageSize);
				await fetchDoctorAccounts();
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
				message.error(err?.response?.data?.message || 'Không thể lưu hồ sơ bác sĩ.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteDoctor = (doctor) => {
		Modal.confirm({
			title: 'Xóa hồ sơ bác sĩ',
			content: `Bạn có chắc chắn muốn xóa hồ sơ bác sĩ ${doctor.ho_ten}?`,
			okText: 'Xóa',
			okButtonProps: { danger: true },
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await xoaBacSi(doctor.id);
					message.success('Đã xóa hồ sơ bác sĩ.');
					await fetchDoctorList(pagination.current, pagination.pageSize);
						await fetchDoctorAccounts();
				} catch (err) {
					message.error(err?.response?.data?.message || 'Không thể xóa hồ sơ bác sĩ.');
				}
			},
		});
	};

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
		if (!targetUserId && !editingDoctor && createMode === 'tao_moi_tai_khoan') {
			message.info('Ảnh sẽ được tải lên sau khi tạo mới bác sĩ thành công.');
			return;
		}

		if (!targetUserId) {
			message.info('Ảnh đã được chọn. Hãy chọn tài khoản bác sĩ để hệ thống tải ảnh lên.');
			return;
		}

		await uploadAvatarForUser(targetUserId, rawFile, {
			successMessage: 'Tải ảnh đại diện thành công.',
		});
	};

	const doctorColumns = [
		{
			title: 'MÃ BS',
			dataIndex: 'ma_bac_si',
			key: 'ma_bac_si',
			width: 100,
			render: (value) => <span className="text-slate-500 font-semibold text-xs">{value}</span>,
		},
		{
			title: 'HỌ TÊN',
			dataIndex: 'ho_ten',
			key: 'ho_ten',
			width: 220,
			render: (_, record) => (
				<div className="flex items-center gap-3">
					<Avatar
						size={34}
						src={record.hinh_anh}
						icon={<UserOutlined />}
						className="bg-cyan-100 text-cyan-700 shrink-0"
					/>
					<div>
						<p className="mb-0 text-slate-800 text-sm font-semibold leading-5">{record.ho_ten}</p>
						<p className="mb-0 text-slate-400 text-xs leading-4">{record.email}</p>
					</div>
				</div>
			),
		},
		{
			title: 'CHUYÊN KHOA',
			dataIndex: 'chuyen_khoa',
			key: 'chuyen_khoa',
			width: 150,
			render: (value) => (
				<div className="flex flex-wrap gap-1">
					{(value || []).map((item) => (
						<Tag
							key={item.id}
							className="rounded-full px-2 py-0.5 text-xs border-0 bg-teal-50 text-teal-700"
						>
							{item.ten_chuyen_khoa || item.ma_chuyen_khoa}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: 'HỌC VỊ',
			dataIndex: 'hoc_vi',
			key: 'hoc_vi',
			width: 90,
			render: (value) => <span className="text-slate-600 text-sm">{getHocViLabel(value)}</span>,
		},
		{
			title: 'SỐ ĐIỆN THOẠI',
			dataIndex: 'so_dien_thoai',
			key: 'so_dien_thoai',
			width: 130,
			render: (value) => <span className="text-slate-600 text-sm">{value}</span>,
		},
		{
			title: 'TRẠNG THÁI',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			width: 120,
			render: (value) => {
				const status = STATUS_STYLE_MAP[value] || STATUS_STYLE_MAP.nghi_viec;
				return (
					<Tag color={status.color} className="rounded-full px-2.5 py-0.5 text-xs">
						<span className="inline-flex items-center gap-1">
							<span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
							{status.label}
						</span>
					</Tag>
				);
			},
		},
		{
			title: 'THAO TÁC',
			key: 'actions',
			width: 90,
			align: 'center',
			render: (_, record) => (
				<div className="flex items-center justify-center gap-1">
					<Tooltip title="Chỉnh sửa">
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
							onClick={() => handleDeleteDoctor(record)}
							className="text-slate-400 hover:text-rose-600"
						/>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<div className="min-h-screen bg-slate-100 p-4 md:p-6">
			<div className="mx-auto w-full max-w-[1400px] rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="mb-1 text-[30px] leading-9 font-bold text-slate-800">Quản lý Bác sĩ</h1>
						<p className="mb-0 text-sm text-slate-500">
							Quản lý thông tin hồ sơ và trạng thái làm việc của đội ngũ y bác sĩ.
						</p>
					</div>

					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={openCreateDrawer}
						className="h-10 w-full rounded-full border-0 bg-teal-700 px-5 font-semibold hover:!bg-teal-800 sm:w-auto"
					>
						Thêm bác sĩ mới
					</Button>
				</div>

				<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
					<div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_180px_140px] md:gap-3">
						<Input
							placeholder="Tìm kiếm tên hoặc mã bác sĩ..."
							prefix={<SearchOutlined className="text-slate-400" />}
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
							allowClear
						/>
						<Select
							placeholder="Chuyên khoa"
							allowClear
							options={specialtySelectOptions}
							value={selectedChuyenKhoa}
							onChange={setSelectedChuyenKhoa}
						/>
						<Select
							placeholder="Học vị"
							allowClear
							options={HOC_VI_OPTIONS}
							value={selectedHocVi}
							onChange={setSelectedHocVi}
						/>
					</div>

					<div className="mt-2 flex flex-wrap items-center gap-2">
						<Select
							placeholder="Trạng thái"
							allowClear
							options={DOCTOR_STATUS_OPTIONS}
							value={selectedTrangThai}
							onChange={setSelectedTrangThai}
							className="w-full sm:w-[180px]"
						/>

						<Tooltip title="Làm mới bộ lọc">
							<Button
								icon={<FilterOutlined />}
								onClick={() => {
									setKeyword('');
									setSelectedChuyenKhoa(undefined);
									setSelectedHocVi(undefined);
									setSelectedTrangThai(undefined);
								}}
							/>
						</Tooltip>
					</div>
				</div>

				<div className="mt-4 rounded-2xl border border-slate-200 bg-white">
					<Table
						columns={doctorColumns}
						dataSource={doctorList}
						loading={isLoading}
						rowKey="id"
						pagination={{
							current: pagination.current,
							pageSize: pagination.pageSize,
							total: pagination.total,
							showSizeChanger: true,
							pageSizeOptions: [5, 10, 20, 50],
							onChange: (page, pageSize) => fetchDoctorList(page, pageSize),
							showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong số ${total} bác sĩ`,
						}}
						scroll={{ x: 980 }}
						className="doctor-profile-table"
					/>
				</div>
			</div>

			<Drawer
				title={
					<span className="text-lg font-bold text-slate-800">
						{editingDoctor ? 'Cập Nhật Hồ Sơ Bác Sĩ' : 'Thêm Bác Sĩ Mới'}
					</span>
				}
				open={isDrawerOpen}
				onClose={closeDrawer}
				style={{ width: 420, maxWidth: '100vw' }}
				destroyOnHidden
				forceRender
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
								{isUploadingAvatar ? 'Đang tải ảnh lên...' : 'Tải lên ảnh chân dung (JPG, PNG)'}
							</p>
						</div>
					</Upload>
				</div>

				<Form
					form={form}
					layout="vertical"
					requiredMark={false}
					initialValues={{
						hoc_vi: 'bac_si',
						trang_thai: 'hoat_dong',
						kinh_nghiem: 0,
					}}
				>
					{!editingDoctor && (
						<>
							<Form.Item label="Cách tạo hồ sơ">
								<Select
									options={CREATE_MODE_OPTIONS}
									value={createMode}
									onChange={(mode) => {
										setCreateMode(mode);
										setSelectedExistingAccountId(null);
										form.resetFields(['email', 'mat_khau', 'ho_ten', 'so_dien_thoai', 'hoc_vi', 'so_chung_chi', 'kinh_nghiem', 'gioi_thieu', 'trang_thai', 'chuyen_khoa']);
										form.setFieldsValue({
											hoc_vi: 'bac_si',
											trang_thai: 'hoat_dong',
											chuyen_khoa: [],
											kinh_nghiem: 0,
										});
									}}
								/>
							</Form.Item>

							{createMode === 'tai_khoan_co_san' && (
								<>
									<Form.Item label="Chọn tài khoản bác sĩ chưa có hồ sơ">
										<Select
											showSearch
											allowClear
											loading={isLoadingDoctorAccounts}
											options={doctorAccountSelectOptions}
											value={selectedExistingAccountId}
											onChange={handleSelectExistingAccount}
											placeholder="Chọn tài khoản BACSI"
											optionFilterProp="label"
										/>
									</Form.Item>

									<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
										<p className="mb-2 text-xs font-semibold text-slate-500">
											Danh sách tài khoản bác sĩ
										</p>
										<div className="max-h-32 overflow-y-auto space-y-1">
											{doctorAccountList.map((account) => {
												const accountStatus = ACCOUNT_STATUS_STYLE_MAP[account.trang_thai] || ACCOUNT_STATUS_STYLE_MAP.hoat_dong;
												return (
													<div
														key={account.id}
														className={`flex items-center justify-between rounded-lg border px-2 py-1 text-xs ${
															account.co_ho_so_bac_si ? 'border-slate-200 bg-slate-100 opacity-50' : 'border-emerald-200 bg-emerald-50'
														}`}
													>
														<div className="flex items-center gap-2">
															<Avatar size={24} src={account.hinh_anh} icon={!account.hinh_anh && <UserOutlined />} className="bg-slate-200 text-slate-500" />
															<span className="text-slate-700">{account.email}</span>
														</div>
														<div className="flex items-center gap-1">
															<Tag color={accountStatus.color} className="m-0 text-[10px]">
																{accountStatus.label}
															</Tag>
															<Tag color={account.co_ho_so_bac_si ? 'default' : 'processing'} className="m-0 text-[10px]">
																{account.co_ho_so_bac_si ? 'Đã có hồ sơ' : 'Chưa có hồ sơ'}
															</Tag>
														</div>
													</div>
												);
											})}
										</div>
									</div>

									{!selectedExistingAccountId && (
										<div className="mb-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
											Vui lòng chọn tài khoản bác sĩ chưa có hồ sơ để nhập thông tin hồ sơ.
										</div>
									)}
								</>
							)}

							{createMode === 'tao_moi_tai_khoan' && (
								<>
									<Form.Item
										label="Email tài khoản"
										name="email"
										rules={[
											{ required: true, message: 'Vui lòng nhập email tài khoản.' },
											{ type: 'email', message: 'Vui lòng nhập email hợp lệ.' },
										]}
									>
										<Input placeholder="bacsi@hospital.vn" />
									</Form.Item>

									<Form.Item
										label="Mật khẩu tài khoản"
										name="mat_khau"
										rules={[
											{ required: true, message: 'Vui lòng nhập mật khẩu.' },
											{ min: 8, message: 'Mật khẩu tối thiểu 8 ký tự.' },
										]}
									>
										<Input.Password placeholder="••••••••" />
									</Form.Item>
								</>
							)}
						</>
					)}

					{editingDoctor && (
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{ required: true, message: 'Vui lòng nhập email.' },
								{ type: 'email', message: 'Vui lòng nhập email hợp lệ.' },
							]}
						>
							<Input placeholder="abc@hospital.vn" />
						</Form.Item>
					)}

					{shouldShowProfileForm && (
						<>
					<Form.Item
						label="Họ và tên"
						name="ho_ten"
						rules={[{ required: true, message: 'Vui lòng nhập họ và tên bác sĩ.' }]}
					>
						<Input placeholder="Ví dụ: Nguyễn Văn A" />
					</Form.Item>

					<Form.Item
						label="Số điện thoại"
						name="so_dien_thoai"
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại.' },
							{
								pattern: /^0\d{9}$/,
								message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.',
							},
						]}
					>
						<Input placeholder="09xx xxx xxx" />
					</Form.Item>

					<Form.Item
						label="Chuyên khoa"
						name="chuyen_khoa"
						rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 chuyên khoa.' }]}
					>
						<Select
							mode="multiple"
							options={specialtySelectOptions}
							placeholder="Chọn chuyên khoa phụ trách"
							optionFilterProp="label"
						/>
					</Form.Item>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<Form.Item
							label="Học vị"
							name="hoc_vi"
							rules={[{ required: true, message: 'Vui lòng chọn học vị.' }]}
						>
							<Select options={HOC_VI_OPTIONS} placeholder="BS" />
						</Form.Item>

						<Form.Item label="Số CCNN" name="so_chung_chi">
							<Input placeholder="Mã số chứng chỉ" />
						</Form.Item>
					</div>

					<Form.Item label="Kinh nghiệm (năm)" name="kinh_nghiem">
						<InputNumber min={0} max={60} className="w-full" />
					</Form.Item>

					<Form.Item label="Giới thiệu bản thân" name="gioi_thieu">
						<Input.TextArea
							rows={4}
							placeholder="Tóm tắt quá trình công tác và chuyên môn..."
							maxLength={500}
							showCount
						/>
					</Form.Item>

					<Form.Item label="Trạng thái" name="trang_thai">
						<Select options={DOCTOR_STATUS_OPTIONS} />
					</Form.Item>
						</>
					)}
				</Form>

				<div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
					<Button onClick={closeDrawer} className="w-full sm:w-auto">Hủy</Button>
					<Button
						type="primary"
						loading={isSubmitting}
						onClick={handleSaveDoctor}
						className="w-full border-0 bg-teal-700 hover:!bg-teal-800 sm:w-auto"
					>
						{editingDoctor ? 'Cập nhật bác sĩ' : 'Lưu bác sĩ'}
					</Button>
				</div>
			</Drawer>
		</div>
	);
}
