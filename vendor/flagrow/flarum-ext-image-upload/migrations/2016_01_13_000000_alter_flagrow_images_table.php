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
        $schema->table('flagrow_images', function (Blueprint $table) {
            // the specific post id this image is appearing in
            $table->dropColumn('post_id');
            // file url of the image
            $table->string('file_url')->nullable();
            // file size of the image
            $table->integer('file_size')->default(0);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('flagrow_images', function (Blueprint $table) {
            $table->dropColumn('file_url');
            $table->dropColumn('file_size');
            $table->integer('post_id')->unsigned();
        });
    }
];
