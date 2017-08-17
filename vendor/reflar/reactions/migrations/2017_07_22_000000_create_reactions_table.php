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


use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;
use Illuminate\Database\ConnectionInterface;

return [
    'up' => function (Builder $schema, ConnectionInterface $db) {
        $schema->create('reactions',function (Blueprint $table) {
            $table->increments('id');
            $table->string('identifier');
            $table->string('type');
        });

        /*
         *  Identifier can be an emoji name, or font-awesome icon
         *  Type is either emoji, or FA
        **/

        $db->table('reactions')->insert([
                ['identifier' => 'thumbsup', 'type' => 'emoji'],
                ['identifier' => 'thumbsdown', 'type' => 'emoji'],
                ['identifier' => 'laughing', 'type' => 'emoji'],
                ['identifier' => 'confused', 'type' => 'emoji'],
                ['identifier' => 'heart', 'type' => 'emoji'],
                ['identifier' => 'tada', 'type' => 'emoji']
            ]);
    },
];
