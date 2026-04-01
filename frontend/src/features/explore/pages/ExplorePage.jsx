import { useEffect, useMemo, useState } from 'react'
import DoctorCard from '../components/DoctorCard'
import { getDoctors, getSpecialties } from '../services/exploreService'

function ExplorePage() {
  const [allDoctors, setAllDoctors] = useState([])
  const [specialtyList, setSpecialtyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  const specialties = useMemo(() => {
    const bucket = new Map()

    allDoctors.forEach((doctor) => {
      if (doctor.specialty_id && doctor.specialty) {
        bucket.set(String(doctor.specialty_id), doctor.specialty)
      }
    })

    return Array.from(bucket.entries()).map(([id, name]) => ({ id, name }))
  }, [allDoctors])

  const doctors = useMemo(() => {
    if (selectedSpecialty === 'all') {
      return allDoctors
    }

    return allDoctors.filter((doctor) => String(doctor.specialty_id) === String(selectedSpecialty))
  }, [allDoctors, selectedSpecialty])

  const loadDoctors = async () => {
    setLoading(true)
    setError('')

    try {
      const [doctorResult, specialtyResult] = await Promise.all([getDoctors(), getSpecialties()])
      setAllDoctors(doctorResult.data || [])
      setSpecialtyList(specialtyResult.data || [])
    } catch (requestError) {
      setError(requestError?.response?.data?.error?.message || 'Không thể tải danh sách bác sĩ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const specialtyStats = useMemo(() => {
    return specialtyList.map((specialty) => {
      const doctorCount = allDoctors.filter((doctor) =>
        (doctor.specialties || []).some((item) => String(item.id) === String(specialty.id)),
      ).length

      return {
        ...specialty,
        doctor_count: doctorCount,
      }
    })
  }, [allDoctors, specialtyList])

  // Lấy thông tin chuyên khoa được chọn
  const selectedSpecialtyData = useMemo(() => {
    if (selectedSpecialty === 'all') {
      return null
    }
    
    return specialtyStats.find((specialty) => String(specialty.id) === String(selectedSpecialty))
  }, [specialtyStats, selectedSpecialty])

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Khám phá <span className="text-teal-700 italic">chuyên khoa & bác sĩ</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Tìm bác sĩ phù hợp theo chuyên khoa, xem hồ sơ chuyên môn và kinh nghiệm để đặt lịch khám nhanh chóng.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                alt="Clinic"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <aside className="xl:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h5 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Lọc theo chuyên khoa</h5>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2" htmlFor="specialty-select">
                Chuyên khoa
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 shadow-sm transition hover:border-teal-500 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100"
                  id="specialty-select"
                  onChange={(event) => setSelectedSpecialty(event.target.value)}
                  value={selectedSpecialty}
                >
                  <option value="all">Tất cả</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
              </div>
            </div>

            {selectedSpecialty !== 'all' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Thông tin chuyên khoa</h5>
                
                {selectedSpecialtyData ? (
                  <article className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h6 className="font-semibold text-slate-900 leading-snug text-lg">{selectedSpecialtyData.name}</h6>
                      <span className="text-xs font-bold rounded bg-teal-50 text-teal-700 px-2 py-1">
                        {selectedSpecialtyData.doctor_count} bác sĩ
                      </span>
                    </div>

                    {selectedSpecialtyData.description ? (
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedSpecialtyData.description}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Mô tả chuyên khoa đang cập nhật.</p>
                    )}

                    {selectedSpecialtyData.mo_ta && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedSpecialtyData.mo_ta}</p>
                      </div>
                    )}
                  </article>
                ) : (
                  <p className="text-sm text-slate-500">Không tìm thấy thông tin chuyên khoa.</p>
                )}
              </div>
            )}
          </aside>

          <div className="xl:col-span-8">
            <div className="flex items-end justify-between mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Danh sách bác sĩ</h3>
              <p className="text-sm text-slate-500 font-medium">Sắp xếp: Kinh nghiệm cao trước</p>
            </div>

            {loading && <p className="text-slate-500">Đang tải dữ liệu...</p>}
            {!loading && error && <p className="text-red-600">{error}</p>}

            {!loading && !error && doctors.length === 0 && (
              <p className="text-slate-500">Không có bác sĩ phù hợp với bộ lọc hiện tại.</p>
            )}

            <div className="grid grid-cols-1 gap-6">
              {!loading && !error && doctors.map((doctor) => (
                <DoctorCard doctor={doctor} key={doctor.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ExplorePage
