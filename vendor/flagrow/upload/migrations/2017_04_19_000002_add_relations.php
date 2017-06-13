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
        $schema->table('flagrow_file_downloads', function (Blueprint $table) {
            $table->foreign('file_id')
                ->references('id')
                ->on('flagrow_files')
                ->onDelete('cascade');

            $table->foreign('discussion_id')
                ->references('id')
                ->on('discussions')
                ->onDelete('set null');

            $table->foreign('actor_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    },
    'down' => function (Builder $schema) {
    }
];
