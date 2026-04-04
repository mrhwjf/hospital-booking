import { useEffect, useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  InputNumber,
  message,
  Select,
  Tag,
} from "antd";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  PrinterOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  addDonThuocItems,
  createDonThuoc,
  deleteDonThuoc,
  getDonThuocByPhieuKham,
  searchThuoc,
  updateDonThuocItems,
} from "../../../Services/clinicalService";

const PRIMARY = "#1c7a71";
const DEFAULT_PHIEU_KHAM_ID = null;

const TIME_OPTIONS = [
  { label: "Trước ăn", value: "truoc_an" },
  { label: "Sau ăn", value: "sau_an" },
  { label: "Trong ăn", value: "trong_an" },
  { label: "Không liên quan", value: "khong_lien_quan" },
];

// mẫu đơn thuốc trống để reset form sau khi thêm hoặc hủy chỉnh sửa
const EMPTY_DRAFT = {
  medicineId: null,
  medicine: "",
  quantity: 1,
  instruction: "",
  time: "khong_lien_quan",
  days: 1,
  note: "",
};

export default function DonThuocPage({ phieuKhamId = DEFAULT_PHIEU_KHAM_ID, isLocked = false, refreshKey = 0 }) {

  const [prescriptions, setPrescriptions] = useState([]);   // danh sách thuốc trong đơn hiện tại

  const [medicineOptions, setMedicineOptions] = useState([]);  // danh sách thuốc để chọn khi thêm mới

  const [draftPrescription, setDraftPrescription] = useState(EMPTY_DRAFT);  // thông tin thuốc đang được thêm mới hoặc chỉnh sửa

  const [editingId, setEditingId] = useState(null); // id của dòng đang được chỉnh sửa, null nếu không có dòng nào đang chỉnh sửa

  const [isSaving, setIsSaving] = useState(false); // trạng thái đang lưu đơn thuốc

  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false); // trạng thái đang tải danh sách thuốc

  const [donThuocId, setDonThuocId] = useState(null); // id của đơn thuốc hiện tại, null nếu chưa có đơn nào được tạo

  const nextId = useRef(1);  // biến để tạo id tạm cho các dòng thuốc khi chưa lưu vào database, sẽ được reset sau khi tải dữ liệu đơn thuốc từ API

  // Hàm để tải dữ liệu đơn thuốc và danh sách thuốc khi component được mount
  useEffect(() => {
    const mapApiItemsToRows = (items = []) =>
      items.map((item, index) => ({
        id: index + 1,
        thuocId: item.thuoc_id,
        medicine: item.ten_thuoc || item.ma_thuoc || "",
        quantity: item.so_luong,
        instruction: item.lieu_dung,
        time: item.thoi_diem,
        days: item.so_ngay,
        note: item.ghi_chu || "",
      }));

    // Hàm để tải dữ liệu đơn thuốc và danh sách thuốc khi component được mount
    const fetchPageData = async () => {
      if (!phieuKhamId) {
        setDonThuocId(null);
        setPrescriptions([]);
        nextId.current = 1;
        return;
      }

      try {
        setIsLoadingMedicines(true);
        const [medicineResponse, donThuocResponse] = await Promise.allSettled([
          searchThuoc({ per_page: 100 }),
          getDonThuocByPhieuKham(phieuKhamId),
        ]);

        if (medicineResponse.status === "fulfilled") {
          const options = (medicineResponse.value ?? []).map((row) => ({
            label: `${row.ten_thuoc} (${row.ma_thuoc})`,
            value: row.id,
            medicineName: row.ten_thuoc,
          }));
          setMedicineOptions(options);
        } else {
          message.error("Không tải được danh sách thuốc");
        }

        if (donThuocResponse.status === "fulfilled") {
          const donThuoc = donThuocResponse.value;
          const rows = mapApiItemsToRows(donThuoc?.items ?? []);

          setDonThuocId(donThuoc?.id ?? null);
          setPrescriptions(rows);
          nextId.current = rows.length + 1;
        }
      } catch {
        message.error("Không tải được dữ liệu đơn thuốc");
      } finally {
        setIsLoadingMedicines(false);
      }
    };

    fetchPageData();
  }, [phieuKhamId, refreshKey]);

  // Hàm để thêm mới hoặc cập nhật thuốc vào danh sách đơn thuốc tạm thời khi người dùng nhấn nút lưu trong form thêm/chỉnh sửa
  const submitPrescriptionFromDraft = () => {
    if (isLocked) {
      return;
    }

    if (!draftPrescription.medicineId || !draftPrescription.medicine.trim()) {
      message.warning("Vui lòng chọn thuốc trước khi thêm");
      return;
    }

    if (editingId !== null) {
      setPrescriptions((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
              ...row,
              thuocId: draftPrescription.medicineId,
              medicine: draftPrescription.medicine.trim(),
              quantity: draftPrescription.quantity,
              instruction: draftPrescription.instruction.trim(),
              time: draftPrescription.time,
              days: draftPrescription.days,
              note: draftPrescription.note.trim(),
            }
            : row,
        ),
      );
      setEditingId(null);
      setDraftPrescription(EMPTY_DRAFT);
      return;
    }

    setPrescriptions((prev) => [
      ...prev,
      {
        id: nextId.current++,
        thuocId: draftPrescription.medicineId,
        medicine: draftPrescription.medicine.trim(),
        quantity: draftPrescription.quantity,
        instruction: draftPrescription.instruction.trim(),
        time: draftPrescription.time,
        days: draftPrescription.days,
        note: draftPrescription.note.trim(),
      },
    ]);
    setDraftPrescription(EMPTY_DRAFT);
  };

  // Hàm để cập nhật thông tin thuốc trong form thêm/chỉnh sửa khi người dùng thay đổi giá trị
  const updateDraft = (field, value) => {
    setDraftPrescription((prev) => ({ ...prev, [field]: value }));
  };

  // Hàm để cập nhật thông tin thuốc trong form thêm/chỉnh sửa khi người dùng chọn thuốc từ dropdown, sẽ tự động điền tên thuốc vào form
  const updateMedicineDraft = (medicineId) => {
    const selected = medicineOptions.find((item) => item.value === medicineId);
    setDraftPrescription((prev) => ({
      ...prev,
      medicineId,
      medicine: selected?.medicineName ?? "",
    }));
  };

  // Hàm để xóa một dòng thuốc khỏi danh sách đơn thuốc tạm thời khi người dùng nhấn nút xóa, nếu đang chỉnh sửa dòng đó thì sẽ hủy chỉnh sửa luôn
  const removeRow = (id) => {
    if (isLocked) {
      return;
    }

    setPrescriptions((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraftPrescription(EMPTY_DRAFT);
    }
  };

  // Hàm để bắt đầu chỉnh sửa một dòng thuốc, sẽ điền thông tin của dòng đó vào form thêm/chỉnh sửa
  const startEditRow = (row) => {
    if (isLocked) {
      return;
    }

    setEditingId(row.id);
    setDraftPrescription({
      medicineId: row.thuocId,
      medicine: row.medicine,
      quantity: row.quantity,
      instruction: row.instruction,
      time: row.time,
      days: row.days,
      note: row.note,
    });
  };

  // Hàm để hủy chỉnh sửa, sẽ xóa thông tin trong form và đặt editingId về null
  const cancelEdit = () => {
    setEditingId(null);
    setDraftPrescription(EMPTY_DRAFT);
  };

  // Hủy toàn bộ đơn thuốc: xóa trên DB nếu đã lưu, reset UI về trạng thái trống
  const handleDeletePrescription = async () => {
    if (isLocked) {
      return;
    }

    if (donThuocId) {
      try {
        await deleteDonThuoc(donThuocId);
        message.success("Đã hủy đơn thuốc");
      } catch (error) {
        const serverMessage = error?.response?.data?.message;
        message.error(serverMessage || "Không thể hủy đơn thuốc");
        return;
      }
    }
    setDonThuocId(null);
    setPrescriptions([]);
    setEditingId(null);
    setDraftPrescription(EMPTY_DRAFT);
    nextId.current = 1;
  };

  // Hàm để lưu đơn thuốc, sẽ gọi API để tạo mới hoặc cập nhật đơn thuốc tùy vào việc đã có donThuocId hay chưa, sau khi lưu thành công sẽ hiển thị thông báo và cập nhật lại donThuocId nếu là lần đầu tiên lưu
  const savePrescription = async () => {
    if (isLocked) {
      return;
    }

    if (!prescriptions.length) {
      message.warning("Đơn thuốc chưa có thuốc nào");
      return;
    }

    if (donThuocId) {
      try {
        setIsSaving(true);
        await updateDonThuocItems(donThuocId, {
          items: prescriptions.map((row) => ({
            thuoc_id: row.thuocId,
            so_luong: row.quantity,
            lieu_dung: row.instruction,
            thoi_diem: row.time,
            so_ngay: row.days,
            ghi_chu: row.note || null,
          })),
        });
        message.success("Cập nhật danh sách thuốc thành công");
      } catch (error) {
        const serverMessage = error?.response?.data?.error?.message;
        message.error(serverMessage || "Không thể cập nhật danh sách thuốc");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    try {
      setIsSaving(true);
      const createResponse = await createDonThuoc(phieuKhamId, {
        ngay_ke: new Date().toISOString().slice(0, 10),
        ghi_chu: null,
      });

      const createdId = createResponse?.id;
      if (!createdId) {
        throw new Error("create_failed");
      }

      await addDonThuocItems(createdId, {
        items: prescriptions.map((row) => ({
          thuoc_id: row.thuocId,
          so_luong: row.quantity,
          lieu_dung: row.instruction,
          thoi_diem: row.time,
          so_ngay: row.days,
          ghi_chu: row.note || null,
        })),
      });

      setDonThuocId(createdId);
      message.success("Lưu đơn thuốc thành công");
    } catch (error) {
      const serverMessage = error?.response?.data?.error?.message;
      message.error(serverMessage || "Lưu đơn thuốc thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY,
          borderRadius: 10,
          controlHeight: 42,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{ background: "#f8fbfb" }}
      >
        {/* ── Top Navbar ── */}
        {/* <header
          className="flex items-center justify-between px-6 h-16 shrink-0 shadow-sm"
          style={{ background: "#fff", borderBottom: "1px solid #e8f3f2" }}
        >
          <h2 className="text-lg font-bold" style={{ color: "#0e1b1a" }}>
            Phiếu khám bệnh
          </h2>
        </header> */}

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          <div className="max-w-350 mx-auto flex flex-col gap-6">

            {/* Patient profile card */}
            {/* <div
              className="rounded-xl p-5 shadow-sm"
              style={{ background: "#fff", border: "1px solid #e8f3f2" }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                <div className="flex gap-5 items-center">
                  <img
                    src={patient.avatar}
                    alt="Ảnh bệnh nhân"
                    className="h-20 w-20 rounded-full object-cover shrink-0"
                    style={{ border: "4px solid #f9fafb" }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#0e1b1a" }}
                      >
                        {patient.name}
                      </span>
                      <Tag
                        color="success"
                        className="rounded-full font-semibold"
                      >
                        {patient.status}
                      </Tag>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      <span>
                        {patient.gender} • {patient.age} Tuổi
                      </span>
                      <span>ID: {patient.patientId}</span>
                      <span>
                        BHYT: {patient.insurance} ({patient.insurancePct}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    icon={<FileTextOutlined />}
                    style={{
                      color: PRIMARY,
                      background: `${PRIMARY}1a`,
                      border: "none",
                    }}
                  >
                    LS Bệnh án
                  </Button>
                  <Button icon={<EditOutlined />}>Ghi chú</Button>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col">
              <div
                className="rounded-xl shadow-sm flex flex-col flex-1"
                style={{ background: "#fff", border: "1px solid #e8f3f2" }}
              >


                {/* Header */}
                <div
                  className="px-5 py-4 flex justify-between items-center"
                  style={{ borderBottom: "1px solid #e8f3f2" }}
                >
                  <h3
                    className="font-bold text-lg flex items-center gap-2"
                    style={{ color: "#0e1b1a" }}
                  >
                    <MedicineBoxOutlined style={{ color: PRIMARY }} />
                    Kê đơn thuốc
                  </h3>

                </div>

                {/* Prescription rows */}
                <div className="p-5 flex-1 overflow-auto">
                  <div
                    className="rounded-lg p-4 mb-5"
                    style={{
                      background: editingId !== null ? "#eef7f6" : "#f8fbfb",
                      border:
                        editingId !== null
                          ? `1px solid ${PRIMARY}`
                          : "1px solid #e8f3f2",
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-3">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Tên thuốc
                        </div>
                        <Select
                          showSearch
                          size="large"
                          value={draftPrescription.medicineId}
                          onChange={updateMedicineDraft}
                          options={medicineOptions}
                          placeholder="Chọn hoặc tìm tên thuốc..."
                          optionFilterProp="label"
                          loading={isLoadingMedicines}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Số lượng
                        </div>
                        <InputNumber
                          size="large"
                          value={draftPrescription.quantity}
                          onChange={(v) => updateDraft("quantity", v || 1)}
                          min={1}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Liều dùng
                        </div>
                        <Input
                          size="large"
                          value={draftPrescription.instruction}
                          onChange={(e) =>
                            updateDraft("instruction", e.target.value)
                          }
                          placeholder="VD: 1 viên x 2 lần/ngày"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Thời điểm
                        </div>
                        <Select
                          size="large"
                          value={draftPrescription.time}
                          onChange={(v) => updateDraft("time", v)}
                          options={TIME_OPTIONS}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Số ngày
                        </div>
                        <InputNumber
                          size="large"
                          value={draftPrescription.days}
                          onChange={(v) => updateDraft("days", v || 1)}
                          min={1}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600 mb-1.5">
                          Ghi chú
                        </div>
                        <Input
                          size="large"
                          value={draftPrescription.note}
                          onChange={(e) => updateDraft("note", e.target.value)}
                          placeholder="Ghi chú thêm..."
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <div className="flex items-center gap-2">
                          {editingId !== null && (
                            <Button size="large" onClick={cancelEdit}>
                              Hủy
                            </Button>
                          )}
                          <Button
                            size="large"
                            type="primary"
                            shape={editingId !== null ? "default" : "circle"}
                            icon={
                              editingId !== null ? (
                                <SaveOutlined />
                              ) : (
                                <PlusOutlined />
                              )
                            }
                            onClick={submitPrescriptionFromDraft}
                            disabled={isLocked}
                          >
                            {editingId !== null ? "Lưu" : null}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table
                      className="w-full text-left border-collapse"
                      style={{ minWidth: 980 }}
                    >
                      <thead>
                        <tr style={{ background: "#f9fafb" }}>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 text-center w-[5%]">
                            #
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[20%]">
                            Tên thuốc / Hoạt chất
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[10%]">
                            Số lượng
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[20%]">
                            Liều dùng
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[15%]">
                            Thời điểm
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[10%]">
                            Số ngày
                          </th>
                          <th className="px-3 py-4 text-sm font-semibold uppercase text-gray-500 w-[30%]">
                            Ghi chú
                          </th>
                          <th className="px-3 py-4 w-[8%]" />
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        {prescriptions.map((row, idx) => (
                          <tr
                            key={row.id}
                            className="transition-colors hover:bg-gray-50"
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              background:
                                editingId === row.id ? "#eef7f6" : undefined,
                            }}
                          >
                            <td className="px-3 py-3 text-center text-gray-400 font-medium">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-medium text-gray-900">
                                {row.medicine}
                              </span>
                            </td>
                            <td className="px-3 py-3">{row.quantity}</td>
                            <td className="px-3 py-3">
                              {row.instruction || "-"}
                            </td>
                            <td className="px-3 py-3">
                              {TIME_OPTIONS.find(
                                (option) => option.value === row.time,
                              )?.label || "-"}
                            </td>
                            <td className="px-3 py-3">{row.days}</td>
                            <td className="px-3 py-3">{row.note || "-"}</td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  size="middle"
                                  onClick={() => startEditRow(row)}
                                  disabled={isLocked}
                                />
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  size="middle"
                                  onClick={() => removeRow(row.id)}
                                  disabled={isLocked}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div
                  className="px-5 py-3 rounded-b-xl"
                  style={{
                    background: "#f9fafb",
                    borderTop: "1px solid #e8f3f2",
                  }}
                >
                  <div className="mt-4 flex justify-between items-center gap-3">
                    <Button
                      size="large"
                      danger
                      icon={<CloseCircleOutlined />}
                      className="font-bold"
                      onClick={handleDeletePrescription}
                      disabled={isLocked}
                    >
                      Hủy kê đơn
                    </Button>
                    <div className="flex gap-3">

                      {/* <Button
                        size="large"
                        icon={<PrinterOutlined />}
                        className="font-bold"
                      >
                        In đơn thuốc
                      </Button> */}


                      <Button
                        size="large"
                        type="primary"
                        icon={<SaveOutlined />}
                        className="font-bold"
                        style={{ paddingInline: 28 }}
                        loading={isSaving}
                        onClick={savePrescription}
                        disabled={isLocked}
                      >
                        Lưu &amp; Kết thúc
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}
