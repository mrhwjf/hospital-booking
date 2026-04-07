export function formatDate(input) {
  if (!input) {
    return "--/--/----";
  }

  const date = new Date(input);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatMonthTag(input) {
  if (!input) {
    return { monthLabel: "TH", dayLabel: "--" };
  }

  const date = new Date(input);
  return {
    monthLabel: `TH${String(date.getMonth() + 1).padStart(2, "0")}`,
    dayLabel: String(date.getDate()).padStart(2, "0"),
  };
}

export function getTrangThaiLabel(trangThai) {
  if (trangThai === "hoan_thanh") {
    return "Đã hoàn thành";
  }
  if (trangThai === "dang_kham") {
    return "Đang khám";
  }

  return "Tiếp nhận";
}
