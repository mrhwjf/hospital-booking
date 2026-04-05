import { useEffect, useMemo, useState } from 'react'
import { Pagination } from 'antd'
import { Link } from 'react-router-dom'
import { getServices, getSpecialties } from '../services/servicesApi'

const ITEMS_PER_PAGE = 4

function formatPrice(price) {
  if (price == null) return 'Liên hệ'
  return `${Number(price).toLocaleString('vi-VN')}đ`
}

function ExploreServicesPage() {
  const [specialties, setSpecialties] = useState([])
  const [allServices, setAllServices] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const [specialtyResponse, serviceResponse] = await Promise.all([
          getSpecialties(),
          getServices(),
        ])

        if (!mounted) return

        setSpecialties(Array.isArray(specialtyResponse?.data) ? specialtyResponse.data : [])
        setAllServices(Array.isArray(serviceResponse?.data) ? serviceResponse.data : [])
      } catch (e) {
        if (!mounted) return
        setError(e?.response?.data?.message || 'Không thể tải dữ liệu dịch vụ.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const services = useMemo(() => {
    if (!selectedSpecialty) {
      return allServices
    }

    return allServices.filter(
      (item) => String(item.specialty_id) === String(selectedSpecialty),
    )
  }, [allServices, selectedSpecialty])

  const pagedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return services.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, services])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSpecialty])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(services.length / ITEMS_PER_PAGE))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, services.length])

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-teal-50/30 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
            Chăm sóc chủ động
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Khám phá dịch vụ y tế &amp; gói khám
          </h1>
          <p className="max-w-3xl text-slate-600">
            Chọn chuyên khoa để xem các gói khám phù hợp với nhu cầu. Danh sách được trình bày ngắn gọn,
            tập trung vào tên gói, chuyên khoa và mức giá tham khảo.
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap gap-3">
            <button
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedSpecialty === ''
                  ? 'border-teal-700 bg-teal-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700'
                }`}
              onClick={() => setSelectedSpecialty('')}
              type="button"
            >
              Tất cả
            </button>

            {specialties.map((specialty) => (
              <button
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${String(selectedSpecialty) === String(specialty.id)
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700'
                  }`}
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                type="button"
              >
                {specialty.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            Đang tải dịch vụ...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
        ) : (
          <>
            {!services.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                Chưa có dịch vụ hoặc gói khám phù hợp với chuyên khoa đã chọn.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pagedServices.map((service) => {
                    const isStandaloneService = service.catalog_type === 'dich_vu'
                    const badgeLabel = isStandaloneService ? 'Dịch vụ' : 'Gói khám'
                    const codeLabel = isStandaloneService ? 'Mã dịch vụ' : 'Mã gói'
                    const bookingTarget = isStandaloneService
                      ? `/patient/dat-lich?service_id=${service.id}${service.specialty_id ? `&specialty_id=${service.specialty_id}` : ''}`
                      : `/patient/dat-lich?package_id=${service.id}${service.specialty_id ? `&specialty_id=${service.specialty_id}` : ''}`

                    return (
                      <article
                        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        key={`${service.catalog_type}-${service.id}`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <span className="rounded-md bg-teal-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                            {badgeLabel}
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
                          {codeLabel}:{' '}
                          <span className="font-semibold text-slate-900">{service.code || 'Đang cập nhật'}</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <Link
                            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
                            to={`/patient/kham-pha/services/${service.id}?type=${service.catalog_type || 'goi_kham'}`}
                          >
                            Xem chi tiết
                          </Link>
                          <Link
                            className="rounded-lg bg-teal-700 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-teal-800"
                            to={bookingTarget}
                          >
                            Đăng ký ngay
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {services.length > ITEMS_PER_PAGE && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={ITEMS_PER_PAGE}
                      total={services.length}
                      onChange={setCurrentPage}
                      hideOnSinglePage
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default ExploreServicesPage
