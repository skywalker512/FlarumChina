<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;
use Reflar\UserManagement\Validators\AgeGenderValidator;

class AttributesHandler
{
    use AssertPermissionTrait;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @var AgeGenderValidator
     */
    protected $validator;

    /**
     * @param UserRepository $users
     */
    public function __construct(UserRepository $users, AgeGenderValidator $validator)
    {
        $this->users = $users;
        $this->validator = $validator;
    }

    public function handle(Attributes $command)
    {
        $body = $command->body;

        if (array_get($body, 'gender') != '') {
            $this->validator->assertValid($body);

            $user = $command->actor;

            if (!$user || !$user->checkPassword(array_get($body, 'password'))) {
                throw new PermissionDeniedException();
            }

            $user->gender = array_get($body, 'gender');
            $user->age = array_get($body, 'age');
        } else {
            $this->assertCan($command->actor, 'user.activate');

            $user = $this->users->findByIdentification(array_get($body, 'username'), $command->actor);
            $user->activate();
        }

        $user->save();

        return true;
    }
}
