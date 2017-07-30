<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('flagrow_masquerade_fields', function (Blueprint $table) {
            $table->boolean('on_bio')->default(false);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('flagrow_masquerade_fields', function (Blueprint $table) {
            $table->dropColumn('on_bio');
        });
    }
];
