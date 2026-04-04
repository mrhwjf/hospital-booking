<?php

namespace App\Services\Auth;

use App\Models\NguoiDung;
use Illuminate\Support\Str;
use RuntimeException;

class JwtService
{
    public function createToken(NguoiDung $user, array $extraClaims = []): string
    {
        $now = time();
        $ttlSeconds = ((int) config('jwt.ttl', 1440)) * 60;

        $payload = array_merge([
            'iss' => config('app.url', 'hospital-booking-api'),
            'sub' => (string) $user->id,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + $ttlSeconds,
            'jti' => (string) Str::uuid(),
            'email' => $user->email,
            'name' => $user->ho_ten,
            'role' => $user->vaiTro?->ma_vai_tro,
        ], $extraClaims);

        return $this->encode($payload);
    }

    public function decodeToken(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new RuntimeException('Token format is invalid');
        }

        [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;

        $header = json_decode($this->base64UrlDecode($headerEncoded), true);
        $payload = json_decode($this->base64UrlDecode($payloadEncoded), true);

        if (!is_array($header) || !is_array($payload)) {
            throw new RuntimeException('Token payload is invalid');
        }

        if (($header['typ'] ?? null) !== 'JWT' || ($header['alg'] ?? null) !== 'HS256') {
            throw new RuntimeException('Token algorithm is not supported');
        }

        $expectedSignature = hash_hmac(
            'sha256',
            $headerEncoded . '.' . $payloadEncoded,
            $this->getSecret(),
            true
        );

        $actualSignature = $this->base64UrlDecode($signatureEncoded);

        if (!hash_equals($expectedSignature, $actualSignature)) {
            throw new RuntimeException('Token signature is invalid');
        }

        $now = time();
        if (isset($payload['nbf']) && $now < (int) $payload['nbf']) {
            throw new RuntimeException('Token is not active yet');
        }

        if (!isset($payload['exp']) || $now >= (int) $payload['exp']) {
            throw new RuntimeException('Token has expired');
        }

        return $payload;
    }

    private function encode(array $payload): string
    {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256',
        ];

        $headerEncoded = $this->base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));

        $signature = hash_hmac(
            'sha256',
            $headerEncoded . '.' . $payloadEncoded,
            $this->getSecret(),
            true
        );

        $signatureEncoded = $this->base64UrlEncode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    private function getSecret(): string
    {
        $secret = (string) config('jwt.secret');
        if ($secret === '') {
            throw new RuntimeException('JWT secret is missing');
        }

        if (str_starts_with($secret, 'base64:')) {
            $decoded = base64_decode(substr($secret, 7), true);
            if ($decoded === false || $decoded === '') {
                throw new RuntimeException('JWT secret is invalid');
            }

            return $decoded;
        }

        return $secret;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        $remainder = strlen($value) % 4;
        if ($remainder !== 0) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        $decoded = base64_decode(strtr($value, '-_', '+/'), true);
        if ($decoded === false) {
            throw new RuntimeException('Token segment is invalid');
        }

        return $decoded;
    }
}
