<?php

namespace issyrocks12\filter;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\View\Factory;

return function (Dispatcher $events, Factory $views) {
    $events->subscribe(Listener\FilterPosts::class);
    $events->subscribe(Listener\AddClientAssets::class);

    $views->addNameSpace('issyrocks12-filter', __DIR__.'/views');
};
