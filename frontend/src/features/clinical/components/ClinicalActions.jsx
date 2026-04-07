import { Button, message } from "antd";

export default function ClinicalActions({ services = [], type, onSubmit, onEdit, disabled = false, isEditing = false, isSaving = false }) {

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
      return;
    }

    if (type === "chi-dinh") {

      console.log("Danh sách dịch vụ:", services);

      if (services.length === 0) {
        message.warning("Chưa chọn dịch vụ!");
        return;
      }

      message.success("Đã gửi chỉ định!");

    }

    if (type === "phieu-kham") {

      message.success("Đã lưu phiếu khám!");

    }

  };

  return (

    <div className={type === "phieu-kham" ? "px-5 pt-3 flex justify-end gap-3" : "bg-white rounded-xl shadow p-6 mt-6 flex justify-end"}>

      {type === "phieu-kham" && (
        <Button size="large" onClick={onEdit} disabled={isSaving}>
          {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa phiếu khám"}
        </Button>
      )}

      <Button
        type="primary"
        size="large"
        loading={isSaving}
        disabled={disabled || (type === "phieu-kham" && !onSubmit)}
        onClick={handleSubmit}
      >
        {type === "chi-dinh" ? "Gửi chỉ định" : "Lưu phiếu khám"}
      </Button>

    </div>

  );

}