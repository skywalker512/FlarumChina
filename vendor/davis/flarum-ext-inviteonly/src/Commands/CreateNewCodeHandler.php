<?php namespace Davis\InviteOnly\Commands;

use Davis\InviteOnly\Repository\ReferalRepository;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Foundation\Application;
use Illuminate\Events\Dispatcher;
use Flarum\Settings\SettingsRepositoryInterface;

class CreateNewCodeHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;
    
    protected $settings;

    protected $referal;
    
    public function __construct(ReferalRepository $referal, SettingsRepositoryInterface $settings)
    {
        $this->referal = $referal;
        $this->settings = $settings;
    }
    
    public function handle(CreateNewCode $command)
    {
        if($command->refid == 0) {
            $this->assertCan($command->actor, 'davis-inviteonly.createkey');
            $max = $this->settings->get('davis-inviteonly.maximumkeys');
            if($max == "") {
                $max = 5;
            }
            if ($this->referal->countCodes($command->actor->id) < $max) {
                $referal = $this->referal->createCode($command->refid, $command->actor->id);
            } else {
                die('You can only have '.$max.' keys');
            }
        } else {
            $referal = $this->referal->editCode($command->refid, $command->actor->id);
        }

        return $referal;
    }
}
