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
    'up' => function (Builder $schema) {
        $schema->create('flagrow_files', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('actor_id')->unsigned()->nullable();

            $table->integer('discussion_id')->unsigned()->nullable();
            $table->integer('post_id')->unsigned()->nullable();

            $table->string('base_name');
            $table->string('path')->nullable();
            $table->string('url');
            $table->string('type');
            $table->integer('size');

            $table->string('upload_method')->nullable();

            $table->timestamp('created_at');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_files');
    }
];
