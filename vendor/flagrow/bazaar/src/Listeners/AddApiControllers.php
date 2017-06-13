<?php

namespace Flagrow\Bazaar\Listeners;

use Flagrow\Bazaar\Api\Controllers;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Events\Dispatcher;

class AddApiControllers
{
    /**
     * Subscribes to the Flarum api routes configuration event.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    /**
     * Registers our routes.
     *
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        // Browse extensions
        $event->get(
            '/bazaar/extensions',
            'bazaar.extensions.index',
            Controllers\ListExtensionController::class
        );

        // Install an extension
        $event->post(
            '/bazaar/extensions',
            'bazaar.extensions.install',
            Controllers\InstallExtensionController::class
        );

        // Update an extension
        $event->patch(
            '/bazaar/extensions/{id}',
            'bazaar.extensions.update',
            Controllers\UpdateExtensionController::class
        );

        // Toggles an extension
        $event->patch(
            '/bazaar/extensions/{id}/toggle',
            'bazaar.extensions.toggle',
            Controllers\ToggleExtensionController::class
        );

        // Favorite an extension
        $event->post(
            '/bazaar/extensions/{id}/favorite',
            'bazaar.extensions.favorite',
            Controllers\FavoriteExtensionController::class
        );

        // Uninstall an extension
        $event->delete(
            '/bazaar/extensions/{id}',
            'bazaar.extensions.delete',
            Controllers\UninstallExtensionController::class
        );

        // Connect bazaar
        $event->get(
            '/bazaar/connect',
            'bazaar.connect',
            Controllers\ConnectController::class
        );

        // List Tasks
        $event->get(
            '/bazaar/tasks',
            'bazaar.tasks.index',
            Controllers\ListTaskController::class
        );
    }
}
