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
use Reflar\gamification\Validator\RankValidator;

class CreateRankHandler
{
    use AssertPermissionTrait;

    /**
     * @var RankValidator
     */
    protected $validator;

    /**
     * @param RankValidator $validator
     */
    public function __construct(RankValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param CreateRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(CreateRank $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $rank = Rank::build(
            array_get($data, 'attributes.name'),
            array_get($data, 'attributes.color'),
            array_get($data, 'attributes.points')
        );

        $this->validator->assertValid($rank->getAttributes());

        $rank->save();

        return $rank;
    }
}
