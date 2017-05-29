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

use Flarum\Core\Validator\AbstractValidator;
use Symfony\Component\Translation\TranslatorInterface;

class AgeGenderValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected function getRules()
    {
        $this->translator = app()->make(TranslatorInterface::class);
        $genders = $this->translator->trans('reflar-usermanagement.forum.signup.male').','.$this->translator->trans('reflar-usermanagement.forum.signup.female').','.$this->translator->trans('reflar-usermanagement.forum.signup.other');

        return [
              'age' => [
                  'integer',
                  'max:100',
              ],
              'gender' => [
                  'string',
                  'in:'.$genders,
              ],
          ];
    }
}
