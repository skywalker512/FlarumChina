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

namespace Reflar\UserManagement\Events;

use Flarum\Core\Post;
use Flarum\Core\User;

class UserWasGivenStrike
{
    /**
     * @var Post
     */
    public $post;
    /**
     * @var User
     */
    public $user;
    /**
     * @var User
     */
    public $actor;
    /**
     * @var string
     */
    public $reason;

    /**
     * @param Post   $post
     * @param User   $user
     * @param User   $actor
     * @param string $reason
     */
    public function __construct(Post $post, User $user, User $actor, &$reason)
    {
        $this->post = $post;
        $this->user = $user;
        $this->actor = $actor;
        $this->reason = &$reason;
    }
}
