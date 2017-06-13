<?php namespace Davis\SecureHttps;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
    $events->subscribe(Listeners\AddApiAttributes::class);
};