<?php

use Flarum\Database\Migration;

return Migration::addColumns('posts', [
    'copyright' => ['string', 'length' => 20, 'default' => 'authorized']
]);
