<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\User;

class CreateLink
{
    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes of the new link.
     *
     * @var array
     */
    public $data;

    /**
     * @param User $actor The user performing the action.
     * @param array $data The attributes of the new link.
     */
    public function __construct(User $actor, array $data)
    {
        $this->actor = $actor;
        $this->data = $data;
    }
}
