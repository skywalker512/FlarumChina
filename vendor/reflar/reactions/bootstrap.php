<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */


namespace Reflar\Reactions;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddPostReactionsRelationship::class);
    $events->subscribe(Listener\AddReactionsApi::class);
    $events->subscribe(Listener\SaveReactionsToDatabase::class);
    $events->subscribe(Listener\SendNotificationWhenPostIsReacted::class);
};
