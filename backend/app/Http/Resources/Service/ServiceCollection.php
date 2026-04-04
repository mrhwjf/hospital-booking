<?php

namespace App\Http\Resources\Service;

use App\Http\Resources\Service\ServiceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServiceCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection
            ->map(fn ($service) => (new ServiceResource($service))->toArray($request))
            ->all();
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'total' => $this->collection->count(),
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }
}
