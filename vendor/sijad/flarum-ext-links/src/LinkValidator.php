<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links;

use Flarum\Core\Validator\AbstractValidator;

class LinkValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'title' => ['required'],
        'url' => ['required']
    ];
}
