<?php

namespace App\Resources\Cloudinary;

use Illuminate\Http\Resources\Json\JsonResource;

class AvatarResource extends JsonResource
{
	public function toArray($request): array
	{
		return [
			'url' => $this->url,
			'public_id' => $this->public_id,
		];
	}
}