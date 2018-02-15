<?php

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Sijad\ReCaptcha\Listener;
use Sijad\ReCaptcha\Api\Controller\CreateUserController;
use Sijad\ReCaptcha\Forum\Controller\LogInController;


return function (Dispatcher $events, BusDispatcher $bus) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddValidatorRule::class);
    $events->subscribe(Listener\AddApiAttributes::class);

    $bus->pipeThrough(['Sijad\ReCaptcha\Validate']);
};
