<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Events;

use Flarum\Core\Post;
use Flarum\Core\User;

class PostWasUpvoted
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
     * @param Post $post
     * @param User $user
     * @param User $actor
     */
    public function __construct(Post $post, User $user, User $actor)
    {
        $this->post = $post;
        $this->user = $user;
        $this->actor = $actor;
    }
}
