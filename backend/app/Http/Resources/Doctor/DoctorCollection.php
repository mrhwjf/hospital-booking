<?php

namespace App\Http\Resources\Doctor;

use App\Http\Resources\Doctor\DoctorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class DoctorCollection extends ResourceCollection
{
    private ?string $hospitalName = null;

    public function __construct($resource, ?string $hospitalName = null)
    {
        parent::__construct($resource);
        $this->hospitalName = $hospitalName;
    }

    public function toArray(Request $request): array
    {
        return $this->collection
            ->map(fn ($doctor) => (new DoctorResource($doctor))
                ->withHospitalName($this->hospitalName)
                ->toArray($request))
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
