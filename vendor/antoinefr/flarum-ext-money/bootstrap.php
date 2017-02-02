<?php namespace AntoineFr\Money;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);    
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\GiveMoney::class);
};
