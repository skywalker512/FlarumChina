<?php

use Flarum\Database\Migration;

return Migration::addColumns('posts', [
    'emailed' => ['boolean', 'default' => 0],
]);
