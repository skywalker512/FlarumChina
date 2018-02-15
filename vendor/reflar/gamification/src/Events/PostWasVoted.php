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

class PostWasVoted
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
     * @var String
     */
    public $type;

    /**
     * PostWasVoted constructor.
     * @param Post   $post
     * @param User   $user
     * @param User   $actor
     * @param String $type
     */
    public function __construct(Post $post, User $user, User $actor, $type)
    {
        $this->post = $post;
        $this->user = $user;
        $this->actor = $actor;
        $this->type = $type;
    }
}
