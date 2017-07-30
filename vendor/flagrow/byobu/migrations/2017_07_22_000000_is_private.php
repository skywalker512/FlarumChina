<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (\Illuminate\Database\ConnectionInterface $connection) {

        $ids = $connection->table('recipients')
            ->select('discussion_id')
            ->groupBy('discussion_id')
            ->get();

        $connection->table('discussions')
            ->whereIn('id', collect($ids)->pluck('discussion_id')->all())
            ->update(['is_private' => 1]);
    },
    'down' => function (Builder $schema) {
        // .. bugger off
    }
];
