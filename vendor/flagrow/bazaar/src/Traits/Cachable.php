<?php

namespace Flagrow\Bazaar\Traits;

use Illuminate\Contracts\Cache\Store;

trait Cachable
{
    /**
     * @param $hash
     * @param $callable
     * @return mixed
     */
    protected function getOrSetCache($hash, $callable)
    {
        if (app()->inDebugMode()) {
            return $callable();
        }

        $cache = app(Store::class);

        $cached = $cache->get($hash);

        if (!$cached) {
            $cached = $callable();

            $cache->put($hash, $cached, 60);
        }

        return $cached;
    }

    /**
     * @param $hash
     * @return mixed
     */
    protected function flushCacheKey($hash)
    {
        return app(Store::class)->forget($hash);
    }
}
