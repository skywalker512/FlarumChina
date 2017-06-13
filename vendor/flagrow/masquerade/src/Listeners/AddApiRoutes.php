<?php

namespace Flagrow\Masquerade\Listeners;

use Flagrow\Masquerade\Api\Controllers\DeleteFieldController;
use Flagrow\Masquerade\Api\Controllers\FieldIndexController;
use Flagrow\Masquerade\Api\Controllers\OrderFieldController;
use Flagrow\Masquerade\Api\Controllers\SaveFieldController;
use Flagrow\Masquerade\Api\Controllers\UserConfigureController;
use Flagrow\Masquerade\Api\Controllers\UserProfileController;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiRoutes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'routes']);
    }

    /**
     * @param ConfigureApiRoutes $routes
     */
    public function routes(ConfigureApiRoutes $routes)
    {
        /**
         * Admin side
         */
        $routes->get('/masquerade/fields', 'masquerade.api.fields.index', FieldIndexController::class);
        $routes->post('/masquerade/fields/order', 'masquerade.api.fields.order', OrderFieldController::class);
        $routes->post('/masquerade/fields[/{id:[0-9]+}]', 'masquerade.api.fields.create', SaveFieldController::class);
        $routes->patch('/masquerade/fields[/{id:[0-9]+}]', 'masquerade.api.fields.update', SaveFieldController::class);
        $routes->delete('/masquerade/fields[/{id:[0-9]+}]', 'masquerade.api.fields.delete', DeleteFieldController::class);

        /**
         * Forum side
         */
        $routes->get('/masquerade/profile/{id:[0-9]+}', 'masquerade.api.profile', UserProfileController::class);
        $routes->get('/masquerade/configure', 'masquerade.api.configure', UserConfigureController::class);
        $routes->post('/masquerade/configure', 'masquerade.api.configure.save', UserConfigureController::class);
    }
}
