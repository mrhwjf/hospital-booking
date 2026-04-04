<?php

namespace App\Http\Controllers\Api\V1\Doctors;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\DoctorIndexRequest;
use App\Http\Requests\Doctor\DoctorShowRequest;
use App\Http\Resources\Doctor\DoctorCollection;
use App\Http\Resources\Doctor\DoctorResource;
use App\Services\DoctorService;

class DoctorController extends Controller
{
    public function __construct(private readonly DoctorService $doctorService)
    {
    }

    public function index(DoctorIndexRequest $request): DoctorCollection
    {
        $doctors = $this->doctorService->getAllDoctors($request->validated());
        $hospitalName = $this->doctorService->getHospitalName();

        return new DoctorCollection($doctors, $hospitalName);
    }

    public function show(DoctorShowRequest $request, int $id): DoctorResource
    {
        $doctor = $this->doctorService->getDoctorById($id);
        $hospitalName = $this->doctorService->getHospitalName();

        return (new DoctorResource($doctor))->withHospitalName($hospitalName);
    }
}
