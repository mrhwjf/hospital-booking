import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Avatar,
  Upload,
  Space,
  Tooltip,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  UserOutlined,
  CameraOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  layDanhSachNguoiDung,
  taoNguoiDung,
  capNhatNguoiDung,
  toggleKhoaTaiKhoan,
} from '../../../Services/admin/accountManagementService';
import { taiAnhDaiDienCloudinary } from '../../../Services/admin/cloudinaryService';
import useDebounce from '../../../hooks/useDebounce';

// ── Constants ──────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: 'BACSI', label: 'Bác sĩ' },
  { value: 'NHANVIEN', label: 'Nhân viên' },
];

const STATUS_OPTIONS = [
  { value: 'hoat_dong', label: 'Hoạt động' },
  { value: 'tam_khoa', label: 'Tạm khóa' },
  { value: 'khoa', label: 'Khóa' },
];

const STATUS_MAP = {
  hoat_dong: { label: 'Hoạt động', color: 'success' },
  tam_khoa: { label: 'Tạm khóa', color: 'warning' },
  khoa: { label: 'Khóa', color: 'error' },
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

// ── Mock data (commented out — now using API) ──────────────
// const generateMockData = () => [
//   { id: 'ADM-0294', email: 'dr.chen@medsystem.com', hinh_anh: null, vai_tro: 'bacsi', trang_thai: 'hoat_dong', lan_dang_nhap_cuoi: 'Today, 09:42 AM', created_at: 'Oct 12, 2023' },
//   { id: 'ADM-0312', email: 'm.smith@medsystem.com', hinh_anh: null, vai_tro: 'nhanvien', trang_thai: 'tam_khoa', lan_dang_nhap_cuoi: 'Oct 24, 03:15 PM', created_at: 'Nov 05, 2023' },
//   { id: 'ADM-0188', email: 'dr.roberts@medsystem.com', hinh_anh: null, vai_tro: 'bacsi', trang_thai: 'hoat_dong', lan_dang_nhap_cuoi: 'Yesterday, 11:20 PM', created_at: 'Jun 14, 2023' },
//   { id: 'ADM-0442', email: 'j.doe_locked@medsystem.com', hinh_anh: null, vai_tro: 'nhanvien', trang_thai: 'khoa', lan_dang_nhap_cuoi: 'Sep 02, 10:00 AM', created_at: 'Aug 20, 2023' },
//   { id: 'ADM-0501', email: 'nurse.wilson@medsystem.com', hinh_anh: null, vai_tro: 'nhanvien', trang_thai: 'hoat_dong', lan_dang_nhap_cuoi: 'Today, 07:15 AM', created_at: 'Jan 12, 2024' },
// ];

// ── Helpers ────────────────────────────────────────────────
const roleLabel = (vai_tro) => {
  const map = { BACSI: 'Bác sĩ', NHANVIEN: 'Lễ tân', ADMIN: 'Quản trị viên', BENHNHAN: 'Bệnh nhân' };
  return map[vai_tro] || vai_tro;
};

const lockIconColor = (trang_thai) => {
  if (trang_thai === 'hoat_dong') return '#52c41a';
  if (trang_thai === 'tam_khoa') return '#faad14';
  return '#ff4d4f';
};

// ── Component ──────────────────────────────────────────────
export default function UserManagementPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10, total: 0 });
  const [filterEmail, setFilterEmail] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [form] = Form.useForm();

  // Ultility
  const debounceEmail = useDebounce(filterEmail);

  // ── Fetch data from API ──
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: pagination.perPage };
      if (debounceEmail) params.q = debounceEmail;
      if (filterRole) params.vai_tro = filterRole;
      if (filterStatus) params.trang_thai = filterStatus;

      const res = await layDanhSachNguoiDung(params);
      const sortedData = [...res.data].sort((a, b) => Number(a.id) - Number(b.id));
      setData(sortedData);
      setPagination((prev) => ({
        ...prev,
        page: res.meta.page,
        total: res.meta.total,
      }));
    } catch {
      message.error('Không thể tải danh sách tài khoản người dùng.');
    } finally {
      setLoading(false);
    }
  }, [debounceEmail, filterRole, filterStatus, pagination.perPage]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // ── Handlers ──
  const openCreate = () => {
    setEditingRecord(null);
    setAvatarUrl(null);
    setSelectedAvatarFile(null);
    form.resetFields();
    form.setFieldsValue({ trang_thai: 'hoat_dong', vai_tro: 'BACSI' });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setAvatarUrl(record.hinh_anh);
    setSelectedAvatarFile(null);
    form.setFieldsValue({
      email: record.email,
      vai_tro: record.vai_tro,
      trang_thai: record.trang_thai,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);

      if (editingRecord) {
        // ── Update ──
        const payload = {};
        if (values.email !== editingRecord.email) payload.email = values.email;
        if (values.vai_tro !== editingRecord.vai_tro) payload.vai_tro = values.vai_tro;
        if (values.trang_thai !== editingRecord.trang_thai) payload.trang_thai = values.trang_thai;

        if (selectedAvatarFile) {
          const uploadedAvatar = await taiAnhDaiDienCloudinary(editingRecord.id, selectedAvatarFile);
          payload.hinh_anh = uploadedAvatar.url;
        }

        await capNhatNguoiDung(editingRecord.id, payload);
        message.success('Cập nhật tài khoản thành công.');
      } else {
        // ── Create ──
        const createdUser = await taoNguoiDung({
          email: values.email,
          mat_khau: values.mat_khau,
          vai_tro: values.vai_tro,
          trang_thai: values.trang_thai,
        });

        if (selectedAvatarFile && createdUser?.id) {
          const uploadedAvatar = await taiAnhDaiDienCloudinary(createdUser.id, selectedAvatarFile);
          await capNhatNguoiDung(createdUser.id, { hinh_anh: uploadedAvatar.url });
        }

        message.success('Tạo tài khoản thành công.');
      }

      setModalOpen(false);
      form.resetFields();
      setAvatarUrl(null);
      setSelectedAvatarFile(null);
      setEditingRecord(null);
      fetchData(pagination.page);
    } catch (err) {
      if (err?.response?.data?.errors) {
        // Map backend validation errors to form fields
        const fieldErrors = Object.entries(err.response.data.errors).map(([name, msgs]) => ({
          name,
          errors: msgs,
        }));
        form.setFields(fieldErrors);
      } else if (err?.errorFields) {
        // Ant Design client-side validation — do nothing
      } else {
        message.error('Thao tác thất bại. Vui lòng thử lại.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleLock = (record) => {
    const nextStatus = record.trang_thai === 'khoa' ? 'hoat_dong' : 'khoa';
    const actionLabel = nextStatus === 'khoa' ? 'khóa' : 'mở khóa';

    Modal.confirm({
      title: `${actionLabel === 'khóa' ? 'Khóa' : 'Mở khóa'} tài khoản`,
      content: `Bạn có chắc chắn muốn ${actionLabel} tài khoản "${record.email}"?`,
      okText: 'Xác nhận',
      okButtonProps: {
        danger: nextStatus === 'khoa',
      },
      onOk: async () => {
        try {
          await toggleKhoaTaiKhoan(record.id);
          message.success(`${actionLabel === 'khóa' ? 'Khóa' : 'Mở khóa'} tài khoản thành công.`);
          fetchData(pagination.page);
        } catch {
          message.error(`Không thể ${actionLabel} tài khoản.`);
        }
      },
    });
  };

  const handleAvatarChange = (rawFile) => {
    if (!rawFile) return;

    if (!isValidImageFile(rawFile)) {
      message.error('Tệp tải lên phải là hình ảnh hợp lệ.');
      return;
    }

    setSelectedAvatarFile(rawFile);
    const url = URL.createObjectURL(rawFile);
    setAvatarUrl(url);
  };

  // ── Table columns ──
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <span className="text-gray-500 font-medium text-sm">#{id}</span>,
    },
    {
      title: 'TÀI KHOẢN',
      dataIndex: 'email',
      key: 'email',
      render: (email, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={36}
            src={record.hinh_anh}
            icon={!record.hinh_anh && <UserOutlined />}
            className="bg-gray-200 text-gray-500 shrink-0"
          />
          <span className="text-sm">{email}</span>
        </div>
      ),
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'vai_tro',
      key: 'vai_tro',
      width: 120,
      render: (vai_tro) => <span className="text-sm">{roleLabel(vai_tro)}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 160,
      render: (trang_thai) => {
        const { label, color } = STATUS_MAP[trang_thai] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'LẦN ĐĂNG NHẬP CUỐI',
      dataIndex: 'lan_dang_nhap_cuoi',
      key: 'lan_dang_nhap_cuoi',
      width: 160,
      render: (text) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (text) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: 'THAO TÁC',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="text-gray-500 hover:text-teal-600"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.trang_thai === 'khoa' ? 'Mở khóa' : 'Khóa'}>
            <Button
              type="text"
              size="small"
              icon={
                record.trang_thai === 'khoa' ? (
                  <LockOutlined style={{ color: lockIconColor(record.trang_thai) }} />
                ) : (
                  <UnlockOutlined style={{ color: lockIconColor(record.trang_thai) }} />
                )
              }
              onClick={() => handleToggleLock(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ── Render ──
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1400px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-gray-500 mt-1">
            Tạo mới, theo dõi và quản lý tài khoản người dùng trong hệ thống.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Lọc theo email"
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            placeholder="Tất cả vai trò"
            allowClear
            value={filterRole}
            onChange={setFilterRole}
            options={ROLE_OPTIONS}
            className="w-full sm:w-40"
          />
          <Select
            placeholder="Tất cả trạng thái"
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={STATUS_OPTIONS}
            className="w-full sm:w-44"
          />
          <Tooltip title="Áp dụng bộ lọc">
            <Button icon={<FilterOutlined />} />
          </Tooltip>

          <div className="w-full sm:ml-auto sm:w-auto">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
              className="w-full bg-teal-600 border-teal-600 hover:bg-teal-700 sm:w-auto"
            >
              Tạo tài khoản
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.perPage,
            total: pagination.total,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trên tổng ${total} tài khoản`,
            onChange: (page) => fetchData(page),
          }}
          scroll={{ x: 980 }}
          bordered={false}
          className="account-table"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRecord(null);
          setAvatarUrl(null);
          setSelectedAvatarFile(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
        style={{ width: 460, maxWidth: '100vw' }}
        forceRender
        centered
      >
        {/* Avatar uploader */}
        <div className="flex justify-center mb-6">
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarChange(file);
              return Upload.LIST_IGNORE;
            }}
            accept="image/*"
          >
            <div className="relative cursor-pointer group">
              <Avatar
                size={80}
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                className="border-2 border-dashed border-teal-400 bg-teal-50 text-teal-600"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraOutlined className="text-white text-lg" />
              </div>
              <p className="text-xs text-teal-600 mt-1 text-center font-medium">
                TẢI ẢNH ĐẠI DIỆN
              </p>
            </div>
          </Upload>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Địa chỉ email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email.' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ.' },
            ]}
          >
            <Input placeholder="example@benhvien.vn" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {!editingRecord && (
              <Form.Item
                label="Mật khẩu"
                name="mat_khau"
                className="flex-1"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu.' },
                  { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự.' },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
            )}
            <Form.Item
              label="Vai trò hệ thống"
              name="vai_tro"
              className="flex-1"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}
            >
              <Select options={ROLE_OPTIONS} />
            </Form.Item>
          </div>

          <Form.Item
            label="Trạng thái ban đầu"
            name="trang_thai"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>

        <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button
            onClick={() => {
              setModalOpen(false);
              setEditingRecord(null);
              setAvatarUrl(null);
              form.resetFields();
            }}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleModalOk}
            loading={modalLoading}
            className="w-full bg-teal-600 border-teal-600 hover:bg-teal-700 sm:w-auto"
          >
            {editingRecord ? 'Lưu thay đổi' : 'Xác nhận tạo mới'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}