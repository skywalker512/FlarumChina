<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('ref_id');

            $table->boolean('is_internal')->default(0);
            $table->boolean('is_newtab')->default(0);
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('links', function (Blueprint $table) {
            $table->string('type', 30);
            $table->integer('ref_id')->unsigned()->nullable();

            $table->dropColumn('is_internal');
            $table->dropColumn('is_newtab');
        });
    }
];
