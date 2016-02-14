<?php namespace Davis\SocialProfile\Events;

use Davis\SocialProfile\Buttons;
use Flarum\Core\Post;
use Flarum\Core\User;

class SocialProfileEditted
{
    public $actor;
    
    public $Buttons;

    public function __construct(User $actor, $Buttons)
    {
        $this->actor = $actor;
        $this->Buttons = $Buttons;
    }
}
