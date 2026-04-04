function formatPrice(price) {
  if (price == null) return 'Liên hệ'

  return Number(price).toLocaleString('vi-VN') + 'đ'
}

function ServiceCard({ service }) {

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-md bg-teal-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
          Gói khám
        </span>
        <span className="text-lg font-extrabold text-teal-700">{formatPrice(service.price)}</span>
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900">{service.name}</h3>
      {service.specialty_name ? (
        <p className="mb-3 text-sm font-medium text-slate-500">{service.specialty_name}</p>
      ) : null}

      <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-600">
        {service.description_short || 'Chưa có mô tả'}
      </p>

      <div className="mt-auto rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
        Mã gói: <span className="font-semibold text-slate-900">{service.code || 'Đang cập nhật'}</span>
      </div>
    </article>
  )
}

export default ServiceCard
