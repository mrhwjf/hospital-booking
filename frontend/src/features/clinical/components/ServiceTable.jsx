import { useMemo, useState } from "react";
import { Input, Pagination } from "antd";
import {
  SearchOutlined,
  PlusCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";

const PAGE_SIZE = 8;

function formatVnd(price) {
  return `${price.toLocaleString("vi-VN")} VNĐ`;
}

export default function ServiceTable({ services = [], selectedServices, setSelectedServices }) {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useMemo(() => {
    const categories = [...new Set((services || []).map((service) => service.category).filter(Boolean))];
    return ["Tất cả", ...categories];
  }, [services]);

  const filteredServices = useMemo(() => {
    return (services || []).filter((service) => {
      const matchKeyword = service.name.toLowerCase().includes(keyword.toLowerCase());
      const matchFilter = activeFilter === "Tất cả" || service.category === activeFilter;
      return matchKeyword && matchFilter;
    });
  }, [services, keyword, activeFilter]);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredServices.slice(start, start + PAGE_SIZE);
  }, [filteredServices, currentPage]);

  function isSelected(serviceId) {
    return selectedServices.some((service) => service.id === serviceId);
  }

  function toggleService(service) {
    if (isSelected(service.id)) {
      setSelectedServices((prev) => prev.filter((item) => item.id !== service.id));
      return;
    }

    setSelectedServices((prev) => [...prev, { ...service, quantity: 1 }]);
  }

  return (
    <div
      className="bg-white rounded-[10px] p-5"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <SearchOutlined style={{ color: "#0F766E", fontSize: 16 }} />
        <h2 className="text-[28px] leading-none font-semibold text-[#0F172A]">
          Tìm kiếm & Chọn nhanh dịch vụ
        </h2>
      </div>

      <Input
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setCurrentPage(1);
        }}
        placeholder="Tìm nhanh: CTM, Glucose, X-Quang phổi..."
        prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
        className="mb-6"
        style={{ borderRadius: 8, borderColor: "#E2E8F0", height: 40 }}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-md text-sm"
              style={{
                border: "1px solid #E2E8F0",
                background: active ? "#0F766E" : "#F1F5F9",
                color: active ? "#FFFFFF" : "#475569",
                fontWeight: active ? 600 : 500,
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {paginatedServices.map((service) => {
          const selected = isSelected(service.id);

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service)}
              className="text-left rounded-[10px] p-4 flex items-center justify-between"
              style={{
                border: "1px solid #D1E5E2",
                background: selected ? "#ECFDF5" : "#FFFFFF",
              }}
            >
              <div>
                <p className="text-base font-semibold text-[#1E293B] leading-tight mb-1">
                  {service.name}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#0F766E" }}>
                  {formatVnd(service.price)}
                </p>
              </div>

              {selected ? (
                <CheckCircleFilled style={{ color: "#0F766E", fontSize: 16 }} />
              ) : (
                <PlusCircleFilled style={{ color: "#CBD5E1", fontSize: 16 }} />
              )}
            </button>
          );
        })}
      </div>

      {filteredServices.length > PAGE_SIZE && (
        <div className="mt-6 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredServices.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}