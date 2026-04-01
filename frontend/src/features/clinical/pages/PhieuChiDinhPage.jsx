import ServiceTable from "../components/ServiceTable";
import SelectedServices from "../components/SelectedServices";
import { useEffect, useMemo, useState } from "react";
import { Alert, Spin, Tag } from "antd";
import { createChiDinh, getChiDinhList, getDichVuList } from "../../../Services/clinicalService";

export default function PhieuChiDinhPage({ benhNhanId, phieuKhamId, isLocked = false, refreshKey = 0 }) {

  const [services, setServices] = useState([]);
  const [existingChiDinh, setExistingChiDinh] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      setLoadingServices(true);

      try {
        const items = await getDichVuList();

        if (mounted) {
          setServices(items);
        }
      } catch (error) {
        if (mounted) {
          setSaveError(error.response?.data?.message || "Không tải được danh sách dịch vụ.");
        }
      } finally {
        if (mounted) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadExistingChiDinh() {
      if (!phieuKhamId) {
        if (mounted) {
          setExistingChiDinh([]);
          setLoadingExisting(false);
          setSaveError("Thiếu phiếu khám. Vui lòng chọn phiếu khám để xem/ghi phiếu chỉ định.");
        }
        return;
      }

      setLoadingExisting(true);

      try {
        const items = await getChiDinhList(phieuKhamId);

        if (mounted) {
          setExistingChiDinh(items);
          setSelectedServices([]);
        }
      } catch (error) {
        if (mounted) {
          setSaveError(error.response?.data?.message || "Không tải được phiếu chỉ định.");
        }
      } finally {
        if (mounted) {
          setLoadingExisting(false);
        }
      }
    }

    loadExistingChiDinh();

    return () => {
      mounted = false;
    };
  }, [phieuKhamId, refreshKey]);

  async function handleSaveChiDinh() {
    if (selectedServices.length === 0) {
      setSaveError("Chưa chọn dịch vụ để chỉ định.");
      setSuccessMessage("");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      if (!phieuKhamId) {
        setSaveError("Thiếu phiếu khám. Không thể lưu chỉ định.");
        return;
      }

      const items = selectedServices.map((service) => ({
        dich_vu_id: Number(service.id),
        so_luong: Number(service.quantity ?? 1),
      }));

      const createdItems = await createChiDinh(phieuKhamId, { items });
      setSuccessMessage("Đã lưu phiếu chỉ định thành công.");
      setSelectedServices([]);
      setExistingChiDinh(createdItems);
    } catch (error) {
      setSaveError(error.response?.data?.message || "Không lưu được phiếu chỉ định.");
    } finally {
      setIsSaving(false);
    }
  }

  const pageLabel = useMemo(() => {
    if (!phieuKhamId) {
      return "Chưa chọn";
    }
    return `PK#${phieuKhamId}`;
  }, [phieuKhamId]);

  return (
    <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
      {saveError && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert type="error" showIcon message={saveError} />
        </div>
      )}

      {successMessage && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert type="success" showIcon message={successMessage} />
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="col-span-7 flex flex-col gap-6">
          <div
            className="bg-red rounded-[10px] p-5 border border-slate-200"
          >
            <div className="flex items-start gap-5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                alt="Bệnh nhân"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-[32px] leading-none font-semibold text-slate-900">
                    Nguyễn Văn A
                  </h2>
                  <Tag
                    style={{
                      marginInlineEnd: 0,
                      border: "none",
                      borderRadius: 6,
                      background: "#CCFBF1",
                      color: "#0F766E",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    BHYT: GD479…
                  </Tag>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                  <span>
                    Mã BN: <strong>BN-2024-001</strong>
                  </span>
                  <span>
                    Tuổi: <strong>28 (Nam)</strong>
                  </span>
                  <span>
                    Địa chỉ: <strong>Quận 1, TP.HCM</strong>
                  </span>
                </div>

                <div className="mt-1 rounded-lg px-3 py-2 text-sm font-medium border border-red-200 bg-red-50 text-red-600">
                  ✱ Chẩn đoán sơ bộ: Sốt xuất huyết Dengue ngày 1
                </div>

                <p className="mt-3 text-sm font-medium text-[#0F766E]">
                  Bệnh nhân: BN#{benhNhanId} | Phiếu khám đang xem: {pageLabel}
                </p>
              </div>
            </div>
          </div>

          {loadingServices || loadingExisting ? (
            <div className="bg-white rounded-[10px] p-8 border border-slate-200 flex justify-center">
              <Spin tip="Đang tải dữ liệu chỉ định..." />
            </div>
          ) : existingChiDinh.length > 0 ? (
            <div className="bg-white rounded-[10px] p-5 border border-slate-200">
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-2">Phiếu chỉ định đã lưu</h3>
              <p className="text-sm text-slate-500 mb-4">
                Phiếu khám này đã có phiếu chỉ định. Form tạo mới đã được ẩn để đảm bảo mỗi phiếu khám chỉ có 1 phiếu chỉ định.
              </p>
              <div className="space-y-3">
                {existingChiDinh.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#0F172A]">
                        {index + 1}. {item.dich_vu?.ten_dich_vu || `Dịch vụ #${item.dich_vu_id}`}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Trạng thái: {item.trang_thai} | Ngày chỉ định: {item.ngay_chi_dinh || "-"}
                      </p>
                    </div>
                    <Tag color="cyan">SL: {item.so_luong || 1}</Tag>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ServiceTable
              services={services}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              disabled={isLocked}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="col-span-5">
          {existingChiDinh.length > 0 ? (
            <div className="bg-white rounded-[10px] p-5 h-full border border-slate-200">
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Tóm tắt phiếu chỉ định</h3>
              <p className="text-sm text-slate-500">
                Tổng số dịch vụ: <strong>{existingChiDinh.length}</strong>
              </p>
            </div>
          ) : (
            <SelectedServices
              services={selectedServices}
              setSelectedServices={setSelectedServices}
              onSave={isLocked ? undefined : handleSaveChiDinh}
              isSaving={isSaving || isLocked}
            />
          )}
        </div>
      </div>
    </div>
  );
}