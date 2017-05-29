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

namespace Reflar\gamification\Commands;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Reflar\gamification\Rank;

class DeleteRankHandler
{
    use AssertPermissionTrait;

    /**
     * @param DeleteRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(DeleteRank $command)
    {
        $actor = $command->actor;

        $this->assertAdmin($actor);

        $rank = Rank::where('id', $command->rankId)->firstOrFail();

        $rank->delete();

        return $rank;
    }
}
