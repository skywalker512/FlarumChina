<?php

namespace Sijad\Pages\Listener;

use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Sijad\Pages\Api\Controller;
use Sijad\Pages\Page;

class AddPagesApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        Page::setFormatter(app()->make('flarum.formatter'));

        $event->get('/pages', 'pages.index', Controller\ListPagesController::class);

        $event->post('/pages', 'pages.create', Controller\CreatePageController::class);

        $event->get('/pages/{id}', 'pages.show', Controller\ShowPageController::class);
        $event->patch('/pages/{id}', 'pages.update', Controller\UpdatePageController::class);
        $event->delete('/pages/{id}', 'pages.delete', Controller\DeletePageController::class);
    }
}
