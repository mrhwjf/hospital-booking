<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
	protected $cloudinary;

	private const AVATAR_PREFIX = 'hospital_booking/user_avatars';
	private const MEDICAL_PREFIX = 'hospital_booking/medical_documents';

	public function __construct()
	{
		$this->cloudinary = new Cloudinary([
			'cloud' => [
				'cloud_name' => config('cloudinary.cloud_name'),
				'api_key' => config('cloudinary.api_key'),
				'api_secret' => config('cloudinary.api_secret'),
			],
		]);
	}

	/**
	 * Upload image (avatar, doctor profile, etc.)
	 * Allow overwriting existing image with the same public_id, so we can keep the same URL when updating the avatar or profile picture without changing the reference to it in the database.
	 */
	public function uploadAvatar(UploadedFile $file, int $userId): array
	{
		$publicId = self::AVATAR_PREFIX . "/user_{$userId}";

		$res = $this->cloudinary->uploadApi()->upload(
			$file->getRealPath(),
			[
				'public_id' => $publicId,
				'overwrite' => true,
				'invalidate' => true,
				'resource_type' => 'image',
				'type' => 'upload' // public
			]
		);

		return [
			'url' => $res['secure_url'],
			'public_id' => $res['public_id']
		];
	}

	/**
	 * Upload medical document (pdf).
	 * Allow overwriting existing document with the same public_id, so we can keep the same URL when updating a document without changing its reference in the database.
	 */
	public function uploadMedicalDocument(
		UploadedFile $file,
		int $phieuKhamId,
		int $taiLieuId
	): array {
		$publicId = self::MEDICAL_PREFIX . "/appointments_{$phieuKhamId}/document_{$taiLieuId}";

		// Get extension with fallback
		$extension = $file->getClientOriginalExtension();
		if (empty($extension)) {
			$extension = 'pdf'; // default fallback
		}

		$res = $this->cloudinary->uploadApi()->upload(
			$file->getRealPath(),
			[
				'public_id' => $publicId,
				'overwrite' => true,
				'invalidate' => true,
				'resource_type' => 'raw',
				'type' => 'private',
				'filename' => $file->getClientOriginalName(),
				'use_filename' => true,
			]
		);

		return [
			'public_id' => $res['public_id'],
			'url' => $this->getSignedUrl($res['public_id'], 'raw', $extension)
		];
	}

	/**
	 * Delete file by public_id
	 */
	public function delete(
		string $publicId,
		string $resourceType = 'image',
		string $type = 'upload'
	): bool {
		$res = $this->cloudinary->uploadApi()->destroy(
			$publicId,
			[
				'resource_type' => $resourceType,
				'type' => $type,
			]
		);

		return $res['result'] === 'ok' || $res['result'] === 'not found';
	}

	public function getSignedUrl(
		string $publicId,
		string $resourceType = 'raw',
		?string $format = 'pdf',  // Allow null
		int $expiresAt = 3600
	): string {
		// Ensure format has a value
		$format = $format ?? 'pdf';

		return $this->cloudinary->uploadApi()->privateDownloadUrl(
			$publicId,
			$format,
			[
				'resource_type' => $resourceType,
				'expires_at' => time() + $expiresAt,
				'attachment' => false,
			]
		);
	}
}