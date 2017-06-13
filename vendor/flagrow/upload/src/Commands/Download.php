<?php

namespace Flagrow\Upload\Commands;

use Flarum\Core\User;

class Download
{

    /**
     * @var string
     */
    public $uuid;
    /**
     * @var User
     */
    public $actor;
    /**
     * @var null|int
     */
    public $discussionId;
    /**
     * @var null|int
     */
    public $postId;

    function __construct($uuid, User $actor, $discussionId = null, $postId = null)
    {
        $this->uuid = $uuid;
        $this->actor = $actor;
        $this->discussionId = $discussionId;
        $this->postId = $postId;
    }
}
