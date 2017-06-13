<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up'   => function (Builder $schema) {
        $schema->create('flagrow_file_downloads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('file_id')->unsigned();
            $table->integer('discussion_id')->unsigned()->nullable();
            $table->integer('post_id')->unsigned()->nullable();
            $table->integer('actor_id')->unsigned()->nullable();
            $table->timestamp('downloaded_at');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_file_downloads');
    }
];
