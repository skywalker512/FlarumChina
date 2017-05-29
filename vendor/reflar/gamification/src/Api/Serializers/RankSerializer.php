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

namespace Reflar\gamification\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Reflar\gamification\Rank;

class RankSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'ranks';

    /**
     * @param $group
     *
     * @return array
     */
    protected function getDefaultAttributes($rank)
    {
        if (!($rank instanceof Rank)) {
            throw new InvalidArgumentException(
                get_class($this).' can only serialize instances of '.Rank::class
            );
        }

        return [
            'points' => $rank->points,
            'name'   => $rank->name,
            'color'  => $rank->color,
        ];
    }
}
