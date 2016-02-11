<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Lazyboywu\Auth\Qq\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddQqClientAssets::class);
    $events->subscribe(Listener\AddQqAuthRoute::class);
    //$events->subscribe(Listener\AddQqLocale::class);
};
