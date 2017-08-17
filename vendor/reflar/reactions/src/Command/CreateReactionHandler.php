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

class CreateReactionHandler
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
     * @param CreateReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return Reaction
     */
    public function handle(CreateReaction $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $reaction = Reaction::build(
            array_get($data, 'identifier'),
            array_get($data, 'type')
        );

        $this->validator->assertValid($reaction->getAttributes());

        $reaction->save();

        return $reaction;
    }

}
