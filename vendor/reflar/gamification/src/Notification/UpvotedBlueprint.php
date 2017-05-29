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

namespace Reflar\gamification\Notification;

use Flarum\Core\Notification\BlueprintInterface;
use Flarum\Core\Post;
use Flarum\Core\User;

class UpvotedBlueprint implements BlueprintInterface
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var User
     */
    public $user;

    /**
     * @param Post $post
     */
    public function __construct(Post $post, User $actor, User $user)
    {
        $this->post = $post;
        $this->actor = $actor;
        $this->user = $user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getSender()
    {
        return $this->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return $this->actor->id;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'upvoted';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
