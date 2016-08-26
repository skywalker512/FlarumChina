<?php

namespace Sijad\Pages\Command;

use Flarum\Core\User;

class CreatePage
{
    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes of the new page.
     *
     * @var array
     */
    public $data;

    /**
     * @param User  $actor The user performing the action.
     * @param array $data  The attributes of the new page.
     */
    public function __construct(User $actor, array $data)
    {
        $this->actor = $actor;
        $this->data = $data;
    }
}
