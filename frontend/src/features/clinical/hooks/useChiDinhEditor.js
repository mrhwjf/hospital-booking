import { useEffect, useMemo, useState } from "react";
import { createChiDinh, getChiDinhList, getDichVuList, getPhieuKham } from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";

function mergeNotes(currentNote, nextNote) {
  const first = String(currentNote || "").trim();
  const second = String(nextNote || "").trim();

  if (!first) {
    return second;
  }

  if (!second || first === second) {
    return first;
  }

  return `${first} | ${second}`;
}

function toSafeQuantity(value) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return 1;
  }

  return Math.max(1, Math.trunc(normalized));
}

function toPositiveInt(value) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return null;
  }

  return Math.trunc(normalized);
}

function resolveBookedKey(item) {
  const dichVuId = toPositiveInt(item?.dich_vu_id ?? item?.dich_vu?.id);
  if (dichVuId) {
    return `dich_vu:${dichVuId}`;
  }

  const goiKhamId = toPositiveInt(item?.goi_kham_id ?? item?.goi_kham?.id);
  if (goiKhamId) {
    return `goi_kham:${goiKhamId}`;
  }

  return null;
}

function resolveChiDinhKey(item) {
  const dichVuId = toPositiveInt(item?.dich_vu_id ?? item?.dich_vu?.id);
  if (dichVuId) {
    return `dich_vu:${dichVuId}`;
  }

  const goiKhamId = toPositiveInt(item?.goi_kham_id ?? item?.goi_kham?.id);
  if (goiKhamId) {
    return `goi_kham:${goiKhamId}`;
  }

  return null;
}

function createFallbackCatalogItemFromBooked(item) {
  const key = resolveBookedKey(item);
  if (!key) {
    return null;
  }

  const isPackage = key.startsWith("goi_kham:");
  const entityId = toPositiveInt(item?.goi_kham_id ?? item?.dich_vu_id ?? item?.goi_kham?.id ?? item?.dich_vu?.id);

  return {
    key,
    id: entityId,
    entityId,
    type: isPackage ? "goi_kham" : "dich_vu",
    code: isPackage ? (item?.goi_kham?.ma_goi_kham || "") : (item?.dich_vu?.ma_dich_vu || ""),
    name: isPackage
      ? (item?.goi_kham?.ten_goi_kham || `Gói khám #${entityId}`)
      : (item?.dich_vu?.ten_dich_vu || `Dịch vụ #${entityId}`),
    price: Number(
      isPackage
        ? (item?.goi_kham?.gia_goi_kham ?? 0)
        : (item?.dich_vu?.gia_dich_vu ?? 0)
    ),
    category: isPackage ? "Gói khám" : "Khác",
    specialtyId: null,
    specialtyIds: [],
    specialtyName: "",
    dichVuId: isPackage ? null : entityId,
    goiKhamId: isPackage ? entityId : null,
  };
}

function createFallbackCatalogItemFromChiDinh(item) {
  const key = resolveChiDinhKey(item);
  if (!key) {
    return null;
  }

  const isPackage = key.startsWith("goi_kham:");
  const entityId = toPositiveInt(item?.goi_kham_id ?? item?.dich_vu_id ?? item?.goi_kham?.id ?? item?.dich_vu?.id);

  return {
    key,
    id: entityId,
    entityId,
    type: isPackage ? "goi_kham" : "dich_vu",
    code: isPackage ? (item?.goi_kham?.ma_goi_kham || "") : (item?.dich_vu?.ma_dich_vu || ""),
    name: isPackage
      ? (item?.goi_kham?.ten_goi_kham || `Gói khám #${entityId}`)
      : (item?.dich_vu?.ten_dich_vu || `Dịch vụ #${entityId}`),
    price: Number(
      isPackage
        ? (item?.goi_kham?.gia_goi_kham ?? 0)
        : (item?.dich_vu?.gia_dich_vu ?? 0)
    ),
    category: isPackage ? "Gói khám" : "Khác",
    specialtyId: null,
    specialtyIds: [],
    specialtyName: "",
    dichVuId: isPackage ? null : entityId,
    goiKhamId: isPackage ? entityId : null,
  };
}

function mapBookedItemsToDraft(bookedItems = [], services = []) {
  const serviceMap = new Map((services || []).map((item) => [item.key, item]));
  const draftMap = new Map();

  for (const item of bookedItems || []) {
    const key = resolveBookedKey(item);
    if (!key) {
      continue;
    }

    const catalogService = serviceMap.get(key) || createFallbackCatalogItemFromBooked(item);
    if (!catalogService) {
      continue;
    }

    const quantity = toSafeQuantity(item?.so_luong ?? 1);
    const existing = draftMap.get(key);
    const bookedPackageName = item?.goi_kham?.ten_goi_kham || null;

    if (existing) {
      draftMap.set(key, {
        ...existing,
        quantity: existing.quantity + quantity,
        note: mergeNotes(existing.note, item?.ghi_chu),
        bookedPackageName: existing.bookedPackageName || bookedPackageName,
      });
      continue;
    }

    draftMap.set(key, {
      ...catalogService,
      quantity,
      note: String(item?.ghi_chu || "").trim(),
      isBooked: true,
      bookedPackageName,
    });
  }

  return Array.from(draftMap.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

function mapExistingItemsToDraft(existingItems = [], services = [], bookedItems = []) {
  const serviceMap = new Map((services || []).map((item) => [item.key, item]));
  const bookedMetaByKey = new Map();

  for (const bookedItem of bookedItems || []) {
    const key = resolveBookedKey(bookedItem);
    if (!key || bookedMetaByKey.has(key)) {
      continue;
    }

    bookedMetaByKey.set(key, {
      bookedPackageName: bookedItem?.goi_kham?.ten_goi_kham || null,
    });
  }

  const draftMap = new Map();

  for (const item of existingItems || []) {
    const key = resolveChiDinhKey(item);
    if (!key) {
      continue;
    }

    const catalogService = serviceMap.get(key) || createFallbackCatalogItemFromChiDinh(item);
    if (!catalogService) {
      continue;
    }

    const existing = draftMap.get(key);
    const bookedMeta = bookedMetaByKey.get(key);
    const quantity = toSafeQuantity(item?.so_luong ?? 1);
    const note = String(item?.ghi_chu || "").trim();

    if (existing) {
      draftMap.set(key, {
        ...existing,
        quantity: existing.quantity + quantity,
        note: mergeNotes(existing.note, note),
        isBooked: existing.isBooked || Boolean(bookedMeta),
        bookedPackageName: existing.bookedPackageName || bookedMeta?.bookedPackageName || null,
      });
      continue;
    }

    draftMap.set(key, {
      ...catalogService,
      quantity,
      note,
      isBooked: Boolean(bookedMeta),
      bookedPackageName: bookedMeta?.bookedPackageName || null,
    });
  }

  return Array.from(draftMap.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export default function useChiDinhEditor({ phieuKhamId, refreshKey = 0 }) {
  const [services, setServices] = useState([]);
  const [bookedItems, setBookedItems] = useState([]);
  const [existingChiDinh, setExistingChiDinh] = useState([]);
  const [phieuKhamStatus, setPhieuKhamStatus] = useState("");
  const [bookingPreloadEnabled, setBookingPreloadEnabled] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [preloadMessage, setPreloadMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEditorData() {
      if (!phieuKhamId) {
        if (mounted) {
          setServices([]);
          setExistingChiDinh([]);
          setSelectedServices([]);
          setLoadingServices(false);
          setLoadingExisting(false);
          setPreloadMessage("");
          setSaveError("Thiếu phiếu khám. Vui lòng chọn phiếu khám để xem/ghi phiếu chỉ định.");
        }
        return;
      }

      setSaveError("");
      setSuccessMessage("");
      setPreloadMessage("");
      setLoadingServices(true);
      setLoadingExisting(true);

      try {
        const [serviceResult, existingResult, phieuKhamResult] = await Promise.all([
          getDichVuList({ phieu_kham_id: phieuKhamId }),
          getChiDinhList(phieuKhamId),
          getPhieuKham(phieuKhamId),
        ]);

        if (mounted) {
          const normalizedServices = serviceResult ?? [];
          const normalizedExisting = existingResult ?? [];
          const normalizedBookedItems = phieuKhamResult?.lich_hen?.dich_vu_lich_hen ?? [];
          const normalizedStatus = String(phieuKhamResult?.trang_thai || "").toLowerCase();
          const isCompletedPhieuKham = normalizedStatus === "hoan_thanh";

          setServices(normalizedServices);
          setExistingChiDinh(normalizedExisting);
          setBookedItems(normalizedBookedItems);
          setPhieuKhamStatus(normalizedStatus);
          setBookingPreloadEnabled(false);

          if (normalizedExisting.length > 0) {
            setSelectedServices(
              mapExistingItemsToDraft(
                normalizedExisting,
                normalizedServices,
                normalizedBookedItems,
              )
            );
            setPreloadMessage("Đã tải chỉ định đã lưu. Bạn có thể tiếp tục chỉnh sửa và lưu lại.");
          } else {
            setSelectedServices([]);

            if (isCompletedPhieuKham) {
              setPreloadMessage("");
            } else {
              setPreloadMessage(
                normalizedBookedItems.length > 0
                  ? `Bệnh nhân đã đặt trước ${normalizedBookedItems.length} dịch vụ/gói khám. Bật tùy chọn nạp từ lịch hẹn để thêm vào danh sách chỉ định.`
                  : "",
              );
            }
          }
        }
      } catch (error) {
        if (mounted) {
          setSaveError(getApiErrorMessage(error, "Không tải được phiếu chỉ định."));
        }
      } finally {
        if (mounted) {
          setLoadingServices(false);
          setLoadingExisting(false);
        }
      }
    }

    loadEditorData();

    return () => {
      mounted = false;
    };
  }, [phieuKhamId, refreshKey]);

  function getDraftItemKey(item) {
    if (item?.key) {
      return item.key;
    }

    const rawType = item?.type === "goi_kham" ? "goi_kham" : "dich_vu";
    const rawId = item?.entityId ?? item?.id;

    return `${rawType}:${rawId}`;
  }

  function toggleBookingPreload(enabled) {
    const hasExisting = existingChiDinh.length > 0;
    const isCompletedPhieuKham = phieuKhamStatus === "hoan_thanh";

    if (hasExisting || isCompletedPhieuKham) {
      setBookingPreloadEnabled(false);
      return;
    }

    setBookingPreloadEnabled(enabled);

    if (!enabled) {
      setSelectedServices((prev) => prev.filter((item) => !item.isBooked));
      return;
    }

    const bookedDraftItems = mapBookedItemsToDraft(bookedItems, services);

    setSelectedServices((prev) => {
      const mergedMap = new Map((prev || []).map((item) => [getDraftItemKey(item), item]));

      for (const bookedItem of bookedDraftItems) {
        const key = getDraftItemKey(bookedItem);
        const existing = mergedMap.get(key);

        if (!existing) {
          mergedMap.set(key, bookedItem);
          continue;
        }

        mergedMap.set(key, {
          ...existing,
          isBooked: true,
          bookedPackageName: existing.bookedPackageName || bookedItem.bookedPackageName || null,
          note: existing.note || bookedItem.note || "",
        });
      }

      return Array.from(mergedMap.values());
    });
  }

  async function handleSaveChiDinh() {
    setIsSaving(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      if (!phieuKhamId) {
        setSaveError("Thiếu phiếu khám. Không thể lưu chỉ định.");
        return;
      }

      const items = selectedServices.map((service) => ({
        dich_vu_id: service.type === "dich_vu"
          ? toPositiveInt(service.dichVuId ?? service.entityId ?? service.id)
          : null,
        goi_kham_id: service.type === "goi_kham"
          ? toPositiveInt(service.goiKhamId ?? service.entityId ?? service.id)
          : null,
        so_luong: Number(service.quantity ?? 1),
        ghi_chu: String(service.note || "").trim() || null,
      }));

      const savedItems = await createChiDinh(phieuKhamId, { items });
      setSuccessMessage(
        selectedServices.length === 0
          ? "Đã xóa toàn bộ chỉ định của phiếu khám."
          : "Đã lưu phiếu chỉ định thành công."
      );
      setPreloadMessage("Đã đồng bộ chỉ định mới nhất. Bạn có thể tiếp tục chỉnh sửa nếu cần.");
      setExistingChiDinh(savedItems);
      setSelectedServices(mapExistingItemsToDraft(savedItems, services, bookedItems));
      setBookingPreloadEnabled(false);
    } catch (error) {
      setSaveError(getApiErrorMessage(error, "Không lưu được phiếu chỉ định."));
    } finally {
      setIsSaving(false);
    }
  }

  const hasExistingChiDinh = useMemo(() => existingChiDinh.length > 0, [existingChiDinh.length]);
  const hasBookedItems = useMemo(() => bookedItems.length > 0, [bookedItems.length]);
  const canLoadBookedItems = useMemo(
    () => hasBookedItems && !hasExistingChiDinh && phieuKhamStatus !== "hoan_thanh",
    [hasBookedItems, hasExistingChiDinh, phieuKhamStatus]
  );

  return {
    services,
    existingChiDinh,
    loadingServices,
    loadingExisting,
    selectedServices,
    isSaving,
    saveError,
    successMessage,
    preloadMessage,
    hasExistingChiDinh,
    hasBookedItems,
    canLoadBookedItems,
    bookingPreloadEnabled,
    setSelectedServices,
    toggleBookingPreload,
    handleSaveChiDinh,
  };
}
