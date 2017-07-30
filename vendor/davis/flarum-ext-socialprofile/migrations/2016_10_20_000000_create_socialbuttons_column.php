<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'social_buttons' => ['longText', 'nullable' => true],
]);
