<?php

/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up'   => function (Builder $schema) {
        $schema->table('users', function (Blueprint $table) {
            $table->string('gender');
            $table->integer('age');
            $table->integer('strikes');
        });
    },
  'down' => function (Builder $schema) {
      $schema->table('users', function (Blueprint $table) {
          $table->dropColumn('gender');
          $table->dropColumn('age');
          $table->dropColumn('strikes');
      });
  },
  ];
