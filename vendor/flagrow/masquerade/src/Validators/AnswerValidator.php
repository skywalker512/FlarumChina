<?php

namespace Flagrow\Masquerade\Validators;

use Flagrow\Masquerade\Field;
use Flarum\Core\Validator\AbstractValidator;

class AnswerValidator extends AbstractValidator
{
    /**
     * @param Field $field
     * @return $this
     */
    public function setField(Field $field)
    {
        $rules = [];

        if ($field->required) {
            $rules[] = 'required';
        }

        if ($field->validation) {
            $rules = array_merge($rules, explode(',', $field->validation));
        }

        $this->rules = [$field->name => $rules];

        return $this;
    }
}
