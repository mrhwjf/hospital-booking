import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import {
  addDonThuocItems,
  createDonThuoc,
  deleteDonThuoc,
  getDonThuocByPhieuKham,
  searchThuoc,
  updateDonThuocItems,
} from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";

export const TIME_OPTIONS = [
  { label: "Trước ăn", value: "truoc_an" },
  { label: "Sau ăn", value: "sau_an" },
  { label: "Trong ăn", value: "trong_an" },
  { label: "Không liên quan", value: "khong_lien_quan" },
];

const EMPTY_DRAFT = {
  medicineId: null,
  medicine: "",
  quantity: 1,
  instruction: "",
  time: "khong_lien_quan",
  days: 1,
  note: "",
};

export default function useDonThuocEditor({ phieuKhamId, isLocked = false, refreshKey = 0 }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [draftPrescription, setDraftPrescription] = useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);
  const [donThuocId, setDonThuocId] = useState(null);
  const nextId = useRef(1);

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

  const updateDraft = (field, value) => {
    setDraftPrescription((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedicineDraft = (medicineId) => {
    const selected = medicineOptions.find((item) => item.value === medicineId);
    setDraftPrescription((prev) => ({
      ...prev,
      medicineId,
      medicine: selected?.medicineName ?? "",
    }));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftPrescription(EMPTY_DRAFT);
  };

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

  const removeRow = (id) => {
    if (isLocked) {
      return;
    }

    setPrescriptions((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

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
      cancelEdit();
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

  const handleDeletePrescription = async () => {
    if (isLocked) {
      return;
    }

    if (donThuocId) {
      try {
        await deleteDonThuoc(donThuocId);
        message.success("Đã hủy đơn thuốc");
      } catch (error) {
        const serverMessage = getApiErrorMessage(error, "Không thể hủy đơn thuốc");
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
        const serverMessage = getApiErrorMessage(error, "Không thể cập nhật danh sách thuốc");
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
      const serverMessage = getApiErrorMessage(error, "Lưu đơn thuốc thất bại");
      message.error(serverMessage || "Lưu đơn thuốc thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    prescriptions,
    medicineOptions,
    draftPrescription,
    editingId,
    isSaving,
    isLoadingMedicines,
    updateDraft,
    updateMedicineDraft,
    cancelEdit,
    startEditRow,
    removeRow,
    submitPrescriptionFromDraft,
    handleDeletePrescription,
    savePrescription,
  };
}
