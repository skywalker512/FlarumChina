<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class StrikeSerializer extends AbstractSerializer
{
    protected $type = 'strikes';

    protected function getDefaultAttributes($strike)
    {
        return [
            'id'      => (int) $strike->id,
            'userId'  => (int) $strike->user_id,
            'post'    => $strike->discussion_id . '/'. $strike->post_id,
            'reason'  => $strike->reason,
            'actor'   => $strike->actor_id,
            'content' => $strike->post_content,
            'time'    => $strike->time,
        ];
    }
}
