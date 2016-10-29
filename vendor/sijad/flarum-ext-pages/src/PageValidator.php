<?php

namespace Sijad\Pages;

use Flarum\Core\Validator\AbstractValidator;

class PageValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'title' => [
            'required',
            'max:200',
        ],
        'slug' => [
            'required',
            'max:200',
        ],
        'content' => [
            'required',
            'max:65535',
        ],
    ];
}
