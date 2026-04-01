import {
  ClockCircleOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-12">
      <div className="relative md:col-span-5">
        <SearchOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm outline-none transition focus:border-teal-600"
          placeholder="Tìm kiếm theo bác sĩ hoặc chẩn đoán..."
        />
      </div>

      <div className="relative md:col-span-2">
        <ClockCircleOutlined className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <select
          value={timeFilter}
          onChange={(event) => onTimeFilterChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-7 text-sm text-slate-700 outline-none transition focus:border-teal-600"
        >
          <option value="all">Thời gian: Tất cả</option>
          <option value="30d">30 ngày gần đây</option>
          <option value="90d">90 ngày gần đây</option>
          <option value="365d">12 tháng gần đây</option>
        </select>
        <DownOutlined className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
      </div>

      <div className="relative md:col-span-2">
        <UserOutlined className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <select
          value={doctorFilter}
          onChange={(event) => onDoctorFilterChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-7 text-sm text-slate-700 outline-none transition focus:border-teal-600"
        >
          <option value="all">Bác sĩ: Tất cả</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.ho_ten}
            </option>
          ))}
        </select>
        <DownOutlined className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
      </div>

      <div className="relative md:col-span-3">
        <select
          value={specialtyFilter}
          onChange={(event) => onSpecialtyFilterChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-7 text-sm text-slate-700 outline-none transition focus:border-teal-600"
        >
          <option value="all">Chuyên khoa: Tất cả</option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.ten_chuyen_khoa}
            </option>
          ))}
        </select>
        <DownOutlined className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
      </div>
    </div>
  );
}
