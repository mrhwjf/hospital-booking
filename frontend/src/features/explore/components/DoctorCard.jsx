import { Link } from 'react-router-dom'

function DoctorCard({ doctor }) {
  return (
    <div className="group bg-white p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row gap-6 border border-transparent hover:border-teal-100/50">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
        <img
          alt={doctor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={doctor.avatar || 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=600&auto=format&fit=crop'}
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h4>
              <p className="text-teal-700 text-sm font-semibold mb-3">{doctor.specialty || 'Chưa cập nhật chuyên khoa'}</p>
            </div>
            <div className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">
              {doctor.rating ? doctor.rating.toFixed(1) : 'N/A'}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
            {doctor.description || 'Bác sĩ giàu kinh nghiệm, tận tâm trong chẩn đoán và điều trị cho bệnh nhân.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-2.5 bg-teal-700 text-white text-sm font-bold rounded shadow-sm hover:bg-teal-600 transition-all active:scale-95">
            Đăng ký khám
          </button>
          <Link
            className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded hover:bg-slate-50 transition-all active:scale-95"
            to={`/doctors/${doctor.id}`}
          >
            Xem hồ sơ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard
