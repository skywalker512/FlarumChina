<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('flagrow_masquerade_fields', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('required')->default(false);
            $table->string('validation')->nullable();
            $table->string('prefix')->nullable();
            $table->string('icon')->nullable();
            $table->integer('sort')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_masquerade_fields');
    }
];
