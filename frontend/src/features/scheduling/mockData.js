const toDate = (value) => new Date(`${value}T00:00:00`)

const addDays = (baseDate, days) => {
	const date = new Date(baseDate)
	date.setDate(date.getDate() + days)
	return date
}

const formatDate = (date) => {
	const yyyy = date.getFullYear()
	const mm = String(date.getMonth() + 1).padStart(2, '0')
	const dd = String(date.getDate()).padStart(2, '0')
	return `${yyyy}-${mm}-${dd}`
}

const now = new Date()
const today = formatDate(now)
const timestamp = now.toISOString().slice(0, 19).replace('T', ' ')

export const appointmentStatusMeta = {
	dang_cho: { label: 'Đang chờ', color: 'default' },
	da_thanh_toan: { label: 'Đã thanh toán', color: 'blue' },
	da_xac_nhan: { label: 'Đã xác nhận', color: 'cyan' },
	da_hoan_tat: { label: 'Đã hoàn tất', color: 'green' },
	da_huy: { label: 'Đã hủy', color: 'red' },
	khong_den: { label: 'Không đến', color: 'orange' },
}

export const specialties = [
	{
		id: 1,
		ma_chuyen_khoa: 'CK001',
		ten_chuyen_khoa: 'Tim mạch',
		mo_ta: 'Khám và điều trị bệnh lý tim mạch cho người lớn.',
		hinh_anh: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 3, Khu A',
		so_dien_thoai: '02838220011',
		truong_khoa_id: 1,
		thu_tu_hien_thi: 1,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 2,
		ma_chuyen_khoa: 'CK002',
		ten_chuyen_khoa: 'Nhi khoa',
		mo_ta: 'Theo dõi và chăm sóc sức khỏe cho trẻ em.',
		hinh_anh: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 2, Khu B',
		so_dien_thoai: '02838220022',
		truong_khoa_id: 2,
		thu_tu_hien_thi: 2,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 3,
		ma_chuyen_khoa: 'CK003',
		ten_chuyen_khoa: 'Da liễu',
		mo_ta: 'Chẩn đoán và điều trị bệnh lý da, tóc và móng.',
		hinh_anh: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 4, Khu C',
		so_dien_thoai: '02838220033',
		truong_khoa_id: 4,
		thu_tu_hien_thi: 3,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 4,
		ma_chuyen_khoa: 'CK004',
		ten_chuyen_khoa: 'Cơ xương khớp',
		mo_ta: 'Khám chấn thương thể thao, đau khớp và phục hồi vận động.',
		hinh_anh: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 5, Khu A',
		so_dien_thoai: '02838220044',
		truong_khoa_id: 3,
		thu_tu_hien_thi: 4,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 5,
		ma_chuyen_khoa: 'CK005',
		ten_chuyen_khoa: 'Tai mũi họng',
		mo_ta: 'Điều trị các bệnh lý tai mũi họng và thanh quản.',
		hinh_anh: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 2, Khu A',
		so_dien_thoai: '02838220055',
		truong_khoa_id: 5,
		thu_tu_hien_thi: 5,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 6,
		ma_chuyen_khoa: 'CK006',
		ten_chuyen_khoa: 'Nội tiết',
		mo_ta: 'Theo dõi đái tháo đường, tuyến giáp và chuyển hóa.',
		hinh_anh: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
		vi_tri: 'Tầng 3, Khu B',
		so_dien_thoai: '02838220066',
		truong_khoa_id: 6,
		thu_tu_hien_thi: 6,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
]

export const doctors = [
	{
		id: 1,
		ma_bac_si: 'BS001',
		nguoi_dung_id: 101,
		ho_ten: 'TS.BS Nguyễn Văn An',
		so_dien_thoai: '0901000001',
		hoc_vi: 'tien_si',
		chung_chi_hanh_nghe: 'CCHN-001-TPHCM',
		kinh_nghiem: 12,
		gioi_thieu: 'Chuyên sâu điều trị tăng huyết áp và bệnh mạch vành.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
		rating: 4.9,
		reviews: 128,
	},
	{
		id: 2,
		ma_bac_si: 'BS002',
		nguoi_dung_id: 102,
		ho_ten: 'ThS.BS Lê Thị Bình',
		so_dien_thoai: '0901000002',
		hoc_vi: 'thac_si',
		chung_chi_hanh_nghe: 'CCHN-002-TPHCM',
		kinh_nghiem: 9,
		gioi_thieu: 'Theo dõi tăng trưởng và miễn dịch cho trẻ em.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
		rating: 4.8,
		reviews: 96,
	},
	{
		id: 3,
		ma_bac_si: 'BS003',
		nguoi_dung_id: 103,
		ho_ten: 'BS Trần Minh Cường',
		so_dien_thoai: '0901000003',
		hoc_vi: 'bac_si',
		chung_chi_hanh_nghe: 'CCHN-003-TPHCM',
		kinh_nghiem: 7,
		gioi_thieu: 'Khám và phục hồi chức năng chấn thương thể thao.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
		rating: 4.7,
		reviews: 74,
	},
	{
		id: 4,
		ma_bac_si: 'BS004',
		nguoi_dung_id: 104,
		ho_ten: 'BS Phạm Gia Linh',
		so_dien_thoai: '0901000004',
		hoc_vi: 'bac_si',
		chung_chi_hanh_nghe: 'CCHN-004-TPHCM',
		kinh_nghiem: 6,
		gioi_thieu: 'Điều trị mụn và viêm da cơ địa bằng phác đồ cá nhân hóa.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80',
		rating: 4.6,
		reviews: 61,
	},
	{
		id: 5,
		ma_bac_si: 'BS005',
		nguoi_dung_id: 105,
		ho_ten: 'ThS.BS Võ Khánh Duy',
		so_dien_thoai: '0901000005',
		hoc_vi: 'thac_si',
		chung_chi_hanh_nghe: 'CCHN-005-TPHCM',
		kinh_nghiem: 10,
		gioi_thieu: 'Điều trị viêm xoang mạn và rối loạn giọng nói.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1659353883305-14d996f2f7e0?auto=format&fit=crop&w=300&q=80',
		rating: 4.8,
		reviews: 88,
	},
	{
		id: 6,
		ma_bac_si: 'BS006',
		nguoi_dung_id: 106,
		ho_ten: 'TS.BS Đặng Thu Hà',
		so_dien_thoai: '0901000006',
		hoc_vi: 'tien_si',
		chung_chi_hanh_nghe: 'CCHN-006-TPHCM',
		kinh_nghiem: 14,
		gioi_thieu: 'Theo dõi bệnh tuyến giáp và đái tháo đường dài hạn.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
		avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
		rating: 4.9,
		reviews: 142,
	},
]

export const doctorSpecialties = [
	{ id: 1, bac_si_id: 1, chuyen_khoa_id: 1, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 2, bac_si_id: 2, chuyen_khoa_id: 2, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 3, bac_si_id: 3, chuyen_khoa_id: 4, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 4, bac_si_id: 4, chuyen_khoa_id: 3, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 5, bac_si_id: 5, chuyen_khoa_id: 5, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 6, bac_si_id: 6, chuyen_khoa_id: 6, la_chuyen_khoa_chinh: true, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 7, bac_si_id: 1, chuyen_khoa_id: 6, la_chuyen_khoa_chinh: false, ghi_chu: 'Hội chẩn nội tiết tim mạch', created_at: timestamp, updated_at: timestamp },
]

export const doctorLeaveDates = [
	{
		id: 1,
		bac_si_id: 1,
		ngay: formatDate(addDays(now, 2)),
		gio_bat_dau: null,
		gio_ket_thuc: null,
		ly_do: 'Bác sĩ tham dự hội thảo chuyên môn',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
	},
	{
		id: 2,
		bac_si_id: 3,
		ngay: formatDate(addDays(now, 1)),
		gio_bat_dau: '13:30:00',
		gio_ket_thuc: '17:00:00',
		ly_do: 'Bác sĩ nghỉ phép nửa ngày',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
	},
	{
		id: 3,
		bac_si_id: 6,
		ngay: formatDate(addDays(now, 5)),
		gio_bat_dau: null,
		gio_ket_thuc: null,
		ly_do: 'Bác sĩ công tác ngoại viện',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
	},
]

export const holidays = [
	{
		id: 1,
		ten_ngay_nghi: 'Nghỉ lễ bệnh viện',
		ngay: formatDate(addDays(now, 3)),
		mo_ta: 'Bệnh viện tạm ngưng tiếp nhận khám ngoại trú trong ngày lễ.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
	},
	{
		id: 2,
		ten_ngay_nghi: 'Ngày đào tạo nội bộ toàn viện',
		ngay: formatDate(addDays(now, 6)),
		mo_ta: 'Toàn bộ bác sĩ tham gia đào tạo, không mở lịch khám ngoại trú.',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
	},
]

export const workShiftTemplates = [
	{
		id: 1,
		ma_ca: 'CA_SANG',
		ten_ca: 'Ca sáng',
		thu_trong_tuan: 2,
		gio_bat_dau: '07:30:00',
		gio_ket_thuc: '11:30:00',
		thoi_luong_kham: 60,
		ghi_chu: '',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 2,
		ma_ca: 'CA_CHIEU',
		ten_ca: 'Ca chiều',
		thu_trong_tuan: 2,
		gio_bat_dau: '13:30:00',
		gio_ket_thuc: '17:30:00',
		thoi_luong_kham: 60,
		ghi_chu: '',
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
]

const next7Days = Array.from({ length: 7 }, (_, i) => formatDate(addDays(now, i)))

export const workingSchedules = next7Days.flatMap((ngay, dayIndex) =>
	doctors.flatMap((doctor) => [
		{
			id: doctor.id * 1000 + dayIndex * 10 + 1,
			bac_si_id: doctor.id,
			lich_lam_viec_id: 1,
			phong_kham_id: 100 + doctor.id,
			ngay_lam_viec: ngay,
			ghi_chu: '',
			trang_thai: 'hoat_dong',
			created_at: timestamp,
			updated_at: timestamp,
		},
		{
			id: doctor.id * 1000 + dayIndex * 10 + 2,
			bac_si_id: doctor.id,
			lich_lam_viec_id: 2,
			phong_kham_id: 100 + doctor.id,
			ngay_lam_viec: ngay,
			ghi_chu: '',
			trang_thai: 'hoat_dong',
			created_at: timestamp,
			updated_at: timestamp,
		},
	]),
)

const slotTemplatesByShift = {
	1: [
		['07:30:00', '08:30:00'],
		['08:30:00', '09:30:00'],
		['09:30:00', '10:30:00'],
		['10:30:00', '11:30:00'],
	],
	2: [
		['13:30:00', '14:30:00'],
		['14:30:00', '15:30:00'],
		['15:30:00', '16:30:00'],
		['16:30:00', '17:30:00'],
	],
};

export const timeSlots = workingSchedules.flatMap((schedule) => {
	const templates = slotTemplatesByShift[schedule.lich_lam_viec_id] || []

	return templates
		.map(([gioBatDau, gioKetThuc], idx) => {
			const statusCandidates = []

			if (idx === 1 || idx === 4) {
				statusCandidates.push('da_dat')
			}

			if (idx === 2 && schedule.bac_si_id % 2 === 0) {
				statusCandidates.push('khoa')
			}

			if (idx === 0 && schedule.bac_si_id % 3 === 0) {
				statusCandidates.push('trong')
			}

			if (!statusCandidates.length) {
				return null
			}

			return {
				id: Number(`${schedule.id}${idx + 1}`),
				lich_lam_viec_bac_si_id: schedule.id,
				gio_bat_dau: gioBatDau,
				gio_ket_thuc: gioKetThuc,
				trang_thai: statusCandidates[statusCandidates.length - 1],
				created_at: timestamp,
				updated_at: timestamp,
			}
		})
		.filter(Boolean)
})

export const services = [
	{
		id: 1,
		ma_dich_vu: 'DV001',
		ten_dich_vu: 'Khám nội tổng quát',
		chuyen_khoa_id: 1,
		mo_ta: 'Đánh giá tổng quát, tư vấn điều trị ban đầu.',
		gia_dich_vu: 300000,
		thoi_gian_du_kien: 30,
		yeu_cau_dac_biet: '',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'kham_benh',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 2,
		ma_dich_vu: 'DV002',
		ten_dich_vu: 'Điện tâm đồ (ECG)',
		chuyen_khoa_id: 1,
		mo_ta: 'Đo hoạt động điện của tim.',
		gia_dich_vu: 180000,
		thoi_gian_du_kien: 20,
		yeu_cau_dac_biet: 'Mặc trang phục thoải mái.',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'chan_doan_hinh_anh',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 3,
		ma_dich_vu: 'DV003',
		ten_dich_vu: 'Siêu âm ổ bụng',
		chuyen_khoa_id: 1,
		mo_ta: 'Khảo sát gan, mật, tụy, thận và lách.',
		gia_dich_vu: 220000,
		thoi_gian_du_kien: 25,
		yeu_cau_dac_biet: 'Nhịn ăn tối thiểu 6 giờ.',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'chan_doan_hinh_anh',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 4,
		ma_dich_vu: 'DV004',
		ten_dich_vu: 'Xét nghiệm công thức máu',
		chuyen_khoa_id: 1,
		mo_ta: 'Đánh giá chỉ số hồng cầu, bạch cầu, tiểu cầu.',
		gia_dich_vu: 150000,
		thoi_gian_du_kien: 15,
		yeu_cau_dac_biet: '',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'xet_nghiem',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 5,
		ma_dich_vu: 'DV005',
		ten_dich_vu: 'Nội soi tai mũi họng',
		chuyen_khoa_id: 5,
		mo_ta: 'Khảo sát khoang mũi, họng và thanh quản bằng ống soi mềm.',
		gia_dich_vu: 350000,
		thoi_gian_du_kien: 30,
		yeu_cau_dac_biet: 'Không xịt mũi trước khi khám 2 giờ.',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'thu_thuat',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 6,
		ma_dich_vu: 'DV006',
		ten_dich_vu: 'Định lượng HbA1c',
		chuyen_khoa_id: 6,
		mo_ta: 'Theo dõi kiểm soát đường huyết trung bình trong 3 tháng.',
		gia_dich_vu: 260000,
		thoi_gian_du_kien: 20,
		yeu_cau_dac_biet: '',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'xet_nghiem',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 7,
		ma_dich_vu: 'DV007',
		ten_dich_vu: 'Siêu âm tuyến giáp',
		chuyen_khoa_id: 6,
		mo_ta: 'Đánh giá cấu trúc tuyến giáp và hạch vùng cổ.',
		gia_dich_vu: 280000,
		thoi_gian_du_kien: 25,
		yeu_cau_dac_biet: '',
		trang_thai: 'hoat_dong',
		loai_dich_vu: 'chan_doan_hinh_anh',
		created_at: timestamp,
		updated_at: timestamp,
	},
]

export const packages = [
	{
		id: 1,
		ma_goi_kham: 'GK001',
		ten_goi_kham: 'Gói tầm soát tim mạch cơ bản',
		mo_ta: 'Khám nội + ECG + xét nghiệm máu cơ bản.',
		gia_goi_kham: 590000,
		thoi_gian_du_kien: 80,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 2,
		ma_goi_kham: 'GK002',
		ten_goi_kham: 'Gói kiểm tra sức khỏe tổng quát',
		mo_ta: 'Khám tổng quát, siêu âm, xét nghiệm và tư vấn.',
		gia_goi_kham: 790000,
		thoi_gian_du_kien: 110,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 3,
		ma_goi_kham: 'GK003',
		ten_goi_kham: 'Gói theo dõi nội tiết chuyên sâu',
		mo_ta: 'Khám nội tiết, xét nghiệm HbA1c và siêu âm tuyến giáp.',
		gia_goi_kham: 980000,
		thoi_gian_du_kien: 130,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 4,
		ma_goi_kham: 'GK004',
		ten_goi_kham: 'Gói kiểm tra tai mũi họng định kỳ',
		mo_ta: 'Khám chuyên khoa tai mũi họng kết hợp nội soi và tư vấn điều trị.',
		gia_goi_kham: 670000,
		thoi_gian_du_kien: 90,
		trang_thai: 'hoat_dong',
		created_at: timestamp,
		updated_at: timestamp,
	},
]

export const packageDetails = [
	{ id: 1, goi_kham_id: 1, dich_vu_id: 1, thu_tu_hien_thi: 1, created_at: timestamp, updated_at: timestamp },
	{ id: 2, goi_kham_id: 1, dich_vu_id: 2, thu_tu_hien_thi: 2, created_at: timestamp, updated_at: timestamp },
	{ id: 3, goi_kham_id: 1, dich_vu_id: 4, thu_tu_hien_thi: 3, created_at: timestamp, updated_at: timestamp },
	{ id: 4, goi_kham_id: 2, dich_vu_id: 1, thu_tu_hien_thi: 1, created_at: timestamp, updated_at: timestamp },
	{ id: 5, goi_kham_id: 2, dich_vu_id: 3, thu_tu_hien_thi: 2, created_at: timestamp, updated_at: timestamp },
	{ id: 6, goi_kham_id: 2, dich_vu_id: 4, thu_tu_hien_thi: 3, created_at: timestamp, updated_at: timestamp },
	{ id: 7, goi_kham_id: 3, dich_vu_id: 6, thu_tu_hien_thi: 1, created_at: timestamp, updated_at: timestamp },
	{ id: 8, goi_kham_id: 3, dich_vu_id: 7, thu_tu_hien_thi: 2, created_at: timestamp, updated_at: timestamp },
	{ id: 9, goi_kham_id: 4, dich_vu_id: 5, thu_tu_hien_thi: 1, created_at: timestamp, updated_at: timestamp },
]

export const cancellationReasons = [
	{ id: 1, ma_ly_do: 'LD001', ten_ly_do: 'Bận việc cá nhân', loai: 'benh_nhan', thu_tu: 1, trang_thai: 'hoat_dong', created_at: timestamp },
	{ id: 2, ma_ly_do: 'LD002', ten_ly_do: 'Sức khỏe chưa ổn định để di chuyển', loai: 'benh_nhan', thu_tu: 2, trang_thai: 'hoat_dong', created_at: timestamp },
	{ id: 3, ma_ly_do: 'LD003', ten_ly_do: 'Bác sĩ đổi lịch công tác', loai: 'bac_si', thu_tu: 3, trang_thai: 'hoat_dong', created_at: timestamp },
]

const dateA = formatDate(addDays(now, 1))
const dateB = formatDate(addDays(now, 4))
const dateC = formatDate(addDays(now, -2))
const dateD = formatDate(addDays(now, 0))
const dateE = formatDate(addDays(now, 6))
const dateF = formatDate(addDays(now, -5))

const getSlotId = (bacSiId, dayValue, shiftId, slotIndex) => {
	const dayIndex = next7Days.findIndex((d) => d === dayValue)
	if (dayIndex < 0) {
		return null
	}
	const scheduleId = bacSiId * 1000 + dayIndex * 10 + shiftId
	return Number(`${scheduleId}${slotIndex}`)
}

export const appointments = [
	{
		id: 1,
		ma_lich_hen: 'LH20260311001',
		benh_nhan_id: 1,
		bac_si_id: 1,
		chuyen_khoa_id: 1,
		khung_gio_id: getSlotId(1, dateA, 1, 2),
		ngay_hen: dateA,
		ly_do_kham: 'Tái khám theo đơn',
		trang_thai: 'dang_cho',
		nguoi_tao_id: 1001,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: 'Ưu tiên khám sớm nếu có thể.',
		ghi_chu_noi_bo: '',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 2,
		ma_lich_hen: 'LH20260311002',
		benh_nhan_id: 1,
		bac_si_id: 2,
		chuyen_khoa_id: 2,
		khung_gio_id: getSlotId(2, dateB, 2, 1),
		ngay_hen: dateB,
		ly_do_kham: 'Khám ho kéo dài',
		trang_thai: 'da_xac_nhan',
		nguoi_tao_id: 1001,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: '',
		ghi_chu_noi_bo: '',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 3,
		ma_lich_hen: 'LH20260311003',
		benh_nhan_id: 1,
		bac_si_id: 1,
		chuyen_khoa_id: 1,
		khung_gio_id: getSlotId(1, dateC, 1, 3),
		ngay_hen: dateC,
		ly_do_kham: 'Đau ngực nhẹ',
		trang_thai: 'da_hoan_tat',
		nguoi_tao_id: 1001,
		gio_den_thuc_te: '08:45:00',
		nguoi_tiep_nhan_id: 9001,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: '',
		ghi_chu_noi_bo: 'Bệnh nhân đáp ứng tốt với phác đồ.',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 4,
		ma_lich_hen: 'LH20260311004',
		benh_nhan_id: 2,
		bac_si_id: 5,
		chuyen_khoa_id: 5,
		khung_gio_id: getSlotId(5, dateD, 2, 2),
		ngay_hen: dateD,
		ly_do_kham: 'Đau họng kéo dài 1 tuần',
		trang_thai: 'da_thanh_toan',
		nguoi_tao_id: 1002,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: 'Đã thanh toán online.',
		ghi_chu_noi_bo: '',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 5,
		ma_lich_hen: 'LH20260311005',
		benh_nhan_id: 3,
		bac_si_id: 6,
		chuyen_khoa_id: 6,
		khung_gio_id: getSlotId(6, dateE, 1, 4),
		ngay_hen: dateE,
		ly_do_kham: 'Theo dõi đường huyết sau điều chỉnh thuốc',
		trang_thai: 'dang_cho',
		nguoi_tao_id: 1003,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: 'Mang theo kết quả xét nghiệm gần nhất.',
		ghi_chu_noi_bo: '',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 6,
		ma_lich_hen: 'LH20260311006',
		benh_nhan_id: 4,
		bac_si_id: 3,
		chuyen_khoa_id: 4,
		khung_gio_id: getSlotId(3, dateF, 1, 1),
		ngay_hen: dateF,
		ly_do_kham: 'Đau vai gáy sau vận động mạnh',
		trang_thai: 'khong_den',
		nguoi_tao_id: 1004,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: null,
		ly_do_huy_khac: null,
		ghi_chu: 'Bệnh nhân không đến theo lịch.',
		ghi_chu_noi_bo: 'Đã gọi nhắc nhưng không liên hệ được.',
		created_at: timestamp,
		updated_at: timestamp,
	},
	{
		id: 7,
		ma_lich_hen: 'LH20260311007',
		benh_nhan_id: 2,
		bac_si_id: 2,
		chuyen_khoa_id: 2,
		khung_gio_id: null,
		ngay_hen: dateA,
		ly_do_kham: 'Khám định kỳ cho trẻ',
		trang_thai: 'da_huy',
		nguoi_tao_id: 1002,
		gio_den_thuc_te: null,
		nguoi_tiep_nhan_id: null,
		ly_do_huy_id: 1,
		ly_do_huy_khac: null,
		ghi_chu: 'Hủy do bệnh nhân bận công tác.',
		ghi_chu_noi_bo: '',
		created_at: timestamp,
		updated_at: timestamp,
	},
]

export const appointmentItems = [
	{ id: 1, lich_hen_id: 1, dich_vu_id: 1, goi_kham_id: null, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 2, lich_hen_id: 1, dich_vu_id: 2, goi_kham_id: null, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 3, lich_hen_id: 2, dich_vu_id: null, goi_kham_id: 1, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 4, lich_hen_id: 3, dich_vu_id: 1, goi_kham_id: null, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 5, lich_hen_id: 4, dich_vu_id: 5, goi_kham_id: null, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 6, lich_hen_id: 5, dich_vu_id: null, goi_kham_id: 3, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 7, lich_hen_id: 6, dich_vu_id: 1, goi_kham_id: null, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
	{ id: 8, lich_hen_id: 7, dich_vu_id: null, goi_kham_id: 2, so_luong: 1, ghi_chu: '', created_at: timestamp, updated_at: timestamp },
]

export const formatCurrency = (value) =>
	Number(value || 0).toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	})

export const formatDateLabel = (value) => {
	const date = toDate(value)
	return date.toLocaleDateString('vi-VN', {
		weekday: 'short',
		day: '2-digit',
		month: '2-digit',
	})
}

export const formatTimeLabel = (timeString) => String(timeString || '').slice(0, 5)

const timeToMinute = (timeValue) => {
	const safe = String(timeValue || '00:00:00')
	const [hh = '0', mm = '0'] = safe.split(':')
	return Number(hh) * 60 + Number(mm)
}

const minuteToTime = (minuteValue) => {
	const hh = String(Math.floor(minuteValue / 60)).padStart(2, '0')
	const mm = String(minuteValue % 60).padStart(2, '0')
	return `${hh}:${mm}:00`
}

const rangesOverlap = (slotStart, slotEnd, leaveStart, leaveEnd) =>
	slotStart < leaveEnd && slotEnd > leaveStart

const mapSlotStatus = (status) => {
	if (status === 'da_dat') {
		return 'da_dat'
	}

	if (status === 'khoa') {
		return 'khoa'
	}

	return 'trong'
}

export const generateDoctorTimeslots = ({ doctorId, date }) => {
	if (!doctorId || !date) {
		return []
	}

	const hasHoliday = holidays.some(
		(item) => item.ngay === date && item.trang_thai === 'hoat_dong',
	)

	if (hasHoliday) {
		return []
	}

	const schedules = workingSchedules.filter(
		(item) =>
			item.bac_si_id === doctorId &&
			item.ngay_lam_viec === date &&
			item.trang_thai === 'hoat_dong',
	)

	if (!schedules.length) {
		return []
	}

	const activeLeaves = doctorLeaveDates.filter(
		(item) =>
			item.bac_si_id === doctorId &&
			item.ngay === date &&
			item.trang_thai === 'hoat_dong',
	)

	const fullDayLeave = activeLeaves.some((item) => !item.gio_bat_dau && !item.gio_ket_thuc)
	if (fullDayLeave) {
		return []
	}

	const partialLeaveRanges = activeLeaves
		.filter((item) => item.gio_bat_dau && item.gio_ket_thuc)
		.map((item) => ({
			start: timeToMinute(item.gio_bat_dau),
			end: timeToMinute(item.gio_ket_thuc),
		}))

	const generated = schedules.flatMap((schedule) => {
		const shift = workShiftTemplates.find(
			(template) =>
				template.id === schedule.lich_lam_viec_id && template.trang_thai === 'hoat_dong',
		)

		if (!shift) {
			return []
		}

		const startMinute = timeToMinute(shift.gio_bat_dau)
		const endMinute = timeToMinute(shift.gio_ket_thuc)
		const duration = Number(shift.thoi_luong_kham || 0)

		if (duration <= 0 || startMinute >= endMinute) {
			return []
		}

		const rows = []
		let currentStart = startMinute

		while (currentStart + duration <= endMinute) {
			const currentEnd = currentStart + duration
			const isInLeaveRange = partialLeaveRanges.some((leaveRange) =>
				rangesOverlap(currentStart, currentEnd, leaveRange.start, leaveRange.end),
			)

			if (!isInLeaveRange) {
				const slotStart = minuteToTime(currentStart)
				const slotEnd = minuteToTime(currentEnd)
				const dbRecord = timeSlots.find(
					(item) =>
						item.lich_lam_viec_bac_si_id === schedule.id && item.gio_bat_dau === slotStart,
				)

				rows.push({
					id: dbRecord?.id ?? `gen-${schedule.id}-${slotStart}`,
					slot_key: `${schedule.id}-${slotStart}`,
					lich_lam_viec_bac_si_id: schedule.id,
					gio_bat_dau: slotStart,
					gio_ket_thuc: slotEnd,
					trang_thai: mapSlotStatus(dbRecord?.trang_thai),
					existsInDb: Boolean(dbRecord),
				})
			}

			currentStart += duration
		}

		return rows
	})

	return generated.sort((a, b) => timeToMinute(a.gio_bat_dau) - timeToMinute(b.gio_bat_dau))
}

export const getPrimarySpecialtyIdByDoctor = (doctorId) => {
	const primary = doctorSpecialties.find(
		(item) => item.bac_si_id === doctorId && item.la_chuyen_khoa_chinh,
	)
	return primary?.chuyen_khoa_id || null
}

export const getDoctorIdsBySpecialty = (specialtyId) =>
	doctorSpecialties
		.filter((item) => item.chuyen_khoa_id === specialtyId)
		.map((item) => item.bac_si_id)

export const getPackageServiceNames = (packageId) => {
	const detailRows = packageDetails
		.filter((row) => row.goi_kham_id === packageId)
		.sort((a, b) => a.thu_tu_hien_thi - b.thu_tu_hien_thi)

	return detailRows
		.map((row) => services.find((service) => service.id === row.dich_vu_id)?.ten_dich_vu)
		.filter(Boolean)
}

export const todayIso = today
