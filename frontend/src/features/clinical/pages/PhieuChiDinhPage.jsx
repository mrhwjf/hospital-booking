import ServiceTable from "../components/ServiceTable";
import SelectedServices from "../components/SelectedServices";
import { useEffect, useState } from "react";
import { Alert, Spin, Tag } from "antd";
import { createChiDinh, getDichVuList } from "../../../Services/clinicals/phieuChiDinhService";

export default function PhieuChiDinhPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
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
      const params = new URLSearchParams(window.location.search);
      const phieuKhamId = params.get("id") || "1";

      const items = selectedServices.map((service) => ({
        dich_vu_id: Number(service.id),
        so_luong: Number(service.quantity ?? 1),
      }));

      await createChiDinh(phieuKhamId, { items });
      setSuccessMessage("Đã lưu phiếu chỉ định thành công.");
      setSelectedServices([]);
    } catch (error) {
      setSaveError(error.response?.data?.message || "Không lưu được phiếu chỉ định.");
    } finally {
      setIsSaving(false);
    }
  }

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
              </div>
            </div>
          </div>

          {loadingServices ? (
            <div className="bg-white rounded-[10px] p-8 border border-slate-200 flex justify-center">
              <Spin tip="Đang tải dịch vụ..." />
            </div>
          ) : (
            <ServiceTable
              services={services}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="col-span-5">
          <SelectedServices
            services={selectedServices}
            setSelectedServices={setSelectedServices}
            onSave={handleSaveChiDinh}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}