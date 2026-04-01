<?php

namespace App\Resources;

<<<<<<< HEAD
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiResponse
{
	public static function success(mixed $data = null, ?string $message = null, int $statusCode = 200): JsonResponse
	{
		return response()->json([
			'success' => true,
			'data' => self::normalizeData($data),
			'message' => $message,
		], $statusCode);
	}

	public static function error(string $message, mixed $data = null, int $statusCode = 400): JsonResponse
	{
		return response()->json([
			'success' => false,
			'data' => self::normalizeData($data),
			'message' => $message,
		], $statusCode);
	}

	public static function paginated(
		LengthAwarePaginator $paginator,
		string $resourceClass,
		?string $message = null,
		int $statusCode = 200,
	): JsonResponse {
		return self::success([
			'items' => self::normalizeData($resourceClass::collection($paginator->items())),
			'pagination' => [
				'currentPage' => $paginator->currentPage(),
				'pageSize' => $paginator->perPage(),
				'totalItems' => $paginator->total(),
				'totalPages' => $paginator->lastPage(),
			],
		], $message, $statusCode);
	}

	private static function normalizeData(mixed $data): mixed
	{
		if ($data instanceof JsonResource) {
			return $data->resolve(request());
		}

		return $data;
	}
}
=======
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    public static function error(string $message = 'Error', mixed $data = null, int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data' => $data,
            'message' => $message,
        ], $status);
    }
}
>>>>>>> feature/admin
