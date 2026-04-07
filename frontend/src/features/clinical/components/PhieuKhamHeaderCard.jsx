export default function PhieuKhamHeaderCard({
  phieuKham,
  formatDateTime,
  formatStatus,
}) {
  const creatorStaffCode = phieuKham.nguoi_tao?.ma_nhan_vien;
  const creatorName =
    phieuKham.nguoi_tao?.ho_ten ||
    phieuKham.nguoi_tao?.ten ||
    phieuKham.nguoi_tao?.nhan_vien?.ho_ten ||
    phieuKham.nguoi_tao?.email ||
    (creatorStaffCode ? `Nhân viên ${creatorStaffCode}` : "Không xác định");

  return (
    <div className="bg-white rounded-[10px] p-4 mb-3 flex flex-wrap items-center justify-between gap-4" style={{ border: "1px solid #E2E8F0" }}>
      <div>
        <div className="text-sm text-gray-500">Mã phiếu</div>
        <div className="font-semibold text-[#0F172A]">{phieuKham.ma_phieu_kham || `#${phieuKham.id}`}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500">Người tạo</div>
        <div className="text-sm">
          {creatorName}
          {creatorStaffCode ? ` (${creatorStaffCode})` : ""}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-500">Thời gian tiếp nhận</div>
        <div className="text-sm">{formatDateTime(phieuKham.thoi_gian_tiep_nhan)}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500">Trạng thái</div>
        <div className="text-sm font-medium text-[#0F172A]">{formatStatus(phieuKham.trang_thai)}</div>
      </div>
    </div>
  );
}
