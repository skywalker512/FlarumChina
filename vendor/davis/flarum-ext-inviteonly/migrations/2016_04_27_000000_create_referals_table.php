<?php 
use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'referals',
    function (Blueprint $table) {
        $table->increments('id');
        $table->integer('referrer')->unsigned();
        $table->string('token');
        $table->timestamp('created_at');
        $table->boolean('used');
        $table->integer('used_by');
        $table->timestamp('used_at')->nullable();
    }
);
