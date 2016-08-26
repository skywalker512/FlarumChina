<?php 
namespace Vingle\Share\Social;

use Illuminate\Contracts\Events\Dispatcher;

return function(Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
};