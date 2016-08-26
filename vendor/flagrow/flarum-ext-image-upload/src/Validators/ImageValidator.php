<?php
/*
 * This file is part of flagrow/flarum-ext-image-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\ImageUpload\Validators;

use Flarum\Core\Validator\AbstractValidator;

class ImageValidator extends AbstractValidator
{
    public $maxFileSize;

    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'image' => [
                'required',
                'image',
                'max:' . $this->maxFileSize
            ]
        ];
    }
}
