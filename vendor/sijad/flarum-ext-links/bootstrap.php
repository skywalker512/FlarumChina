<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

use Sijad\Links\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddLinksApi::class);
    $events->subscribe(Listener\AddLinksRelationship::class);
};
