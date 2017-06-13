<?php

namespace Flagrow\Masquerade\Validators;

use Flarum\Core\Validator\AbstractValidator;

class OrderFieldValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'sort' => ['required', 'array'],
        ];
    }
}
