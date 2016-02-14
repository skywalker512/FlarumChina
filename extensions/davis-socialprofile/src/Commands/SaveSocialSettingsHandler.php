<?php namespace Davis\SocialProfile\Commands;

use Davis\SocialProfile\Buttons;
use Davis\SocialProfile\Events\SocialProfileEditted;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Foundation\Application;
use Illuminate\Events\Dispatcher;

class SaveSocialSettingsHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    protected $users;
    
    protected $app;

    public function __construct(
        Dispatcher $events,
        UserRepository $users,
        Application $app
    ) {
        $this->events    = $events;
        $this->users     = $users;
        $this->app       = $app;
    }

    public function handle(SaveSocialSettings $command)
    {
        if (Buttons::where('user_id', $command->actor->id)->exists()) {
            $Buttons = Buttons::where('user_id', $command->actor->id)->first();
        } else {
            $Buttons = new Buttons;
        }
        $Buttons->user_id = $command->actor->id;
        $Buttons->Buttons = $command->Buttons;

       $this->events->fire(
            new SocialProfileEditted($command->actor, $command->Buttons)
        );

        $Buttons->save();

        return $Buttons;
    }
}
