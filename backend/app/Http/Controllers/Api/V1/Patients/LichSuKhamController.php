<?php

namespace App\Http\Controllers\Api\V1\Patients;

use App\Http\Controllers\Controller;
use App\Models\PhieuKham;
use App\Requests\Patients\VisitHistoryListRequest;
use App\Requests\Patients\VisitHistoryScopedRequest;
use App\Resources\ApiResponse;
use App\Resources\Patients\ChiDinhResource;
use App\Resources\Patients\DonThuocDetailResource;
use App\Resources\Patients\TaiLieuHoSoResource;
use App\Resources\Patients\VisitDetailResource;
use App\Resources\Patients\VisitHistoryItemResource;
use App\Services\Patients\VisitHistoryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class LichSuKhamController extends Controller
{
	public function __construct(private readonly VisitHistoryService $visitHistoryService)
	{
	}

	public function index(VisitHistoryListRequest $request): JsonResponse
	{
		try {
			$this->authorize('viewAny', PhieuKham::class);

			$paginator = $this->visitHistoryService->getVisitHistory($request->validated());

			return ApiResponse::paginated(
				$paginator,
				VisitHistoryItemResource::class,
				'Lấy danh sách lịch sử khám thành công.'
			);
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập lịch sử khám này.', null, 403);
		} catch (ValidationException $exception) {
			return ApiResponse::error(
				'Không thể lấy danh sách lịch sử khám.',
				[
					'errors' => $exception->errors(),
				],
				422,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách lịch sử khám.', null, 500);
		}
	}

	public function show(int $id, VisitHistoryScopedRequest $request): JsonResponse
	{
		try {
			$bundle = $this->visitHistoryService->getVisitDetailBundle(
				$id,
				(int) $request->validated('benh_nhan_id')
			);
			$this->authorize('view', $bundle['visit']);

			return ApiResponse::success(
				[
					'visit' => new VisitDetailResource($bundle['visit']),
					'chi_dinh' => ChiDinhResource::collection($bundle['chiDinhs']),
					'don_thuoc' => $bundle['donThuoc'] ? new DonThuocDetailResource($bundle['donThuoc']) : null,
					'tai_lieu' => TaiLieuHoSoResource::collection($bundle['taiLieus']),
				],
				'Lấy chi tiết phiếu khám thành công.'
			);
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập phiếu khám này.', null, 403);
		} catch (ValidationException $exception) {
			$status = $this->resolveScopedErrorStatus($exception->errors());

			return ApiResponse::error(
				'Không thể lấy chi tiết phiếu khám.',
				[
					'errors' => $exception->errors(),
				],
				$status,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy chi tiết phiếu khám.', null, 500);
		}
	}

	public function chiDinh(int $id, VisitHistoryScopedRequest $request): JsonResponse
	{
		try {
			$visit = $this->visitHistoryService->getVisitDetail(
				$id,
				(int) $request->validated('benh_nhan_id')
			);
			$this->authorize('view', $visit);

			$items = $this->visitHistoryService->getVisitChiDinhs(
				$id,
				(int) $request->validated('benh_nhan_id')
			);

			return ApiResponse::success([
				'items' => ChiDinhResource::collection($items),
			], 'Lấy danh sách chỉ định thành công.');
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập chỉ định của phiếu khám này.', null, 403);
		} catch (ValidationException $exception) {
			$status = $this->resolveScopedErrorStatus($exception->errors());

			return ApiResponse::error(
				'Không thể lấy danh sách chỉ định.',
				[
					'errors' => $exception->errors(),
				],
				$status,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách chỉ định.', null, 500);
		}
	}

	public function donThuoc(int $id, VisitHistoryScopedRequest $request): JsonResponse
	{
		try {
			$visit = $this->visitHistoryService->getVisitDetail(
				$id,
				(int) $request->validated('benh_nhan_id')
			);
			$this->authorize('view', $visit);

			$donThuoc = $this->visitHistoryService->getVisitDonThuoc(
				$id,
				(int) $request->validated('benh_nhan_id')
			);

			return ApiResponse::success(
				$donThuoc ? new DonThuocDetailResource($donThuoc) : null,
				$donThuoc
				? 'Lấy thông tin đơn thuốc thành công.'
				: 'Phiếu khám chưa có đơn thuốc.'
			);
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập đơn thuốc của phiếu khám này.', null, 403);
		} catch (ValidationException $exception) {
			$status = $this->resolveScopedErrorStatus($exception->errors());

			return ApiResponse::error(
				'Không thể lấy thông tin đơn thuốc.',
				[
					'errors' => $exception->errors(),
				],
				$status,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy thông tin đơn thuốc.', null, 500);
		}
	}

	public function taiLieu(int $id, VisitHistoryScopedRequest $request): JsonResponse
	{
		try {
			$visit = $this->visitHistoryService->getVisitDetail(
				$id,
				(int) $request->validated('benh_nhan_id')
			);
			$this->authorize('view', $visit);

			$items = $this->visitHistoryService->getVisitTaiLieus(
				$id,
				(int) $request->validated('benh_nhan_id')
			);

			return ApiResponse::success([
				'items' => TaiLieuHoSoResource::collection($items),
			], 'Lấy danh sách tài liệu hồ sơ thành công.');
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập tài liệu hồ sơ này.', null, 403);
		} catch (ValidationException $exception) {
			$status = $this->resolveScopedErrorStatus($exception->errors());

			return ApiResponse::error(
				'Không thể lấy danh sách tài liệu hồ sơ.',
				[
					'errors' => $exception->errors(),
				],
				$status,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy danh sách tài liệu hồ sơ.', null, 500);
		}
	}

	public function taiLieuSignedUrl(int $id, int $taiLieuId, VisitHistoryScopedRequest $request): JsonResponse
	{
		try {
			$visit = $this->visitHistoryService->getVisitDetail(
				$id,
				(int) $request->validated('benh_nhan_id')
			);
			$this->authorize('view', $visit);

			$data = $this->visitHistoryService->getVisitTaiLieuSignedUrl(
				$id,
				$taiLieuId,
				(int) $request->validated('benh_nhan_id')
			);

			return ApiResponse::success($data, 'Lấy URL tài liệu thành công.');
		} catch (AuthorizationException $exception) {
			return ApiResponse::error('Bạn không có quyền truy cập tài liệu hồ sơ này.', null, 403);
		} catch (ValidationException $exception) {
			$status = $this->resolveScopedErrorStatus($exception->errors());

			return ApiResponse::error(
				'Không thể lấy URL tài liệu.',
				[
					'errors' => $exception->errors(),
				],
				$status,
			);
		} catch (\Throwable $throwable) {
			return ApiResponse::error('Không thể lấy URL tài liệu.', null, 500);
		}
	}

	private function resolveScopedErrorStatus(array $errors): int
	{
		$ownershipErrors = $errors['benh_nhan_id'] ?? [];
		$joined = strtolower(implode(' ', $ownershipErrors));

		if (str_contains($joined, 'quyền truy cập')) {
			return 403;
		}

		return 404;
	}
}
