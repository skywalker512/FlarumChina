<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('flagrow_masquerade_answers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('field_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->text('content')->nullable();
            $table->timestamps();

            $table->index(['id', 'field_id', 'user_id']);

            $table->foreign('field_id')
                ->references('id')
                ->on('flagrow_masquerade_fields')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_masquerade_answers');
    }
];
