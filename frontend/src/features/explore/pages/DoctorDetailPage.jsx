import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDoctorById } from '../services/exploreService'

function formatDegreeLabel(value) {
  const mapping = {
    bac_si: 'Bác sĩ',
    thac_si: 'Thạc sĩ',
    tien_si: 'Tiến sĩ',
    pgs: 'Phó giáo sư',
    gs: 'Giáo sư',
  }

  return mapping[value] || value || 'Đang cập nhật'
}

function DoctorDetailPage() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDoctor = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getDoctorById(id)
        setDoctor(response)
      } catch (requestError) {
        setError(requestError?.response?.data?.error?.message || 'Không thể tải thông tin bác sĩ')
      } finally {
        setLoading(false)
      }
    }

    loadDoctor()
  }, [id])

  if (loading) {
    return <main className="min-h-screen bg-slate-50 px-6 py-12">Đang tải hồ sơ bác sĩ...</main>
  }

  if (error || !doctor) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <p className="text-red-600 mb-4">{error || 'Không tìm thấy bác sĩ'}</p>
        <Link className="text-teal-700 font-medium hover:underline" to="/patient/kham-pha/explore">
          Quay lại danh sách
        </Link>
      </main>
    )
  }

  const bookingTarget = `/patient/dat-lich?doctor_id=${doctor.id}${doctor.specialty_id ? `&specialty_id=${doctor.specialty_id}` : ''}`

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="text-teal-700 font-medium hover:underline" to="/patient/kham-pha/explore">
            ← Quay lại danh sách bác sĩ
          </Link>
          <Link
            className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
            to={bookingTarget}
          >
            Đăng ký ngay
          </Link>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                alt={doctor.name}
                className="w-full h-full object-cover"
                src={doctor.avatar || 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=600&auto=format&fit=crop'}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">{doctor.name}</h1>
            <p className="text-teal-700 font-semibold">{doctor.specialty || 'Chưa cập nhật chuyên khoa'}</p>
            <p className="text-sm text-slate-500">
              Mã bác sĩ: <span className="font-semibold text-slate-700">{doctor.code || 'Đang cập nhật'}</span>
            </p>
            <p className="text-slate-600 leading-relaxed">
              {doctor.description || 'Thông tin mô tả đang được cập nhật.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Kinh nghiệm</p>
                <p className="text-lg font-semibold text-slate-900">
                  {typeof doctor.experience === 'number' ? `${doctor.experience} năm` : 'Đang cập nhật'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Học vị</p>
                <p className="text-lg font-semibold text-slate-900">{formatDegreeLabel(doctor.degree)}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Bệnh viện / Phòng khám</p>
                <p className="text-lg font-semibold text-slate-900">{doctor.hospital_clinic || 'Đang cập nhật'}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">Số điện thoại</p>
                <p className="text-lg font-semibold text-slate-900">{doctor.phone || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Email</p>
              <p className="text-lg font-semibold text-slate-900 break-all">{doctor.email || 'Đang cập nhật'}</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Chứng chỉ hành nghề</p>
              <p className="font-semibold text-slate-900">{doctor.practice_certificate || 'Đang cập nhật'}</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Các chuyên khoa phụ trách</h2>
              {!doctor.specialties?.length ? (
                <p className="text-sm text-slate-500">Chưa có dữ liệu chuyên khoa.</p>
              ) : (
                <div className="space-y-3">
                  {doctor.specialties.map((specialty) => (
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3" key={specialty.id}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{specialty.name}</p>
                        {specialty.is_main ? (
                          <span className="text-[11px] font-bold uppercase tracking-wider rounded bg-teal-100 text-teal-700 px-2 py-1">
                            Chuyên khoa chính
                          </span>
                        ) : null}
                      </div>

                      {specialty.description ? (
                        <p className="text-sm text-slate-600 mb-2">{specialty.description}</p>
                      ) : null}

                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        {specialty.location ? <span>Vị trí: {specialty.location}</span> : null}
                        {specialty.phone ? <span>SĐT chuyên khoa: {specialty.phone}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DoctorDetailPage
