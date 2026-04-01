import { useDeferredValue, useEffect, useMemo, useState, startTransition } from "react";
import { message } from "antd";
import {
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  DOCUMENT_TYPE_OPTIONS,
  createEmptyForm,
} from "../data/recordsData";
import RecordsToolbar from "../components/RecordsToolbar";
import RecordsTable from "../components/RecordsTable";
import DocumentFormModal from "../components/DocumentFormModal";
import DocumentDetailModal from "../components/DocumentDetailModal";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import {
  createHoSoTaiLieu,
  deleteHoSoTaiLieu,
  getHoSoTaiLieuByBenhNhan,
  getTaiLieuSignedUrl,
  updateHoSoTaiLieu,
  uploadHoSoTaiLieuFile,
} from "../../../Services/clinicalService";

export default function HoSoTaiLieuPage({ benhNhanId, phieuKhamId, isLocked = false, refreshKey = 0 }) {

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

  async function fetchDocuments() {
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
      setError(err?.response?.data?.message ?? err?.message ?? "Không thể tải hồ sơ tài liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, [benhNhanId, phieuKhamId, refreshKey]);

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
        messageApi.error(err?.response?.data?.message ?? "Không thể lấy signed URL.");
      })
      .finally(() => setPreviewLoading(false));
  }

  async function handleDeleteDocument(document) {
    if (isLocked) {
      return;
    }

    try {
      await deleteHoSoTaiLieu(benhNhanId, document.id);
      await fetchDocuments();
      messageApi.success("Đã xóa tài liệu thành công.");
    } catch (err) {
      messageApi.error(err?.response?.data?.message ?? "Xóa tài liệu thất bại.");
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
    const nextForm = createEmptyForm(targetPhieuKhamId);

    setFormState(nextForm);
    setFileList([]);
  }

  function handleOpenAddModal() {
    if (isLocked) {
      return;
    }
    resetForm(phieuKhamId);
    setIsAddModalOpen(true);
  }

  function handleOpenEditModal(document) {
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
      messageApi.error(err?.response?.data?.message ?? "Không thể tạo tài liệu.");
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
      messageApi.error(err?.response?.data?.message ?? "Không thể cập nhật tài liệu.");
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

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "linear-gradient(180deg, #ECFDF5 0%, #F8FAFC 18%, #F8FAFC 100%)" }}>
      {contextHolder}
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="rounded-[20px] border border-[#CCFBF1] bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,118,110,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#99F6E4] bg-[#F0FDFA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F766E]">
                <FolderOpenOutlined />
                Kho hồ sơ số
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A]">
                Quản lí lưu trữ hồ sơ, tài liệu
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Màn hình FE mô phỏng nghiệp vụ lưu trữ tài liệu khám bệnh theo đúng các trường trong bảng tai_lieu_ho_so, đồng thời hiển thị liên kết tới phiếu khám và bệnh nhân tương ứng.
              </p>
              <p className="mt-2 text-sm font-medium text-[#0F766E]">
                Bệnh nhân: BN#{benhNhanId} | Phiếu khám đang xem: {phieuKhamId ? `PK#${phieuKhamId}` : "Chưa chọn"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Tổng tài liệu</div>
                <div className="mt-2 text-3xl font-semibold text-[#0F172A]">{totalDocuments}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Kết quả CLS</div>
                <div className="mt-2 text-3xl font-semibold text-[#2563EB]">{totalExamResults}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Phiếu chỉ định</div>
                <div className="mt-2 text-3xl font-semibold text-[#0891B2]">{totalInstructions}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Giấy ra viện</div>
                <div className="mt-2 text-3xl font-semibold text-[#15803D]">{totalDischarge}</div>
              </div>
            </div>
          </div>
        </div>

        <RecordsToolbar
          keyword={keyword}
          onKeywordChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onReset={() => {
            setKeyword("");
            setTypeFilter("all");
          }}
          onAdd={handleOpenAddModal}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
        />

        {loading ? (
          <div className="rounded-[18px] border border-slate-200 bg-white p-8 text-center text-slate-500">Đang tải hồ sơ tài liệu...</div>
        ) : error ? (
          <div className="rounded-[18px] border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 flex flex-col gap-6">
              <RecordsTable
                documents={filteredDocuments}
                selectedDocumentId={selectedDocument?.id}
                onSelect={handleSelectDocument}
                onPreview={handleOpenPreviewModal}
                onDetail={handleOpenDetailModal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteDocument}
                disabled={isLocked}
              />
            </div>
          </div>
        )}

        <DocumentFormModal
          open={isAddModalOpen}
          title="Thêm hồ sơ tài liệu"
          formState={formState}
          fileList={fileList}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
          onChange={handleFormChange}
          onUpload={handleUpload}
          onRemoveUpload={handleRemoveUpload}
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateDocument}
          submitText="Lưu và upload"
          submitting={isSubmitting}
        />

        <DocumentFormModal
          open={isEditModalOpen}
          title="Sửa hồ sơ tài liệu"
          formState={formState}
          fileList={fileList}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
          onChange={handleFormChange}
          onUpload={handleUpload}
          onRemoveUpload={handleRemoveUpload}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleEditDocument}
          submitText="Lưu cập nhật"
          submitting={isSubmitting}
        />

        <DocumentDetailModal
          open={isDetailModalOpen}
          document={detailDocument}
          onClose={() => setIsDetailModalOpen(false)}
        />

        <DocumentPreviewModal
          open={isPreviewModalOpen}
          document={previewDocument}
          previewUrl={previewUrl}
          loading={previewLoading}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      </div>
    </div>
  );
}