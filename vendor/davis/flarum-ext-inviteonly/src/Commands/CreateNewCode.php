<?php namespace Davis\InviteOnly\Commands;

use Flarum\Core\User;
use Psr\Http\Message\UploadedFileInterface;

class CreateNewCode
{
    public $refid;

    public $actor;

    public function __construct($refid, User $actor)
    {
        $this->refid = $refid;
        $this->actor = $actor;
    }
}
