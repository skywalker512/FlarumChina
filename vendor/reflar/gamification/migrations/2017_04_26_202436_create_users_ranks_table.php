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
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('users_ranks', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('rank_id')->unsigned();
            $table->primary(['user_id', 'rank_id']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('users_ranks');
    },
];
