<?php

use Illuminate\Contracts\Events\Dispatcher;
use Sijad\Details\Listener;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddBBCode::class);
};
