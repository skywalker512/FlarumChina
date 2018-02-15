<?php

namespace Flagrow\Byobu\Traits;

use Flarum\Core\Discussion;
use Flarum\Core\Group;
use Flarum\Core\User;
use Illuminate\Database\Eloquent\Collection;

trait ProvidesAccess
{
    /**
     * Does a generic test whether the user has access based on the recipients of the discussion.
     *
     * @param Discussion $discussion
     * @param User $actor
     * @return bool
     */
    protected function granted(Discussion $discussion, User $actor)
    {
        if ($discussion->recipientUsers->contains($actor)) {
            return true;
        }

        /** @var Collection $groups */
        $groups = $discussion->recipientGroups;

        return $groups->first(function ($_, $group) use ($actor) {
            return $actor->groups->find($group);
        }, false);
    }

    /**
     * Enables visibility of discussions/posts when they are flagged.
     *
     * @param $query
     * @param $actor
     * @param string $relation
     */
    protected function showWithFlags(&$query, $actor, $relation = 'flags')
    {
        if ($actor->exists && $this->extensions->isEnabled('flarum-flags') && $actor->can('viewFlags')) {
            $query->orHas($relation);
        }
    }
}
