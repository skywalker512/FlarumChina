<?php namespace Davis\InviteOnly;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Foundation\Application;

return function (Dispatcher $events, Application $app) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddApiAttributes::class);
    $app->register(Providers\StorageServiceProvider::class);
};