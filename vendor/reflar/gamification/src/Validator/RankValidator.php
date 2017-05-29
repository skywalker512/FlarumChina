<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Validator;

use Flarum\Core\Validator\AbstractValidator;

class RankValidator extends AbstractValidator
{
    protected $rules = [
        'name'   => ['required', 'string'],
        'color'  => ['required', 'string'],
        'points' => ['required', 'integer'],
    ];
}
