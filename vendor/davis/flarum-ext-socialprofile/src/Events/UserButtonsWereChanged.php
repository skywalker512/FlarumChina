<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Davis\SocialProfile\Events;

use Flarum\Core\User;

class UserButtonsWereChanged
{
    /**
     * @var User
     */
    public $user;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param User $user
     * @param User $actor
     */
    public function __construct(User $user, User $actor = null)
    {
        $this->user = $user;
        $this->actor = $actor;
    }
}
