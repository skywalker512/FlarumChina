<?php namespace Davis\SocialProfile\Listeners;

use Davis\SocialProfile\Api\Controllers\EditSocialButtonsController;
use Davis\SocialProfile\Api\Controllers\GetSocialButtonsController;
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
        $event->post('/profile/socialbuttons', 'davis.profile.buttons', EditSocialButtonsController::class);
        $event->get('/profile/socialbutton/{user}', 'davis.profile.button.user', GetSocialButtonsController::class);
    }
}
