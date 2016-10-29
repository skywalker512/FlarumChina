<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Listener;

use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Sijad\Links\Api\Controller;

class AddLinksApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/links', 'links.create', Controller\CreateLinkController::class);
        $event->post('/links/order', 'links.order', Controller\OrderLinksController::class);
        $event->patch('/links/{id}', 'links.update', Controller\UpdateLinkController::class);
        $event->delete('/links/{id}', 'links.delete', Controller\DeleteLinkController::class);
    }
}
