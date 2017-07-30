<?php namespace Davis\SecureHttps\Listeners;

use Davis\SecureHttps\Api\Controllers\GetImageUrlController;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Events\Dispatcher;

class AddApiAttributes
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->get('/davis/securehttps/{imgurl}/', 'davis.securehttps.imgurl', GetImageUrlController::class);
    }
}
