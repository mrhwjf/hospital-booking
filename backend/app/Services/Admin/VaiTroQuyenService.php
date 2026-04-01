<?php

namespace App\Services\Admin;

use App\Models\Quyen;
use App\Models\VaiTro;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class VaiTroQuyenService
{
    public function layDanhSachVaiTro(array $filters = []): LengthAwarePaginator
    {
        $query = VaiTro::query()
            ->with(['quyens:id,ma_quyen,ten_quyen,nhom_quyen'])
            ->withCount('nguoiDungs');

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('ma_vai_tro', 'like', '%' . $q . '%')
                    ->orWhere('ten_vai_tro', 'like', '%' . $q . '%');
            });
        }

        if (!empty($filters['trang_thai'])) {
            $query->where('trang_thai', $filters['trang_thai']);
        }

        $query->orderBy('created_at', 'desc');
        $perPage = min((int) ($filters['per_page'] ?? 10), 100);

        return $query->paginate($perPage);
    }

    public function layChiTietVaiTro(int $id): VaiTro
    {
        return VaiTro::query()
            ->with(['quyens:id,ma_quyen,ten_quyen,nhom_quyen'])
            ->withCount('nguoiDungs')
            ->findOrFail($id);
    }

    public function taoVaiTro(array $payload): VaiTro
    {
        return DB::transaction(function () use ($payload) {
            $vaiTro = VaiTro::query()->create([
                'ma_vai_tro' => $payload['ma_vai_tro'],
                'ten_vai_tro' => $payload['ten_vai_tro'],
                'mo_ta' => $payload['mo_ta'] ?? null,
                'trang_thai' => $payload['trang_thai'] ?? 'hoat_dong',
            ]);

            $quyenIds = $payload['quyen_ids'] ?? [];
            if (!empty($quyenIds)) {
                $vaiTro->quyens()->sync($quyenIds);
            }

            return $this->layChiTietVaiTro($vaiTro->id);
        });
    }

    public function capNhatVaiTro(int $id, array $payload): VaiTro
    {
        return DB::transaction(function () use ($id, $payload) {
            $vaiTro = VaiTro::query()->findOrFail($id);

            $data = [];
            foreach (['ma_vai_tro', 'ten_vai_tro', 'mo_ta', 'trang_thai'] as $field) {
                if (array_key_exists($field, $payload)) {
                    $data[$field] = $payload[$field];
                }
            }

            if (!empty($data)) {
                $vaiTro->update($data);
            }

            if (array_key_exists('quyen_ids', $payload)) {
                $vaiTro->quyens()->sync($payload['quyen_ids'] ?? []);
            }

            return $this->layChiTietVaiTro($vaiTro->id);
        });
    }

    public function xoaVaiTro(int $id): void
    {
        $vaiTro = VaiTro::query()->withCount('nguoiDungs')->findOrFail($id);

        if ((int) $vaiTro->nguoi_dungs_count > 0) {
            throw new \DomainException('Không thể xóa vai trò vì đang có tài khoản sử dụng.');
        }

        DB::transaction(function () use ($vaiTro) {
            $vaiTro->quyens()->detach();
            $vaiTro->delete();
        });
    }

    public function layDanhSachQuyen(array $filters = []): LengthAwarePaginator
    {
        $query = Quyen::query()->withCount('vaiTros');

        if (!empty($filters['q'])) {
            $q = trim($filters['q']);
            $query->where(function ($builder) use ($q) {
                $builder->where('ma_quyen', 'like', '%' . $q . '%')
                    ->orWhere('ten_quyen', 'like', '%' . $q . '%');
            });
        }

        if (!empty($filters['nhom_quyen'])) {
            $query->where('nhom_quyen', $filters['nhom_quyen']);
        }

        $query->orderBy('id');
        $perPage = min((int) ($filters['per_page'] ?? 10), 100);

        return $query->paginate($perPage);
    }

    public function taoQuyen(array $payload): Quyen
    {
        return Quyen::query()->create([
            'ma_quyen' => $payload['ma_quyen'],
            'ten_quyen' => $payload['ten_quyen'],
            'mo_ta' => $payload['mo_ta'] ?? null,
            'nhom_quyen' => $payload['nhom_quyen'] ?? null,
        ]);
    }

    public function capNhatQuyen(int $id, array $payload): Quyen
    {
        $quyen = Quyen::query()->findOrFail($id);

        $data = [];
        foreach (['ma_quyen', 'ten_quyen', 'mo_ta', 'nhom_quyen'] as $field) {
            if (array_key_exists($field, $payload)) {
                $data[$field] = $payload[$field];
            }
        }

        if (!empty($data)) {
            $quyen->update($data);
        }

        return $quyen->fresh();
    }

    public function xoaQuyen(int $id): void
    {
        $quyen = Quyen::query()->findOrFail($id);
        $quyen->delete();
    }
}
