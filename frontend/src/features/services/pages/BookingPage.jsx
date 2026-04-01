import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

function BookingPage() {
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service_id') || ''

  const [form, setForm] = useState({
    ngay: '',
    gio: '',
    hoTen: '',
    soDienThoai: '',
    ghiChu: '',
  })

  const isValid = useMemo(() => {
    return form.ngay && form.gio && form.hoTen.trim() && form.soDienThoai.trim()
  }, [form])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValid) return

    alert(`Đã ghi nhận yêu cầu đặt lịch cho gói #${serviceId || 'N/A'}.`) // UI stub, ready to connect booking API
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-900">Đăng ký gói khám</h1>
        <p className="mb-8 text-slate-600">Mã gói khám: {serviceId || 'Chưa chọn gói'}</p>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Ngày khám
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
                name="ngay"
                onChange={handleChange}
                type="date"
                value={form.ngay}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Giờ khám
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
                name="gio"
                onChange={handleChange}
                type="time"
                value={form.gio}
              />
            </label>
          </div>

          <label className="text-sm font-medium text-slate-700">
            Họ và tên
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
              name="hoTen"
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              type="text"
              value={form.hoTen}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Số điện thoại
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
              name="soDienThoai"
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              type="tel"
              value={form.soDienThoai}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Ghi chú
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
              name="ghiChu"
              onChange={handleChange}
              placeholder="Triệu chứng hoặc yêu cầu thêm"
              rows={4}
              value={form.ghiChu}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
              to="/services"
            >
              Quay lại dịch vụ
            </Link>
            <button
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!isValid}
              type="submit"
            >
              Xác nhận đăng ký
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default BookingPage
