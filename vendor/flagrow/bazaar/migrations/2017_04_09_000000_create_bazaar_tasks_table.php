<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('bazaar_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('status', 50)->nullable();
            $table->string('command', 50);
            $table->string('package', 100)->nullable();
            $table->text('output');
            $table->dateTime('created_at');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('bazaar_tasks');
    }
];
