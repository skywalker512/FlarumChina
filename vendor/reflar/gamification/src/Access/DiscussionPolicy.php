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

namespace Reflar\gamification\Access;

use Flarum\Core\Access\AbstractPolicy;
use Flarum\Core\Discussion;
use Flarum\Core\User;

class DiscussionPolicy extends AbstractPolicy
{
    /**
     * {@inheritdoc}
     */
    protected $model = Discussion::class;

    /**
     * @param User       $actor
     * @param Discussion $discussion
     *
     * @return bool
     */
    public function vote(User $actor, Discussion $discussion)
    {
        if ($discussion->is_locked && $actor->cannot('lock', $discussion)) {
            return false;
        }
    }
}
