<?php
/*
 * This file is part of Flarum/Validator/UserValidator.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Validators;

use Flarum\Core\User;
use Flarum\Core\Validator\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use Symfony\Component\Translation\TranslatorInterface;

class UserValidator extends AbstractValidator
{
    /**
     * @var User
     */
    protected $user;

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * {@inheritdoc}
     */
    protected function getRules()
    {
        $this->translator = app()->make(TranslatorInterface::class);
        $idSuffix = $this->user ? ','.$this->user->id : '';
        $genders = $this->translator->trans('reflar-usermanagement.forum.signup.male').','.$this->translator->trans('reflar-usermanagement.forum.signup.female').','.$this->translator->trans('reflar-usermanagement.forum.signup.other');
        $validator = [
              'username' => [
                  'required',
                  'regex:/^[a-z0-9_-]+$/i',
                  'unique:users,username'.$idSuffix,
                  'min:3',
                  'max:30',
              ],
              'password' => [
                  'required',
                  'min:8',
              ],
          ];

        $this->settings = app()->make(SettingsRepositoryInterface::class);

        if ($this->settings->get('ReFlar-emailRegEnabled') == false) {
            $validator['email'] = ['required', 'email', 'unique:users,email'.$idSuffix];
        }

        if ($this->settings->get('ReFlar-ageRegEnabled') == true) {
            $validator['age'] = ['required', 'integer', 'max:100'];
        }

        if ($this->settings->get('ReFlar-genderRegEnabled') == true) {
            $validator['gender'] = ['required', 'string', 'in:'.$genders];
        }

        return $validator;
    }

    /**
     * {@inheritdoc}
     */
    protected function getMessages()
    {
        return [
            'username.regex' => $this->translator->trans('core.api.invalid_username_message'),
        ];
    }
}
