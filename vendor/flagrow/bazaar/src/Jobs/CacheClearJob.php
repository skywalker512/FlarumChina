<?php

namespace Flagrow\Bazaar\Jobs;

use Flarum\Admin\WebApp as AdminWebApp;
use Flarum\Forum\WebApp as ForumWebApp;
use Illuminate\Contracts\Cache\Store;

class CacheClearJob
{
    public function __construct(Store $cache, ForumWebApp $forum, AdminWebApp $admin)
    {
        $this->cache = $cache;
        $this->forum = $forum;
        $this->admin = $admin;
    }

    public function fire()
    {
        @unlink(base_path('assets/rev-manifest.json'));

        $this->forum->getAssets()->flush();
        $this->admin->getAssets()->flush();

        $this->cache->flush();
    }
}
