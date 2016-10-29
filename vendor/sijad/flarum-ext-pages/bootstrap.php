<?php

use Illuminate\Contracts\Events\Dispatcher;
use Sijad\Pages\Listener;

return function (Dispatcher $events) {
    app()->instance('path.pages', base_path().DIRECTORY_SEPARATOR.'pages');

    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddPagesRoute::class);
    $events->subscribe(Listener\AddPagesApi::class);
};
