<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */


namespace Reflar\Reactions\Notification;

use Flarum\Core\Notification\BlueprintInterface;
use Flarum\Core\Post;
use Flarum\Core\User;

class PostReactedBlueprint implements BlueprintInterface
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
     * @var string
     */
    public $reaction;

    /**
     * @param Post $post
     * @param User $user
     */
    public function __construct(Post $post, User $user, string $reaction)
    {
        $this->post = $post;
        $this->user = $user;
        $this->reaction = $reaction;
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
     * Get reaction type.
     *
     * @return string
     */
    public function getReactionType()
    {
        return $this->reaction;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return $this->reaction;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'postReacted';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
