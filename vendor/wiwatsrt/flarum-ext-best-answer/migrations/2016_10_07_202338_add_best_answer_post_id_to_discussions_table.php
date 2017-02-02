<?php

use Flarum\Database\Migration;

return Migration::addColumns('discussions', [
    'best_answer_post_id' => ['integer', 'unsigned' => true, 'nullable' => true]
]);