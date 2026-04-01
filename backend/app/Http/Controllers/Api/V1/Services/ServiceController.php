<?php

namespace App\Http\Controllers\Api\V1\Services;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceIndexRequest;
use App\Http\Requests\Service\ServiceShowRequest;
use App\Http\Resources\Service\ServiceCollection;
use App\Http\Resources\Service\ServiceResource;
use App\Services\ServiceService;

class ServiceController extends Controller
{
    public function __construct(private readonly ServiceService $serviceService)
    {
    }

    public function index(ServiceIndexRequest $request): ServiceCollection
    {
        $services = $this->serviceService->getAllServices($request->validated());

        return new ServiceCollection($services);
    }

    public function show(ServiceShowRequest $request, int $id): ServiceResource
    {
        $service = $this->serviceService->getServiceById($id);

        return new ServiceResource($service);
    }
}
