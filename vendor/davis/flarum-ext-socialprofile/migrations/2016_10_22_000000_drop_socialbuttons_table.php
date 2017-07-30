<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->drop('socialbuttons');
    },
    'down' => function (Builder $schema) {
        $schema->create('socialbuttons', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->longText('buttons');
        });
    },
];
