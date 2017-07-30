<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Davis\SocialProfile;

use Flarum\Core\Validator\AbstractValidator;
use Flarum\Event\ConfigureValidator;

class ProfileValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'socialButtons' => ['json', 'socialbuttons'],
        'title' => ['string', 'max:55', 'required'],
        'url' => ['url', 'max:120', 'required'],
        'icon' => ['string', 'max:35', 'required'],
        'favicon' => ['string', 'max:120', 'required'],
    ];

    /**
     * {@inheritdoc}
     */
    protected function getMessages()
    {
        return [
            'socialButtons.socialbuttons' => 'The data you sent is missing required variables.',
        ];
    }

    /**
     * {@inheritdoc}
     */
    protected function makeValidator(array $attributes)
    {
        $rules = array_only($this->getRules(), array_keys($attributes));

        $this->validator->extend('socialbuttons', function ($attribute, $value, $parameters, $validator) {
            return $this->validateSocialButtons($attribute, $value, $parameters, $validator);
        });
        $validator = $this->validator->make($attributes, $rules, $this->getMessages());

        $this->events->fire(
            new ConfigureValidator($this, $validator)
        );

        return $validator;
    }

    protected function validateSocialButtons($attribute, $value, $parameters, $validator)
    {
        if ($value != '[]') {
            $data = json_decode($value);

            foreach ($data as $button) {
                if (! isset($button->title)) {
                    return false;
                } elseif (! isset($button->url)) {
                    return false;
                } elseif (! isset($button->icon)) {
                    return false;
                } elseif (! isset($button->favicon)) {
                    return false;
                } else {
                    $attributes = [
                        'title' => $button->title,
                        'url' => $button->url,
                        'icon' => $button->icon,
                        'favicon' => $button->favicon,
                    ];
                    $this->assertValid($attributes);

                    return true;
                }
            }
        } else {
            return true;
        }
    }
}
