import { ClockCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";

export default function LichSuKhamFilters({
  keyword,
  onKeywordChange,
  timeFilter,
  onTimeFilterChange,
  doctorFilter,
  onDoctorFilterChange,
  specialtyFilter,
  onSpecialtyFilterChange,
  doctors,
  specialties,
}) {
  const doctorOptions = [
    { label: "Bác sĩ: Tất cả", value: "all" },
    ...doctors.map((doctor) => ({
      label: doctor.ho_ten,
      value: String(doctor.id),
    })),
  ];

  const specialtyOptions = [
    { label: "Chuyên khoa: Tất cả", value: "all" },
    ...specialties.map((specialty) => ({
      label: specialty.ten_chuyen_khoa,
      value: String(specialty.id),
    })),
  ];

  const timeOptions = [
    { label: "Thời gian: Tất cả", value: "all" },
    { label: "30 ngày gần đây", value: "30d" },
    { label: "90 ngày gần đây", value: "90d" },
    { label: "12 tháng gần đây", value: "365d" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <Form layout="vertical">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <Form.Item className="md:col-span-5 mb-0" label="Tìm kiếm">
            <Input
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              className="h-11"
              placeholder="Tìm kiếm theo bác sĩ hoặc chẩn đoán..."
              allowClear
            />
          </Form.Item>

          <Form.Item className="md:col-span-2 mb-0" label="Khoảng thời gian">
            <Select
              value={timeFilter}
              onChange={onTimeFilterChange}
              options={timeOptions}
              suffixIcon={<ClockCircleOutlined className="text-slate-500" />}
              className="h-11"
            />
          </Form.Item>

          <Form.Item className="md:col-span-2 mb-0" label="Bác sĩ">
            <Select
              value={doctorFilter}
              onChange={onDoctorFilterChange}
              options={doctorOptions}
              suffixIcon={<UserOutlined className="text-slate-500" />}
              className="h-11"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item className="md:col-span-3 mb-0" label="Chuyên khoa">
            <Select
              value={specialtyFilter}
              onChange={onSpecialtyFilterChange}
              options={specialtyOptions}
              className="h-11"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
