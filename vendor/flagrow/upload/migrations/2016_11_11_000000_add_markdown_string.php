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
        $schema->table('flagrow_files', function (Blueprint $table) {
            $table->string('markdown_string')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('flagrow_files', function (Blueprint $table) {
            $table->dropColumn('markdown_string');
        });
    }
];
