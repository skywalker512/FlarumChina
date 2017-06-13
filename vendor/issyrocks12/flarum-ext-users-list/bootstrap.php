<?php
namespace issyrocks12\UsersList;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\View\Factory;

return function (Dispatcher $events, Factory $views) {
    $events->subscribe(Listener\AddAdminMailApi::class);
    $events->subscribe(Listener\AddClientAssets::class);

    $views->addNameSpace('issyrocks12-userlist', __DIR__.'/views');
};
