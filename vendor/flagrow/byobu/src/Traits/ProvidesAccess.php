<?php

namespace Flagrow\Byobu\Traits;

use Flarum\Core\Discussion;
use Flarum\Core\User;

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
        $groups = $discussion->recipientGroups->pluck('id');

        $groups->each(function ($requiredGroupId) use ($actor) {
            if ($actor->groups()->find($requiredGroupId)) {
                return true;
            }
        });

        return false;
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
