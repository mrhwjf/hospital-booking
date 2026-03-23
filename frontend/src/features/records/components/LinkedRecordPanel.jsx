import { Empty } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import PatientCard from "../../clinical/components/PatientCard";
import { formatDate } from "../utils/recordsUtils";

export default function LinkedRecordPanel({ selectedDocument, selectedPatient, selectedAppointment }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-5 rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <PatientCard patient={selectedPatient} appointment={selectedAppointment} />
      </div>

      <div className="col-span-12 lg:col-span-7 rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
            <FileTextOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Thông tin hồ sơ liên kết</h3>
            <p className="mt-1 text-sm text-slate-500">Từ tài liệu đang chọn, giao diện FE hiển thị nhanh hồ sơ khám và bệnh nhân.</p>
          </div>
        </div>

        {selectedDocument ? (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Mã phiếu khám</div>
              <div className="mt-2 text-base font-semibold text-[#0F172A]">{selectedDocument.phieu_kham?.ma_phieu_kham || `#${selectedDocument.phieu_kham_id}`}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Ngày tạo tài liệu</div>
              <div className="mt-2 text-base font-semibold text-[#0F172A]">{formatDate(selectedDocument.ngay_tao)}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Chẩn đoán / ngữ cảnh hồ sơ</div>
              <div className="mt-2 text-base font-semibold text-[#0F172A]">{selectedDocument.phieu_kham?.chan_doan || "Chưa cập nhật chẩn đoán"}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">{selectedDocument.phieu_kham?.lich_hen?.ly_do_kham || "Không có lý do khám."}</div>
            </div>
          </div>
        ) : (
          <Empty description="Chọn một tài liệu để xem chi tiết liên kết." className="py-10" />
        )}
      </div>
    </div>
  );
}