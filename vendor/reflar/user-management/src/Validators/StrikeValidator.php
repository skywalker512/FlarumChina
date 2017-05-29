<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Validators;

use Flarum\Core\Validator\AbstractValidator;

class StrikeValidator extends AbstractValidator
{
    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'post_id' => [
                'required',
                'int',
            ],
            'reason' => [
                'required',
                'string',
            ],
        ];
    }
}
