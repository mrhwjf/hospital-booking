<?php

namespace App\Services;

use App\Models\BenhNhan;
use App\Models\PhieuKham;
use App\Models\TaiLieuHoSo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PatientService
{
    private const PENDING_FILE_PUBLIC_ID_PREFIX = 'PENDING:';

    public function __construct(private CloudinaryService $cloudinaryService) {}

    private const LICH_SU_RELATIONS = [
        'bacSi.chuyenKhoas',
        'lichHen',
        'icd10Chinh',
    ];

    public function getLichSuPhieuKham(int $benhNhanId, array $filters = []): LengthAwarePaginator
    {
        BenhNhan::findOrFail($benhNhanId);

        $query = PhieuKham::with(self::LICH_SU_RELATIONS)
            ->forPatient($benhNhanId)
            ->where('trang_thai', 'hoan_thanh')
            ->orderByDesc('thoi_gian_tiep_nhan');

        if (!empty($filters['tu_ngay'])) {
            $query->whereDate('thoi_gian_tiep_nhan', '>=', $filters['tu_ngay']);
        }

        if (!empty($filters['den_ngay'])) {
            $query->whereDate('thoi_gian_tiep_nhan', '<=', $filters['den_ngay']);
        }

        $perPage = min((int) ($filters['per_page'] ?? 10), 50);

        return $query->paginate($perPage);
    }

    public function getTaiLieuHoSoByBenhNhan(int $benhNhanId, array $filters = []): LengthAwarePaginator
    {
        BenhNhan::findOrFail($benhNhanId);

        $query = TaiLieuHoSo::query()
            ->with(['phieuKham.benhNhan'])
            ->whereHas('phieuKham', function ($builder) use ($benhNhanId) {
                $builder->where('benh_nhan_id', $benhNhanId);
            })
            ->orderByDesc('ngay_tao')
            ->orderByDesc('id');

        if (!empty($filters['phieu_kham_id'])) {
            $query->where('phieu_kham_id', (int) $filters['phieu_kham_id']);
        }

        if (!empty($filters['loai_tai_lieu'])) {
            $query->where('loai_tai_lieu', $filters['loai_tai_lieu']);
        }

        if (!empty($filters['keyword'])) {
            $keyword = trim((string) $filters['keyword']);

            $query->where(function ($builder) use ($keyword) {
                $builder
                    ->where('ma_tai_lieu', 'like', "%{$keyword}%")
                    ->orWhere('ten_tai_lieu', 'like', "%{$keyword}%")
                    ->orWhere('file_public_id', 'like', "%{$keyword}%")
                    ->orWhereHas('phieuKham', function ($phieuBuilder) use ($keyword) {
                        $phieuBuilder
                            ->where('ma_phieu_kham', 'like', "%{$keyword}%")
                            ->orWhereHas('benhNhan', function ($benhNhanBuilder) use ($keyword) {
                                $benhNhanBuilder
                                    ->where('ho_ten', 'like', "%{$keyword}%")
                                    ->orWhere('ma_benh_nhan', 'like', "%{$keyword}%");
                            });
                    });
            });
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 100);

        return $query->paginate($perPage);
    }

    public function createTaiLieuHoSo(int $benhNhanId, array $data): TaiLieuHoSo
    {
        $phieuKhamId = (int) $data['phieu_kham_id'];
        $phieuKham = PhieuKham::query()
            ->select(['id', 'benh_nhan_id', 'ma_phieu_kham'])
            ->findOrFail($phieuKhamId);

        if ((int) $phieuKham->benh_nhan_id !== $benhNhanId) {
            throw (new ModelNotFoundException())->setModel(PhieuKham::class, [$phieuKhamId]);
        }

        $maTaiLieu = $this->generateMaTaiLieu((string) $phieuKham->ma_phieu_kham);
        $pendingFilePublicId = self::PENDING_FILE_PUBLIC_ID_PREFIX . $maTaiLieu;

        $item = TaiLieuHoSo::create([
            'ma_tai_lieu' => $maTaiLieu,
            'phieu_kham_id' => $phieuKhamId,
            'loai_tai_lieu' => $data['loai_tai_lieu'],
            'ten_tai_lieu' => $data['ten_tai_lieu'],
            'file_public_id' => $pendingFilePublicId,
            'ngay_tao' => $data['ngay_tao'],
            'ghi_chu' => $data['ghi_chu'] ?? null,
        ]);

        return $item->load(['phieuKham.benhNhan']);
    }

    public function updateTaiLieuHoSo(int $benhNhanId, int $taiLieuId, array $data): TaiLieuHoSo
    {
        $item = $this->findTaiLieuHoSoForPatient($benhNhanId, $taiLieuId);

        if (!empty($data['phieu_kham_id'])) {
            $this->assertPhieuKhamBelongsToBenhNhan((int) $data['phieu_kham_id'], $benhNhanId);
        }

        $item->fill([
            'phieu_kham_id' => (int) $data['phieu_kham_id'],
            'loai_tai_lieu' => $data['loai_tai_lieu'],
            'ten_tai_lieu' => $data['ten_tai_lieu'],
            'ngay_tao' => $data['ngay_tao'],
            'ghi_chu' => $data['ghi_chu'] ?? null,
        ]);
        $item->save();

        return $item->fresh()->load(['phieuKham.benhNhan']);
    }

    public function uploadTaiLieuHoSoFile(int $benhNhanId, int $taiLieuId, UploadedFile $file): TaiLieuHoSo
    {
        $item = $this->findTaiLieuHoSoForPatient($benhNhanId, $taiLieuId);

        $upload = $this->cloudinaryService->uploadMedicalDocument($file, (int) $item->phieu_kham_id, $item->id);
        $publicId = $upload['public_id'] ?? null;

        if (empty($publicId)) {
            throw new InvalidArgumentException('Upload Cloudinary không trả về public_id hợp lệ.');
        }

        $item->file_public_id = $publicId;
        $item->save();

        return $item->fresh();
    }

    public function getTaiLieuSignedUrl(int $benhNhanId, int $taiLieuId): string
    {
        $item = $this->findTaiLieuHoSoForPatient($benhNhanId, $taiLieuId);

        if (empty($item->file_public_id) || $this->isPendingFilePublicId($item->file_public_id)) {
            throw new InvalidArgumentException('Tài liệu chưa có file_public_id để tạo signed URL.');
        }

        return $this->cloudinaryService->getSignedUrl($item->file_public_id);
    }

    public function deleteTaiLieuHoSo(int $benhNhanId, int $taiLieuId): void
    {
        $item = $this->findTaiLieuHoSoForPatient($benhNhanId, $taiLieuId);

        DB::transaction(function () use ($item) {
            if (!empty($item->file_public_id) && !$this->isPendingFilePublicId($item->file_public_id)) {
                $this->cloudinaryService->delete($item->file_public_id, 'raw', 'private');
            }

            $item->delete();
        });
    }

    private function findTaiLieuHoSoForPatient(int $benhNhanId, int $taiLieuId): TaiLieuHoSo
    {
        BenhNhan::findOrFail($benhNhanId);

        return TaiLieuHoSo::query()
            ->where('id', $taiLieuId)
            ->whereHas('phieuKham', function ($builder) use ($benhNhanId) {
                $builder->where('benh_nhan_id', $benhNhanId);
            })
            ->firstOrFail();
    }

    private function assertPhieuKhamBelongsToBenhNhan(int $phieuKhamId, int $benhNhanId): void
    {
        $exists = PhieuKham::query()
            ->where('id', $phieuKhamId)
            ->where('benh_nhan_id', $benhNhanId)
            ->exists();

        if (!$exists) {
            throw (new ModelNotFoundException())->setModel(PhieuKham::class, [$phieuKhamId]);
        }
    }

    private function generateMaTaiLieu(string $maPhieuKham): string
    {
        $normalizedMaPhieuKham = strtoupper(trim($maPhieuKham));
        $baseCode = 'TL' . now()->format('dmYHis') . '-' . $normalizedMaPhieuKham;

        $candidate = $baseCode;
        $counter = 1;

        while (TaiLieuHoSo::query()->where('ma_tai_lieu', $candidate)->exists()) {
            $candidate = $baseCode . '-' . $counter;
            $counter++;
        }

        return $candidate;
    }

    private function isPendingFilePublicId(?string $filePublicId): bool
    {
        if ($filePublicId === null) {
            return false;
        }

        return str_starts_with($filePublicId, self::PENDING_FILE_PUBLIC_ID_PREFIX);
    }
}
