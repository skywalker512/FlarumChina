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

namespace Reflar\Reactions\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Reflar\Reactions\Reaction;

class DeleteReactionHandler
{
    use AssertPermissionTrait;

    /**
     * @param DeleteReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return Reaction
     */
    public function handle(DeleteReaction $command)
    {
        $actor = $command->actor;

        $this->assertAdmin($actor);

        $reaction = Reaction::where('id', $command->reactionId)->first();

        $reaction->delete();

        return;
    }

}
