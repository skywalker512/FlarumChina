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

class ReactionSerializer extends AbstractSerializer
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
            'identifier' => $reaction->identifier,
            'type'       => $reaction->type
        ];
    }
}
