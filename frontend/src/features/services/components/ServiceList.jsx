import ServiceCard from './ServiceCard'

function ServiceList({ services, expandedMap, onToggleExpand }) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Chưa có gói khám phù hợp với chuyên khoa đã chọn.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          expanded={Boolean(expandedMap[service.id])}
          key={service.id}
          onToggleExpand={() => onToggleExpand(service.id)}
          service={service}
        />
      ))}
    </div>
  )
}

export default ServiceList
