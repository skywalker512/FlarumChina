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

class VoteBlueprint implements BlueprintInterface
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
     * @var String
     */
    public $type;

    /**
     * VoteBlueprint constructor.
     * @param Post $post
     * @param User $actor
     * @param $type
     */
    public function __construct(Post $post, User $actor, $type)
    {
        $this->post = $post;
        $this->actor = $actor;
        $this->type = $type;
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
        return $this->actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return $this->type;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'vote';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
