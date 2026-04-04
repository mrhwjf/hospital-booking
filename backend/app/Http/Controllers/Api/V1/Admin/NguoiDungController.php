<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Models\VaiTro;
use App\Requests\Admin\DanhSachNguoiDungRequest;
use App\Requests\Admin\TaoNguoiDungRequest;
use App\Requests\Admin\CapNhatNguoiDungRequest;
use App\Requests\Admin\ResetMatKhauRequest;
use App\Resources\Admin\NguoiDungResource;
use App\Resources\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class NguoiDungController extends Controller
{
    /**
     * GET /api/v1/nguoi-dung
     * Danh sách người dùng (lọc theo q, vai_tro, trang_thai, phân trang)
     */
    public function index(DanhSachNguoiDungRequest $request): JsonResponse
    {
        $query = NguoiDung::with('vaiTro');

        // Lọc theo từ khóa (email)
        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where('email', 'like', '%' . $q . '%');
        }

        // Lọc theo vai trò (ma_vai_tro)
        if ($request->filled('vai_tro')) {
            $query->whereHas('vaiTro', function ($q) use ($request) {
                $q->where('ma_vai_tro', $request->input('vai_tro'));
            });
        }

        // Lọc theo trạng thái
        if ($request->filled('trang_thai')) {
            $query->where('trang_thai', $request->input('trang_thai'));
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min($request->input('per_page', 20), 100);
        $paginator = $query->paginate($perPage);

        return ApiResponse::paginated($paginator, NguoiDungResource::class, 'Lấy danh sách người dùng thành công.');
    }

    /**
     * GET /api/v1/nguoi-dung/{id}
     * Chi tiết người dùng
     */
    public function show(int $id): JsonResponse
    {
        $nguoiDung = NguoiDung::with('vaiTro')->find($id);

        if (!$nguoiDung) {
            return ApiResponse::error('Không tìm thấy người dùng.', null, 404);
        }

        return ApiResponse::success(new NguoiDungResource($nguoiDung), 'Lấy chi tiết người dùng thành công.');
    }

    /**
     * POST /api/v1/nguoi-dung
     * Tạo người dùng mới
     */
    public function store(TaoNguoiDungRequest $request): JsonResponse
    {
        $vaiTro = VaiTro::where('ma_vai_tro', $request->input('vai_tro'))->first();

        $nguoiDung = NguoiDung::create([
            'email' => $request->input('email'),
            'mat_khau' => Hash::make($request->input('mat_khau')),
            'vai_tro_id' => $vaiTro->id,
            'hinh_anh' => $request->input('hinh_anh'),
            'trang_thai' => $request->input('trang_thai', 'hoat_dong'),
        ]);

        $nguoiDung->load('vaiTro');

        return ApiResponse::success(new NguoiDungResource($nguoiDung), 'Tạo người dùng thành công.', 201);
    }

    /**
     * PATCH /api/v1/nguoi-dung/{id}
     * Cập nhật người dùng (email, vai_tro, trang_thai)
     */
    public function update(CapNhatNguoiDungRequest $request, int $id): JsonResponse
    {
        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {
            return ApiResponse::error('Không tìm thấy người dùng.', null, 404);
        }

        $data = [];

        if ($request->has('email')) {
            $data['email'] = $request->input('email');
        }

        if ($request->has('vai_tro')) {
            $vaiTro = VaiTro::where('ma_vai_tro', $request->input('vai_tro'))->first();
            $data['vai_tro_id'] = $vaiTro->id;
        }

        if ($request->has('trang_thai')) {
            $data['trang_thai'] = $request->input('trang_thai');
        }

        if ($request->has('hinh_anh')) {
            $data['hinh_anh'] = $request->input('hinh_anh');
        }

        $nguoiDung->update($data);
        $nguoiDung->load('vaiTro');

        return ApiResponse::success(new NguoiDungResource($nguoiDung), 'Đã cập nhật người dùng.');
    }

    /**
     * PATCH /api/v1/nguoi-dung/{id}/reset-password
     * Đặt lại mật khẩu
     */
    public function resetPassword(ResetMatKhauRequest $request, int $id): JsonResponse
    {
        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {
            return ApiResponse::error('Không tìm thấy người dùng.', null, 404);
        }

        $nguoiDung->update([
            'mat_khau' => Hash::make($request->input('mat_khau_moi')),
        ]);

        return ApiResponse::success([
            'id' => $nguoiDung->id,
        ], 'Đã đặt lại mật khẩu.');
    }

    /**
     * PATCH /api/v1/nguoi-dung/{id}/toggle-lock
     * Khóa/Mở khóa tài khoản
     */
    public function toggleLock(int $id): JsonResponse
    {
        $nguoiDung = NguoiDung::find($id);

        if (!$nguoiDung) {
            return ApiResponse::error('Không tìm thấy người dùng.', null, 404);
        }

        $nextStatus = $nguoiDung->trang_thai === 'khoa' ? 'hoat_dong' : 'khoa';
        $nguoiDung->update(['trang_thai' => $nextStatus]);

        $actionLabel = $nextStatus === 'khoa' ? 'khóa' : 'mở khóa';

        return ApiResponse::success([
            'id' => $nguoiDung->id,
            'trang_thai' => $nextStatus,
        ], "Đã {$actionLabel} tài khoản thành công.");
    }

    /**
     * GET /api/v1/nguoi-dung/tai-khoan-chua-lien-ket
     * Lấy danh sách tài khoản người dùng chưa liên kết với hồ sơ nhân viên/bác sĩ (lọc theo vai_tro)
     */
    public function taiKhoanChuaLienKet(DanhSachNguoiDungRequest $request): JsonResponse
    {
        $vaiTro = $request->input('vai_tro');

        $query = NguoiDung::query()
            ->with('vaiTro')
            ->where('trang_thai', 'hoat_dong')
            ->whereDoesntHave('nhanVien')
            ->whereDoesntHave('bacSi');

        if ($vaiTro) {
            $query->whereHas('vaiTro', function ($q) use ($vaiTro) {
                $q->where('ma_vai_tro', $vaiTro);
            });
        }

        $users = $query
            ->orderBy('vai_tro_id')
            ->get();

        return response()->json([
            'data' => $users
        ]);
    }
}
