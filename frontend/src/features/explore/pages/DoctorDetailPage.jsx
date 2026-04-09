import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link, useParams } from 'react-router-dom'
import { Alert } from 'antd'
import { getDoctorById } from '../services/exploreService'
import WeeklyScheduleGrid from '../../admin/components/WeeklyScheduleGrid'
import { fetchDoctorSchedule, getApiErrorMessage } from '../../../Services/schedulingService'

const SCHEDULE_WINDOW_DAYS = 30

function toMonday(value = dayjs()) {
  const dayIndex = value.day()
  const offset = dayIndex === 0 ? -6 : 1 - dayIndex
  return value.add(offset, 'day').startOf('day')
}

function buildDoctorDetailScheduleEvents(scheduleItems = []) {
  const shiftEvents = []
  const holidayEvents = []
  const leaveEvents = []

  const holidayKeys = new Set()
  const leaveKeys = new Set()

  scheduleItems.forEach((item, index) => {
    if (!item?.ngay_lam_viec) {
      return
    }

    const date = dayjs(item.ngay_lam_viec).format('YYYY-MM-DD')
    const shift = item?.ca_lam_viec
    if (shift?.gio_bat_dau && shift?.gio_ket_thuc) {
      shiftEvents.push({
        id: `shift-${item.id || `${date}-${index}`}`,
        date,
        startTime: shift.gio_bat_dau,
        endTime: shift.gio_ket_thuc,
        title: shift.ten_ca || 'Ca làm việc',
        subtitle: item?.phong_kham?.ten_phong || item?.phong_kham?.ma_phong || 'Chưa gán phòng',
        type: 'shift',
      })
    }

    const holiday = item?.ngay_nghi_le
    if (holiday?.id || holiday?.ten_ngay_nghi) {
      const holidayKey = `${date}-${holiday.id || holiday.ten_ngay_nghi}`
      if (!holidayKeys.has(holidayKey)) {
        holidayKeys.add(holidayKey)
        holidayEvents.push({
          id: `holiday-${holiday.id || holidayKey}`,
          date,
          startTime: '07:00:00',
          endTime: '17:00:00',
          title: `Nghỉ lễ: ${holiday.ten_ngay_nghi || 'Toàn viện'}`,
          subtitle: 'Ngày nghỉ lễ toàn viện',
          type: 'holiday',
        })
      }
    }

    const leave = item?.ngay_nghi_bac_si
    if (!leave?.co_nghi) {
      return
    }

    if (leave.ca_ngay) {
      const fullDayKey = `${date}-full-day`
      if (!leaveKeys.has(fullDayKey)) {
        leaveKeys.add(fullDayKey)
        leaveEvents.push({
          id: `leave-${fullDayKey}`,
          date,
          startTime: '07:00:00',
          endTime: '17:00:00',
          title: 'Bác sĩ nghỉ cả ngày',
          subtitle: 'Không nhận lịch trong ngày',
          type: 'doctor_leave',
        })
      }
      return
    }

    const leaveRanges = Array.isArray(leave.khung_nghi) ? leave.khung_nghi : []
    if (leaveRanges.length === 0) {
      const fallbackKey = `${date}-unspecified`
      if (!leaveKeys.has(fallbackKey)) {
        leaveKeys.add(fallbackKey)
        leaveEvents.push({
          id: `leave-${fallbackKey}`,
          date,
          startTime: '07:00:00',
          endTime: '17:00:00',
          title: 'Bác sĩ nghỉ',
          subtitle: 'Không khả dụng theo điều phối',
          type: 'doctor_leave',
        })
      }
      return
    }

    leaveRanges.forEach((range, rangeIndex) => {
      if (!range?.gio_bat_dau || !range?.gio_ket_thuc) {
        return
      }

      const leaveKey = `${date}-${range.gio_bat_dau}-${range.gio_ket_thuc}-${range.ly_do || ''}`
      if (leaveKeys.has(leaveKey)) {
        return
      }

      leaveKeys.add(leaveKey)
      leaveEvents.push({
        id: `leave-${date}-${rangeIndex}-${String(range.gio_bat_dau).slice(0, 5)}`,
        date,
        startTime: range.gio_bat_dau,
        endTime: range.gio_ket_thuc,
        title: 'Bác sĩ nghỉ theo giờ',
        subtitle: range.ly_do || 'Theo lịch nghỉ bác sĩ',
        type: 'doctor_leave',
      })
    })
  })

  return [...shiftEvents, ...leaveEvents, ...holidayEvents]
}

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
  const [weekStart, setWeekStart] = useState(toMonday(dayjs()))
  const [scheduleItems, setScheduleItems] = useState([])
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [scheduleError, setScheduleError] = useState('')

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

  useEffect(() => {
    if (!doctor?.id) {
      setScheduleItems([])
      setScheduleError('')
      return
    }

    const loadSchedule = async () => {
      setScheduleLoading(true)
      setScheduleError('')

      try {
        const items = await fetchDoctorSchedule({
          bacSiId: doctor.id,
          fromDate: toMonday(dayjs()).format('YYYY-MM-DD'),
          toDate: dayjs().add(SCHEDULE_WINDOW_DAYS, 'day').format('YYYY-MM-DD'),
        })
        setScheduleItems(items)
      } catch (requestError) {
        setScheduleError(getApiErrorMessage(requestError, 'Không thể tải lịch làm việc của bác sĩ.'))
      } finally {
        setScheduleLoading(false)
      }
    }

    loadSchedule()
  }, [doctor?.id])

  const scheduleEvents = useMemo(
    () => buildDoctorDetailScheduleEvents(scheduleItems),
    [scheduleItems],
  )

  const scheduleWeekGroups = useMemo(() => {
    const groups = scheduleEvents.reduce((accumulator, event) => {
      const key = toMonday(dayjs(event.date)).format('YYYY-MM-DD')
      if (!accumulator[key]) {
        accumulator[key] = []
      }

      accumulator[key].push(event)
      return accumulator
    }, {})

    return Object.entries(groups)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([start, items]) => ({
        weekStart: start,
        items,
      }))
  }, [scheduleEvents])

  const hasScheduleInCurrentWeek = useMemo(() => {
    const key = weekStart.format('YYYY-MM-DD')
    return scheduleWeekGroups.some((group) => group.weekStart === key)
  }, [scheduleWeekGroups, weekStart])

  useEffect(() => {
    if (scheduleWeekGroups.length === 0) {
      return
    }

    const firstWeek = dayjs(scheduleWeekGroups[0].weekStart)
    const lastWeek = dayjs(scheduleWeekGroups[scheduleWeekGroups.length - 1].weekStart)

    if (weekStart.isBefore(firstWeek, 'day')) {
      setWeekStart(firstWeek)
      return
    }

    if (weekStart.isAfter(lastWeek, 'day')) {
      setWeekStart(lastWeek)
    }
  }, [scheduleWeekGroups, weekStart])

  const canGoPreviousWeek = useMemo(() => {
    if (scheduleWeekGroups.length === 0) {
      return false
    }

    const firstWeek = dayjs(scheduleWeekGroups[0].weekStart)
    return weekStart.isAfter(firstWeek, 'day')
  }, [scheduleWeekGroups, weekStart])

  const canGoNextWeek = useMemo(() => {
    if (scheduleWeekGroups.length === 0) {
      return false
    }

    const lastWeek = dayjs(scheduleWeekGroups[scheduleWeekGroups.length - 1].weekStart)
    return weekStart.isBefore(lastWeek, 'day')
  }, [scheduleWeekGroups, weekStart])

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
      <div className="mx-auto px-6 py-12">
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

            <div className="rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">Lịch làm việc dự kiến</h2>
                <span className="text-xs text-slate-500">Xem trước lịch trong {SCHEDULE_WINDOW_DAYS} ngày tới</span>
              </div>

              {scheduleError ? (
                <Alert
                  showIcon
                  type="warning"
                  message={scheduleError}
                />
              ) : null}

              {scheduleLoading ? (
                <p className="text-sm text-slate-500">Đang tải lịch làm việc...</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setWeekStart((prev) => prev.subtract(7, 'day'))}
                      disabled={!canGoPreviousWeek}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tuần trước
                    </button>

                    <p className="text-sm font-medium text-slate-600">
                      Tuần {weekStart.format('DD/MM/YYYY')} - {weekStart.add(6, 'day').format('DD/MM/YYYY')}
                    </p>

                    <button
                      type="button"
                      onClick={() => setWeekStart((prev) => prev.add(7, 'day'))}
                      disabled={!canGoNextWeek}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tuần sau
                    </button>
                  </div>

                  <WeeklyScheduleGrid
                    weekStart={weekStart}
                    events={scheduleEvents}
                    emptyText={hasScheduleInCurrentWeek ? 'Không có dữ liệu hiển thị cho tuần này.' : 'Bác sĩ chưa có lịch làm việc khả dụng trong tuần đã chọn.'}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DoctorDetailPage
