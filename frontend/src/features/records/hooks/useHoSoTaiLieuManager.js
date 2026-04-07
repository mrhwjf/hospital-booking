import { useCallback, useDeferredValue, useEffect, useMemo, useState, startTransition } from "react";
import { message } from "antd";
import {
  createHoSoTaiLieu,
  deleteHoSoTaiLieu,
  getHoSoTaiLieuByBenhNhan,
  getTaiLieuSignedUrl,
  updateHoSoTaiLieu,
  uploadHoSoTaiLieuFile,
} from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { createEmptyForm } from "../data/recordsData";

export default function useHoSoTaiLieuManager({ benhNhanId, phieuKhamId, refreshKey = 0 }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formState, setFormState] = useState(createEmptyForm(phieuKhamId));
  const [fileList, setFileList] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [detailDocument, setDetailDocument] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const deferredKeyword = useDeferredValue(keyword.trim().toLowerCase());

  const hydratedDocuments = useMemo(() => documents, [documents]);

  const fetchDocuments = useCallback(async () => {
    if (!benhNhanId || !phieuKhamId) {
      setDocuments([]);
      setSelectedDocumentId(null);
      setLoading(false);
      setError("Bệnh nhân này chưa có phiếu khám hoàn thành để lưu tài liệu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHoSoTaiLieuByBenhNhan(benhNhanId, {
        per_page: 100,
        phieu_kham_id: phieuKhamId,
      });
      setDocuments(data);
      setSelectedDocumentId((prev) => prev ?? data?.[0]?.id ?? null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải hồ sơ tài liệu."));
    } finally {
      setLoading(false);
    }
  }, [benhNhanId, phieuKhamId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  const filteredDocuments = hydratedDocuments.filter((document) => {
    const matchesType = typeFilter === "all" || document.loai_tai_lieu === typeFilter;

    if (!matchesType) {
      return false;
    }

    if (!deferredKeyword) {
      return true;
    }

    const searchText = [
      document.ma_tai_lieu,
      document.ten_tai_lieu,
      document.file_public_id,
      document.benh_nhan?.ho_ten,
      document.benh_nhan?.ma_benh_nhan,
      document.phieu_kham?.ma_phieu_kham,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(deferredKeyword);
  });

  const selectedDocument = hydratedDocuments.find((item) => item.id === selectedDocumentId) || filteredDocuments[0] || null;
  const totalDocuments = hydratedDocuments.length;
  const totalExamResults = hydratedDocuments.filter((item) => item.loai_tai_lieu.startsWith("ket_qua_")).length;
  const totalInstructions = hydratedDocuments.filter((item) => item.loai_tai_lieu === "phieu_chi_dinh").length;
  const totalDischarge = hydratedDocuments.filter((item) => item.loai_tai_lieu === "giay_ra_vien").length;

  function handleSelectDocument(document) {
    setSelectedDocumentId(document.id);
  }

  function handleOpenDetailModal(document) {
    setDetailDocument(document);
    setIsDetailModalOpen(true);
  }

  function handleOpenPreviewModal(document) {
    setPreviewDocument(document);
    setPreviewUrl(null);
    setPreviewLoading(true);
    setIsPreviewModalOpen(true);

    getTaiLieuSignedUrl(benhNhanId, document.id)
      .then((url) => {
        setPreviewUrl(url);
      })
      .catch((err) => {
        messageApi.error(getApiErrorMessage(err, "Không thể lấy signed URL."));
      })
      .finally(() => setPreviewLoading(false));
  }

  async function handleDeleteDocument(document, isLocked = false) {
    if (isLocked) {
      return;
    }

    try {
      await deleteHoSoTaiLieu(benhNhanId, document.id);
      await fetchDocuments();
      messageApi.success("Đã xóa tài liệu thành công.");
    } catch (err) {
      messageApi.error(getApiErrorMessage(err, "Xóa tài liệu thất bại."));
    }
  }

  function handleFormChange(field, value) {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleUpload(file) {
    setFileList([file]);
    return false;
  }

  function handleRemoveUpload() {
    setFileList([]);
  }

  function resetForm(targetPhieuKhamId = phieuKhamId) {
    setFormState(createEmptyForm(targetPhieuKhamId));
    setFileList([]);
  }

  function handleOpenAddModal(isLocked = false) {
    if (isLocked) {
      return;
    }
    resetForm(phieuKhamId);
    setIsAddModalOpen(true);
  }

  function handleOpenEditModal(document, isLocked = false) {
    if (isLocked) {
      return;
    }

    setFormState({
      id: document.id,
      ma_tai_lieu: document.ma_tai_lieu,
      phieu_kham_id: document.phieu_kham_id,
      loai_tai_lieu: document.loai_tai_lieu,
      ten_tai_lieu: document.ten_tai_lieu,
      ngay_tao: document.ngay_tao,
      ghi_chu: document.ghi_chu ?? "",
    });
    setFileList([]);
    setIsEditModalOpen(true);
  }

  function validateForm() {
    if (!phieuKhamId) {
      messageApi.error("Thiếu phiếu khám ngữ cảnh. Vui lòng quay lại và chọn phiếu khám.");
      return false;
    }

    if (!formState.loai_tai_lieu || !formState.ten_tai_lieu || !formState.ngay_tao) {
      messageApi.error("Vui lòng nhập đủ thông tin bắt buộc.");
      return false;
    }

    return true;
  }

  async function handleCreateDocument() {
    if (!validateForm()) {
      return;
    }

    const uploadFile = fileList?.[0]?.originFileObj ?? fileList?.[0];

    if (!uploadFile) {
      messageApi.error("Vui lòng chọn tệp để upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createHoSoTaiLieu(benhNhanId, {
        per_page: 100,
        phieu_kham_id: phieuKhamId,
        loai_tai_lieu: formState.loai_tai_lieu,
        ten_tai_lieu: formState.ten_tai_lieu,
        ngay_tao: formState.ngay_tao,
        ghi_chu: formState.ghi_chu || null,
      });

      await uploadHoSoTaiLieuFile(benhNhanId, created.id, uploadFile);
      await fetchDocuments();

      setIsAddModalOpen(false);
      resetForm();
      messageApi.success("Đã tạo và upload tài liệu thành công.");
    } catch (err) {
      messageApi.error(getApiErrorMessage(err, "Không thể tạo tài liệu."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditDocument() {
    if (!validateForm() || !formState.id) {
      return;
    }

    const uploadFile = fileList?.[0]?.originFileObj ?? fileList?.[0];

    setIsSubmitting(true);

    try {
      await updateHoSoTaiLieu(benhNhanId, formState.id, {
        phieu_kham_id: Number(formState.phieu_kham_id ?? phieuKhamId),
        loai_tai_lieu: formState.loai_tai_lieu,
        ten_tai_lieu: formState.ten_tai_lieu,
        ngay_tao: formState.ngay_tao,
        ghi_chu: formState.ghi_chu || null,
      });

      if (uploadFile) {
        await uploadHoSoTaiLieuFile(benhNhanId, formState.id, uploadFile);
      }

      await fetchDocuments();
      setIsEditModalOpen(false);
      messageApi.success("Đã cập nhật tài liệu thành công.");
    } catch (err) {
      messageApi.error(getApiErrorMessage(err, "Không thể cập nhật tài liệu."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSearchChange(event) {
    const nextValue = event.target.value;

    startTransition(() => {
      setKeyword(nextValue);
    });
  }

  return {
    contextHolder,
    documents: hydratedDocuments,
    selectedDocument,
    loading,
    error,
    isSubmitting,
    keyword,
    typeFilter,
    filteredDocuments,
    totalDocuments,
    totalExamResults,
    totalInstructions,
    totalDischarge,
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isPreviewModalOpen,
    detailDocument,
    previewDocument,
    previewUrl,
    previewLoading,
    formState,
    fileList,
    setTypeFilter,
    setKeyword,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    setIsPreviewModalOpen,
    handleSelectDocument,
    handleOpenDetailModal,
    handleOpenPreviewModal,
    handleDeleteDocument,
    handleOpenAddModal,
    handleOpenEditModal,
    handleFormChange,
    handleUpload,
    handleRemoveUpload,
    handleCreateDocument,
    handleEditDocument,
    handleSearchChange,
  };
}
