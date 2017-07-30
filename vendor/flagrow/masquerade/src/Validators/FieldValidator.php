<?php

namespace Flagrow\Masquerade\Validators;

use Flarum\Core\Validator\AbstractValidator;

class FieldValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'name' => ['required', 'string'],
            'description' => ['string'],
            'required' => ['boolean'],
            'validation' => ['string'],
            'icon' => ['string'],
            'prefix' => ['string'],
            'on_bio' => ['boolean']
        ];
    }
}
