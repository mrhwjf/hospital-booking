import { FolderOpenOutlined } from "@ant-design/icons";
import {
  DOCUMENT_TYPE_OPTIONS,
} from "../data/recordsData";
import RecordsToolbar from "../components/RecordsToolbar";
import RecordsTable from "../components/RecordsTable";
import DocumentFormModal from "../components/DocumentFormModal";
import DocumentDetailModal from "../components/DocumentDetailModal";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import useHoSoTaiLieuManager from "../hooks/useHoSoTaiLieuManager";

export default function HoSoTaiLieuPage({ benhNhanId, phieuKhamId, isLocked = false, refreshKey = 0 }) {
  const {
    contextHolder,
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
  } = useHoSoTaiLieuManager({
    benhNhanId,
    phieuKhamId,
    refreshKey,
  });

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
                Xem và quản lý các hồ sơ, tài liệu liên quan đến hồ sơ bệnh án này
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-105">
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
          onAdd={() => handleOpenAddModal(isLocked)}
          addDisabled={isLocked}
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
                onEdit={(document) => handleOpenEditModal(document, isLocked)}
                onDelete={(document) => handleDeleteDocument(document, isLocked)}
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