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

namespace Reflar\Reactions\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

class PostReactionSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'reactions';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($reaction)
    {
        return [
            'identifier' => $reaction->pivot->reaction_id,
            'type'       => $reaction->type,
            'user_id'    => (int) $reaction->pivot->user_id,
            'post_id'    => (int) $reaction->pivot->post_id
        ];
    }
}
