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

class EditRankHandler
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
     * @param EditRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(EditRank $command)
    {
        $actor = $command->actor;
        $data = $command->data;
        $attributes = array_get($data, 'attributes', []);

        $validate = [];

        $this->assertAdmin($actor);

        $rank = Rank::where('id', $command->rankId)->firstOrFail();

        if (isset($attributes['points']) && $attributes['points'] !== '') {
            $validate['points'] = $attributes['points'];
            $rank->updatePoints($attributes['points']);
        }

        if (isset($attributes['name']) && $attributes['name'] !== '') {
            $validate['name'] = $attributes['name'];
            $rank->updateName($attributes['name']);
        }

        if (isset($attributes['color']) && $attributes['color'] !== '') {
            $validate['color'] = $attributes['color'];
            $rank->updateColor($attributes['color']);
        }

        $this->validator->assertValid(array_merge($rank->getDirty(), $validate));

        $rank->save();

        return $rank;
    }
}
