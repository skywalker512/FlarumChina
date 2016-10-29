<?php

use Flarum\Database\Migration;

return Migration::addColumns(
    'pages',
    [
        'is_html' => ['boolean', 'default' => 0]
    ]
);
