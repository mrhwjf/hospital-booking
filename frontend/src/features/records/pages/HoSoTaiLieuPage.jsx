import { useDeferredValue, useState, startTransition } from "react";
import { Tag, message } from "antd";
import {
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  createEmptyForm,
  DOCUMENT_TYPE_OPTIONS,
  INITIAL_DOCUMENTS,
  PHIEU_KHAM_OPTIONS,
} from "../data/recordsData";
import { buildDocumentView } from "../utils/recordsUtils";
import RecordsToolbar from "../components/RecordsToolbar";
import RecordsTable from "../components/RecordsTable";
import DocumentFormModal from "../components/DocumentFormModal";
import DocumentDetailModal from "../components/DocumentDetailModal";

export default function HoSoTaiLieuPage() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [selectedDocumentId, setSelectedDocumentId] = useState(INITIAL_DOCUMENTS[0].id);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formState, setFormState] = useState(createEmptyForm(PHIEU_KHAM_OPTIONS[0].id));
  const [fileList, setFileList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailDocument, setDetailDocument] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const deferredKeyword = useDeferredValue(keyword.trim().toLowerCase());

  const hydratedDocuments = documents.map(buildDocumentView);
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
      document.file_name,
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

  function resetForm(nextPhieuKhamId = PHIEU_KHAM_OPTIONS[0].id) {
    setFormState({
      ...createEmptyForm(nextPhieuKhamId),
      phieu_kham_id: nextPhieuKhamId,
      ma_tai_lieu: `TL-2026-${String(documents.length + 1).padStart(3, "0")}`,
    });
    setFileList([]);
  }

  function handleSelectDocument(document) {
    setSelectedDocumentId(document.id);
    setFormState({
      id: document.id,
      ma_tai_lieu: document.ma_tai_lieu,
      phieu_kham_id: document.phieu_kham_id,
      loai_tai_lieu: document.loai_tai_lieu,
      ten_tai_lieu: document.ten_tai_lieu,
      file_url: document.file_url,
      file_name: document.file_name,
      ngay_tao: document.ngay_tao,
      ghi_chu: document.ghi_chu || "",
    });
    setFileList(document.file_name ? [{ uid: String(document.id), name: document.file_name, status: "done" }] : []);
  }

  function handleOpenAddModal() {
    const referencePhieuKhamId = selectedDocument?.phieu_kham_id || PHIEU_KHAM_OPTIONS[0].id;
    resetForm(referencePhieuKhamId);
    setIsAddModalOpen(true);
  }

  function handleOpenEditModal(document) {
    handleSelectDocument(document);
    setIsEditModalOpen(true);
  }

  function handleOpenDetailModal(document) {
    setDetailDocument(document);
    setIsDetailModalOpen(true);
  }

  function handleDeleteDocument(document) {
    setDocuments((prev) => prev.filter((item) => item.id !== document.id));

    if (selectedDocumentId === document.id) {
      const fallback = documents.find((item) => item.id !== document.id);
      setSelectedDocumentId(fallback?.id || null);
    }

    messageApi.open({
      type: "success",
      content: "Đã xóa tài liệu thành công.",
      duration: 5,
    });
  }

  function handleFormChange(field, value) {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleUpload(file) {
    setFileList([file]);
    setFormState((prev) => ({
      ...prev,
      file_name: file.name,
      file_url: `local:///${encodeURIComponent(file.name)}`,
    }));

    return false;
  }

  function handleRemoveUpload() {
    setFileList([]);
    setFormState((prev) => ({
      ...prev,
      file_name: "",
      file_url: "",
    }));
  }

  function handleSearchChange(event) {
    const nextValue = event.target.value;

    startTransition(() => {
      setKeyword(nextValue);
    });
  }

  function validateDocumentForm() {
    if (!formState.ma_tai_lieu || !formState.ten_tai_lieu || !formState.file_name) {
      messageApi.open({
        type: "error",
        content: "Vui lòng nhập đầy đủ mã tài liệu, tên tài liệu và thông tin tệp.",
        duration: 5,
      });
      return false;
    }

    return true;
  }

  function handleSaveNewDocument() {
    if (!validateDocumentForm()) {
      return;
    }

    const payload = {
      id: Date.now(),
      ma_tai_lieu: formState.ma_tai_lieu,
      phieu_kham_id: Number(formState.phieu_kham_id),
      loai_tai_lieu: formState.loai_tai_lieu,
      ten_tai_lieu: formState.ten_tai_lieu,
      file_url: formState.file_url || `local:///${encodeURIComponent(formState.file_name)}`,
      file_name: formState.file_name,
      ngay_tao: formState.ngay_tao,
      ghi_chu: formState.ghi_chu,
    };

    setDocuments((prev) => [payload, ...prev]);
    setSelectedDocumentId(payload.id);
    messageApi.open({
      type: "success",
      content: "Đã thêm tài liệu mới vào kho lưu trữ.",
      duration: 5,
    });
    setIsAddModalOpen(false);
    resetForm(payload.phieu_kham_id);
  }

  function handleSaveEditedDocument() {
    if (!validateDocumentForm() || !formState.id) {
      return;
    }

    const payload = {
      id: formState.id,
      ma_tai_lieu: formState.ma_tai_lieu,
      phieu_kham_id: Number(formState.phieu_kham_id),
      loai_tai_lieu: formState.loai_tai_lieu,
      ten_tai_lieu: formState.ten_tai_lieu,
      file_url: formState.file_url || `local:///${encodeURIComponent(formState.file_name)}`,
      file_name: formState.file_name,
      ngay_tao: formState.ngay_tao,
      ghi_chu: formState.ghi_chu,
    };

    setDocuments((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
    setSelectedDocumentId(payload.id);
    setIsEditModalOpen(false);
    messageApi.open({
      type: "success",
      content: "Đã cập nhật tài liệu thành công.",
      duration: 5,
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

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 flex flex-col gap-6">
            <RecordsTable
              documents={filteredDocuments}
              selectedDocumentId={selectedDocument?.id}
              onSelect={handleSelectDocument}
              onDetail={handleOpenDetailModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>

        <DocumentFormModal
          open={isAddModalOpen}
          title="Thêm tài liệu mới"
          formState={formState}
          fileList={fileList}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
          phieuKhamOptions={PHIEU_KHAM_OPTIONS}
          onChange={handleFormChange}
          onUpload={handleUpload}
          onRemoveUpload={handleRemoveUpload}
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={handleSaveNewDocument}
          submitText="Lưu tài liệu"
        />

        <DocumentFormModal
          open={isEditModalOpen}
          title="Sửa tài liệu"
          formState={formState}
          fileList={fileList}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
          phieuKhamOptions={PHIEU_KHAM_OPTIONS}
          onChange={handleFormChange}
          onUpload={handleUpload}
          onRemoveUpload={handleRemoveUpload}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleSaveEditedDocument}
          submitText="Lưu cập nhật"
        />

        <DocumentDetailModal
          open={isDetailModalOpen}
          document={detailDocument}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
}