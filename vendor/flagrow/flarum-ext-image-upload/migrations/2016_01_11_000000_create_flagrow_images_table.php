<?php
/*
 * This file is part of flagrow/flarum-ext-image-upload.
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
        $schema->create('flagrow_images', function (Blueprint $table) {
            $table->increments('id');

            // the user who posted the image
            $table->integer('user_id')->unsigned()->nullable();

            // the specific post id this image is appearing in
            $table->integer('post_id')->unsigned();

            // file name of the image
            $table->string('file_name')->nullable();

            // the method this file was uploaded to, allows for future erasing on remote systems
            $table->string('upload_method');

            // adds created_at
            $table->timestamp('created_at');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_images');
    }
];
