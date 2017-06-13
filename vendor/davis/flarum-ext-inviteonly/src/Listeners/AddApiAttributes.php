<?php namespace Davis\InviteOnly\Listeners;

use Davis\InviteOnly\Api\Controllers\RegisterController;
use Davis\InviteOnly\Api\Controllers\GetUserCodesController;
use Davis\InviteOnly\Api\Controllers\CreateNewCodeController;
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
        $event->post('/davis/inviteonly/register', 'davis.inviteonly.register', RegisterController::class);
        $event->post('/davis/inviteonly/create', 'davis.inviteonly.create', CreateNewCodeController::class);
        $event->get('/davis/inviteonly/{id}','davis.inviteonly.id', GetUserCodesController::class);
    }
}
