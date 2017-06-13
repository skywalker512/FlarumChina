<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Validators;

use Flagrow\Upload\Helpers\Settings;
use Flarum\Core\Validator\AbstractValidator;

class DownloadValidator extends AbstractValidator
{
    protected function getRules()
    {
        /** @var Settings $settings */
        $settings = app(Settings::class);

        $rules = [
            'url' => ['required', 'url'],
            'base_name' => ['required', 'string']
        ];

        return $rules;
    }
}
