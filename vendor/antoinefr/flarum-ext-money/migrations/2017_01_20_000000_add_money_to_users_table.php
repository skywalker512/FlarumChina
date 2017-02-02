<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'money' => ['integer']
]);