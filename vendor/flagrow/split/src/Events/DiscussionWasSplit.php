<?php

namespace Flagrow\Split\Events;

use Flarum\Core\Discussion;
use Flarum\Core\User;
use Illuminate\Database\Eloquent\Collection;

class DiscussionWasSplit
{

    /**
     * @var User
     */
    public $actor;

    /**
     * @var \Illuminate\Database\Eloquent\Collection
     */
    public $posts;

    /**
     * @var Discussion
     */
    public $originalDiscussion;

    /**
     * @var Discussion
     */
    public $newDiscussion;

    /**
     * DiscussionWasSplit constructor.
     *
     * @param User $actor
     * @param Collection $posts
     * @param Discussion $originalDiscussion
     * @param Discussion $newDiscussion
     */
    public function __construct(User $actor, Collection $posts, Discussion $originalDiscussion, Discussion $newDiscussion)
    {
        $this->actor = $actor;
        $this->posts = $posts;
        $this->originalDiscussion = $originalDiscussion;
        $this->newDiscussion = $newDiscussion;
    }
}
