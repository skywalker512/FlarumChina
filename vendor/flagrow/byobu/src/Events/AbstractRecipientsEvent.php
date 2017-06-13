<?php

namespace Flagrow\Byobu\Events;

use Flarum\Core\Discussion;
use Flarum\Core\User;
use Flarum\Core\Group;
use Illuminate\Support\Collection;

abstract class AbstractRecipientsEvent
{
    /**
     * @var Discussion
     */
    public $discussion;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var Collection|int[]
     */
    public $newUsers;
    /**
     * @var Collection|int[]
     */
    public $newGroups;
    /**
     * @var User[]|Collection
     */
    public $oldUsers;
    /**
     * @var Group[]|Collection
     */
    public $oldGroups;

    /**
     * AbstractRecipientsEvent constructor.
     * @param Discussion $discussion
     * @param User $actor
     * @param Collection|int[] $newUsers
     * @param Collection|int[] $newGroups
     * @param Collection|User[] $oldUsers
     * @param Collection|Group[] $oldGroups
     */
    public function __construct(Discussion $discussion, User $actor, Collection $newUsers, Collection $newGroups, Collection $oldUsers, Collection $oldGroups)
    {
        $this->discussion = $discussion;
        $this->actor = $actor;
        $this->newUsers = $newUsers;
        $this->newGroups = $newGroups;
        $this->oldUsers = $oldUsers;
        $this->oldGroups = $oldGroups;
    }
}
