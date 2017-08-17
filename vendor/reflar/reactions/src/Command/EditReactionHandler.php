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
use Reflar\Reactions\Validator\ReactionValidator;

class EditReactionHandler
{
    use AssertPermissionTrait;

    /**
     * @var ReactionValidator
     */
    protected $validator;

    /**
     * @param ReactionValidator $validator
     */
    public function __construct(ReactionValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param EditReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return Reaction
     */
    public function handle(EditReaction $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $reaction = Reaction::where('id', $command->reactionId)->first();

        if (isset($data['identifier'])) {
            $reaction->identifier = $data['identifier'];
        }

        if (isset($data['type'])) {
            $reaction->type = $data['type'];
        }

        $this->validator->assertValid($reaction->getDirty());

        $reaction->save();

        return $reaction;
    }
}
