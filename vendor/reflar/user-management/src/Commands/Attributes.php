<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Flarum\Core\User;

class Attributes
{
    /**
     * @var array
     */
    public $body;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param array $body
     * @param User  $actor
     */
    public function __construct(array $body, User $actor)
    {
        $this->body = $body;
        $this->actor = $actor;
    }
}
