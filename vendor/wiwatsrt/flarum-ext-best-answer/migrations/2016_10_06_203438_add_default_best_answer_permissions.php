<?php

use Illuminate\Database\ConnectionInterface;
$permissionAttributes = [
    'group_id' => 3, // Default group ID of members
    'permission' => 'discussion.selectBestAnswer',
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
    }
];