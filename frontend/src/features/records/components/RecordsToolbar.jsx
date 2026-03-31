import { Button, Input, Select } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

export default function RecordsToolbar({
  keyword,
  onKeywordChange,
  typeFilter,
  onTypeFilterChange,
  onReset,
  onAdd,
  documentTypeOptions,
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <Input
          size="large"
          value={keyword}
          onChange={onKeywordChange}
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Tìm theo mã tài liệu, tên tài liệu, mã bệnh nhân, tên bệnh nhân..."
          className="xl:flex-1"
        />

        <Select
          size="large"
          value={typeFilter}
          onChange={onTypeFilterChange}
          options={[{ value: "all", label: "Tất cả loại tài liệu" }, ...documentTypeOptions]}
          className="w-full xl:w-[260px] xl:shrink-0"
        />

        <div className="flex flex-wrap gap-3 xl:ml-auto xl:shrink-0">
          <Button size="large" icon={<ReloadOutlined />} onClick={onReset}>
            Đặt lại lọc
          </Button>
          {onAdd ? (
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={onAdd}>
              Thêm tài liệu
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}