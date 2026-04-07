import { Button, Input, Tag } from "antd";
import { DeleteOutlined, SaveOutlined, SnippetsOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function formatVnd(price) {
  return `${price.toLocaleString("vi-VN")} VNĐ`;
}

export default function SelectedServices({
  services,
  setSelectedServices,
  onSave,
  isSaving = false,
  isLocked = false,
}) {
  function getServiceKey(service) {
    if (service?.key) {
      return service.key;
    }

    const rawType = service?.type === "goi_kham" ? "goi_kham" : "dich_vu";
    const rawId = service?.entityId ?? service?.id;

    return `${rawType}:${rawId}`;
  }

  const subtotal = services.reduce(
    (total, service) => total + service.price * (service.quantity ?? 1),
    0
  );

  function updateQuantity(serviceKey, quantity) {
    if (isLocked) {
      return;
    }

    const safeQuantity = Number.isNaN(Number(quantity)) ? 1 : Math.max(1, Number(quantity));

    setSelectedServices((prev) =>
      prev.map((item) =>
        getServiceKey(item) === serviceKey
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );
  }

  function updateNote(serviceKey, note) {
    if (isLocked) {
      return;
    }

    setSelectedServices((prev) =>
      prev.map((item) =>
        getServiceKey(item) === serviceKey
          ? { ...item, note }
          : item
      )
    );
  }

  return (
    <div
      className="bg-white rounded-[10px] p-5 h-full flex flex-col"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SnippetsOutlined style={{ color: "#0F766E", fontSize: 16 }} />
          <h2 className="text-[28px] leading-none font-semibold text-[#0F172A]">
            Dịch vụ đã chọn
          </h2>
        </div>

        {!isLocked ? (
          <button
            type="button"
            onClick={() => setSelectedServices([])}
            className="text-sm"
            style={{ color: "#DC2626" }}
          >
            Xóa tất cả
          </button>
        ) : (
          <Tag color="default">Chế độ chỉ xem</Tag>
        )}
      </div>

      <div className="flex-1 space-y-5 mb-6">
        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Chưa chọn dịch vụ nào. Bạn vẫn có thể bấm Lưu chỉ định để xóa toàn bộ chỉ định hiện có.
          </div>
        ) : null}

        {services.map((service, index) => {
          const serviceKey = getServiceKey(service);

          return (
            <div
              key={serviceKey}
              className="rounded-lg px-4 py-3 flex items-start justify-between"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-md text-xs flex items-center justify-center font-semibold"
                  style={{ background: "#D1FAE5", color: "#0F766E" }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B] leading-tight mb-1">
                    {service.name}
                  </p>
                  {/* {service.isBooked ? (
                    <Tag color="cyan" className="mb-2">
                      Đặt từ lịch hẹn{service.bookedPackageName ? ` • ${service.bookedPackageName}` : ""}
                    </Tag>
                  ) : null} */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="w-7 h-7 rounded border border-slate-300 text-slate-700"
                      onClick={() => updateQuantity(serviceKey, (service.quantity ?? 1) - 1)}
                      disabled={isLocked}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={service.quantity ?? 1}
                      onChange={(event) => updateQuantity(serviceKey, event.target.value)}
                      className="w-16 text-center text-sm border border-slate-300 rounded py-1"
                      disabled={isLocked}
                    />
                    <button
                      type="button"
                      className="w-7 h-7 rounded border border-slate-300 text-slate-700"
                      onClick={() => updateQuantity(serviceKey, (service.quantity ?? 1) + 1)}
                      disabled={isLocked}
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3">
                    <TextArea
                      rows={2}
                      value={service.note || ""}
                      onChange={(event) => updateNote(serviceKey, event.target.value)}
                      placeholder="Ghi chú chỉ định cho dịch vụ này"
                      disabled={isLocked}
                      style={{ borderRadius: 8, borderColor: "#CBD5E1", resize: "none" }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-semibold text-[#1E293B] mb-1">
                  {formatVnd((service.price ?? 0) * (service.quantity ?? 1))}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedServices((prev) =>
                      prev.filter((item) => getServiceKey(item) !== serviceKey)
                    )
                  }
                  style={{ color: "#DC2626" }}
                  disabled={isLocked}
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>Tạm tính:</span>
          <span>{formatVnd(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>Tổng số chỉ định:</span>
          <span className="font-semibold text-[#0F172A]">{services.length} dịch vụ</span>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-dashed border-[#E2E8F0] mb-4">
          <span className="text-[28px] leading-none font-semibold text-[#0F172A]">Thành tiền:</span>
          <span className="text-[36px] leading-none font-bold" style={{ color: "#0F766E" }}>
            {formatVnd(subtotal)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* <Button size="large" icon={<FileTextOutlined />}>
            In nhãn
          </Button> */}
          <Button
            size="large"
            type="primary"
            icon={<SaveOutlined />}
            style={{ background: "#0F766E" }}
            onClick={onSave}
            loading={isSaving}
            disabled={isSaving || isLocked}
          >
            Lưu chỉ định
          </Button>
        </div>
      </div>
    </div>
  );
}