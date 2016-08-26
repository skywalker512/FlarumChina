<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links;

use Flarum\Core\User;
use Illuminate\Database\Eloquent\Builder;

class LinkRepository
{
    /**
     * Find a link by ID
     *
     * @param int $id
     * @param User $actor
     * @return Link
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, User $actor = null)
    {
        return Link::where('id', $id)->firstOrFail();
    }

    /**
     * Get all links
     *
     * @param User|null $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Link::newQuery();
    }
}
