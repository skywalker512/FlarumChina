<?php

namespace Sijad\Pages;

use Flarum\Core\User;
use Illuminate\Database\Eloquent\Builder;

class PageRepository
{
    /**
     * Get a new query builder for the pages table.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query()
    {
        return Page::query();
    }

    /**
     * Find a page by ID.
     *
     * @param int  $id
     * @param User $user
     *
     * @return Page
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, User $user = null)
    {
        $query = Page::where('id', $id);
        return $this->scopeVisibleTo($query, $user)->firstOrFail();;
    }

    /**
     * Scope a query to only include records that are visible to a user.
     *
     * @param Builder $query
     * @param User $user
     * @return Builder
     */
    protected function scopeVisibleTo(Builder $query, User $user = null)
    {
        if ($user !== null && !$user->isAdmin()) {
            $query->whereIsHidden(0);
        }

        return $query;
    }
}
