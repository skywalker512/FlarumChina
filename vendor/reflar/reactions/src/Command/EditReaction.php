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

use Flarum\Core\User;

class EditReaction
{
    /**
     * The ID of the reaction to edit.
     *
     * @var int
     */
    public $pageId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes to update on the reaction.
     *
     * @var array
     */
    public $data;

    /**
     * @param int   $pageId The ID of the page to edit.
     * @param User  $actor  The user performing the action.
     * @param array $data   The attributes to update on the reaction.
     */
    public function __construct($reactionId, User $actor, array $data)
    {
        $this->reactionId = $reactionId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
