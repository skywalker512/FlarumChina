<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'links',
    function (Blueprint $table) {
        $table->increments('id');
        $table->string('title', 50);
        $table->string('type', 30);
        $table->string('url', 255);
        $table->integer('ref_id')->unsigned()->nullable();
        $table->integer('position')->nullable();
    }
);

