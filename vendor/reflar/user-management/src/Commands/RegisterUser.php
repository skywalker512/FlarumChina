<?php

/*
 * This file is based on Flarum\Core\Command\RegisterUser.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Sijad\ReCaptcha\RecaptchaValidator;

class RegisterUser
{
    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes of the new user.
     *
     * @var array
     */
    public $data;

    /**
     * @param User  $actor The user performing the action.
     * @param array $data  The attributes of the new user.
     */
    public function __construct(User $actor, array $data)
    {
        if (app()->make(SettingsRepositoryInterface::class)->get('ReFlar-recaptcha') == true) {
            app()->make(RecaptchaValidator::class)->assertValid([
                'g-recaptcha-response' => array_get($data, 'attributes.g-recaptcha-response'),
            ]);
        }
        $this->actor = $actor;
        $this->data = $data;
    }
}
