<?php

namespace App\Http\Controllers\Api\V1\Clinical;

use App\Http\Controllers\Controller;
use App\Models\NhanVien;
use App\Requests\Clinical\CurrentStaffRequest;
use App\Resources\ApiResponse;
use App\Resources\Clinical\NhanVienProfileResource;
use Illuminate\Http\JsonResponse;

class NhanVienController extends Controller
{
	public function me(CurrentStaffRequest $request): JsonResponse
	{
		try {
			$nguoiDungId = (int) $request->validated('nguoi_dung_id');

			$nhanVien = NhanVien::query()
				->with([
					'nguoiDung:id,email,trang_thai,vai_tro_id',
					'nguoiDung.vaiTro:id,ma_vai_tro,ten_vai_tro',
				])
				->where('nguoi_dung_id', $nguoiDungId)
				->first();

			if (!$nhanVien) {
				return ApiResponse::error(
					'Không tìm thấy hồ sơ nhân viên.',
					[
						'errors' => [
							'nguoi_dung_id' => ['Không tồn tại hồ sơ nhân viên tương ứng.'],
						],
					],
					404,
				);
			}

			return ApiResponse::success(
				new NhanVienProfileResource($nhanVien),
				'Lấy thông tin nhân viên thành công.'
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy thông tin nhân viên.', null, 500);
		}
	}
}
