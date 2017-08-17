<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */


use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'posts_reactions',
    function (Blueprint $table) {
        $table->increments('id');
        $table->integer('post_id')->unsigned();
        $table->integer('user_id')->unsigned();
        $table->string('reaction_id');
    }
);
