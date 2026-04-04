import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getServiceById } from '../services/servicesApi'

function formatPrice(price) {
  if (price == null) return 'Liên hệ'
  return Number(price).toLocaleString('vi-VN') + 'đ'
}

function formatServiceType(type) {
  const mapping = {
    kham_benh: 'Khám bệnh',
    xet_nghiem: 'Xét nghiệm',
    chan_doan_hinh_anh: 'Chẩn đoán hình ảnh',
    thu_thuat: 'Thủ thuật',
    phau_thuat: 'Phẫu thuật',
    khac: 'Khác',
  }
  return mapping[type] || type || 'Chưa phân loại'
}

function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDetail() {
      setLoading(true)
      setError('')
      try {
        const response = await getServiceById(id)
        if (!mounted) return
        setService(response?.data || null)
      } catch (e) {
        if (!mounted) return
        setError(e?.response?.data?.message || 'Không thể tải chi tiết gói khám.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDetail()

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <main className="p-8">Đang tải chi tiết...</main>
  if (error) return <main className="p-8 text-rose-700">{error}</main>
  if (!service) return <main className="p-8">Không tìm thấy gói khám.</main>

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link 
          className="inline-flex items-center gap-2 text-teal-700 font-medium hover:underline mb-6"
          to="/services"
        >
          ← Quay lại danh sách
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">{service.name}</h1>
          <p className="mb-6 text-slate-600 text-lg">{service.specialty_name || 'Chưa phân loại chuyên khoa'}</p>

          {/* Thông tin cơ bản */}
          <div className="mb-8 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Giá</p>
              <p className="text-2xl font-bold text-teal-700 mt-1">{formatPrice(service.price)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Thời gian</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{service.duration || '--'} phút</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Loại dịch vụ</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatServiceType(service.service_type)}</p>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Mô tả gói khám</h2>
            <p className="leading-relaxed text-slate-700 whitespace-pre-line">
              {service.description_full || service.description_short || 'Chưa có mô tả chi tiết'}
            </p>
          </div>

          {/* Yêu cầu đặc biệt */}
          {service.special_requirements && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Yêu cầu chuẩn bị</h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {service.special_requirements}
                </p>
              </div>
            </div>
          )}

          {/* Dịch vụ bao gồm trong gói */}
          {service.included_services && service.included_services.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Dịch vụ bao gồm trong gói</h2>
              <div className="space-y-3">
                {service.included_services.map((svc, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 p-4 hover:border-teal-300 hover:bg-teal-50 transition">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{svc.name || svc.ten_dich_vu}</h3>
                        <p className="text-xs text-slate-500 mt-1">Mã: {svc.code || svc.ma_dich_vu}</p>
                      </div>
                      <span className="text-sm font-bold text-teal-700 whitespace-nowrap">
                        {formatPrice(svc.price || svc.gia_dich_vu)}
                      </span>
                    </div>
                    {(svc.description || svc.mo_ta) && (
                      <p className="text-sm text-slate-600 mb-2">{svc.description || svc.mo_ta}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-700">
                        {svc.type || svc.loai_dich_vu ? formatServiceType(svc.type || svc.loai_dich_vu) : 'Dịch vụ'}
                      </span>
                      {svc.expected_time || svc.thoi_gian_du_kien && (
                        <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-700">
                          {svc.expected_time || svc.thoi_gian_du_kien} phút
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {service.total_base_price && service.total_base_price > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Tổng giá dịch vụ:</span>
                    <span className="text-lg font-bold text-slate-900">{formatPrice(service.total_base_price)}</span>
                  </div>
                  {service.price < service.total_base_price && (
                    <div className="flex justify-between items-center text-teal-700 font-semibold mt-2">
                      <span>Tiết kiệm:</span>
                      <span className="text-lg">{formatPrice(service.total_base_price - service.price)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mã dịch vụ & Trạng thái */}
          <div className="mb-8 grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Mã dịch vụ/gói</p>
              <p className="text-sm font-mono text-slate-900 mt-1">{service.code || '--'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Trạng thái</p>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  service.status === 'hoat_dong' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status === 'hoat_dong' ? 'Hoạt động' : 'Tạm ngừng'}
                </span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3">
            <Link
              className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              to={`/booking?service_id=${service.id}`}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ServiceDetailPage
