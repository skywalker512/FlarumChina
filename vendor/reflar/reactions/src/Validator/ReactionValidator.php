<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Validator;

use Flarum\Core\Validator\AbstractValidator;

class ReactionValidator extends AbstractValidator
{
    protected $rules = [
        'identifier' => [
            'required',
            'string',
            'unique:reactions'
        ],
        'type' => [
            'required',
            'string',
            'regex:/icon|emoji/i'
        ]
    ];
}
