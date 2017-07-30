<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

use Illuminate\Database\ConnectionInterface;

return [
    'up' => function (ConnectionInterface $db) {
        $results = $db->table('socialbuttons')->get();
        foreach ($results as $result) {
            $db->table('users')
                ->where('id', $result->user_id)
                ->update(['social_buttons' => $result->buttons]);
        }
    },
    'down' => function (ConnectionInterface $db) {
        $results = $db->table('users')->select('social_buttons')->get();
        foreach ($results as $result) {
            $db->table('socialbuttons')->insert(
                ['user_id' => $result->id, 'buttons' => $result->social_buttons]
            );
        }
    },
];
