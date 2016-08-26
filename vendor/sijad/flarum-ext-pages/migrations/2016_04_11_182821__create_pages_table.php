<?php

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'pages',
    function (Blueprint $table) {
        $table->increments('id');

        $table->string('title', 200);
        $table->string('slug', 200);
        $table->dateTime('time');
        $table->dateTime('edit_time')->nullable();
        $table->text('content')->nullable();

        $table->boolean('is_hidden')->default(0);
    }
);
