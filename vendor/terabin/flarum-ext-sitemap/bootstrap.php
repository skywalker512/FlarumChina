<?php

use Terabin\Sitemap\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\GenerateSitemap::class);
};
