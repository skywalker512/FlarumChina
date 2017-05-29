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

class ActivateSerializer extends AbstractSerializer
{
    protected $type = 'users';

    protected function getDefaultAttributes($users)
    {
        return [
            'username' => $users->username,
        ];
    }
}
