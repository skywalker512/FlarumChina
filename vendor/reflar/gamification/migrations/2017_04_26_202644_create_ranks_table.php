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
        $schema->create('ranks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('points')->unsigned();
            $table->string('name');
            $table->string('color');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('ranks');
    },
];
