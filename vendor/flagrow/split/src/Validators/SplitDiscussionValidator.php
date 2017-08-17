<?php
/*
 * This file is part of flagrow/flarum-ext-split.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Split\Validators;

use Flarum\Core\Validator\AbstractValidator;

class SplitDiscussionValidator extends AbstractValidator
{
    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'start_post_id' => [
                'required',
                'int'
            ],
            'end_post_id' => [
                'required',
                'int'
            ],
            'title' => [
                'required',
                'string'
            ],
        ];
    }
}
