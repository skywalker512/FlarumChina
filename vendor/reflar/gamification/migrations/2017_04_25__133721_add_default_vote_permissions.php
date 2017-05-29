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
use Illuminate\Database\ConnectionInterface;

$permissionAttributes = [
    'group_id'   => 3,
    'permission' => 'discussion.vote',
];

return [
    'up' => function (ConnectionInterface $db) use ($permissionAttributes) {
        $instance = $db->table('permissions')->where($permissionAttributes)->first();

        if (is_null($instance)) {
            $db->table('permissions')->insert($permissionAttributes);
        }
    },

    'down' => function (ConnectionInterface $db) use ($permissionAttributes) {
        $db->table('permissions')->where($permissionAttributes)->delete();
    },
];
