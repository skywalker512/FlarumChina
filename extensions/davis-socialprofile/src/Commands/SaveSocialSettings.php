<?php namespace Davis\SocialProfile\Commands;

use Flarum\Core\User;
use Psr\Http\Message\UploadedFileInterface;

class SaveSocialSettings
{
    public $Buttons;

    public $actor;

    public function __construct($Buttons, User $actor)
    {
        $this->Buttons = $Buttons;
        $this->actor = $actor;
    }
}
