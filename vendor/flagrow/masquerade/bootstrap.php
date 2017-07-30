<?php

namespace Flagrow\Masquerade;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddApiRoutes::class);
    $events->subscribe(Listeners\AddWebRoutes::class);
    $events->subscribe(Listeners\InjectPermissions::class);
    $events->subscribe(Listeners\InjectSettings::class);
    $events->subscribe(Listeners\DemandProfileCompletion::class);
    $events->subscribe(Listeners\AddUserGambits::class);
    $events->subscribe(Listeners\AddUserBioRelationship::class);
};
