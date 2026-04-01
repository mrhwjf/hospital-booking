<?php

namespace App\Http\Controllers\Api\V1\Services;

use App\Http\Controllers\Controller;
use App\Http\Requests\Specialty\SpecialtyIndexRequest;
use App\Http\Resources\Specialty\SpecialtyResource;
use App\Services\SpecialtyService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SpecialtyController extends Controller
{
    public function __construct(private readonly SpecialtyService $specialtyService)
    {
    }

    public function index(SpecialtyIndexRequest $request): AnonymousResourceCollection
    {
        $specialties = $this->specialtyService->getAll($request->validated());

        return SpecialtyResource::collection($specialties);
    }
}
