<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Davis\SocialProfile\Listeners;

use Davis\SocialProfile\Events\UserButtonsWereChanged;
use Davis\SocialProfile\ProfileValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\UserWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class UpdateProfileInDatabase
{
    use AssertPermissionTrait;

    /**
     * Validator for limited suspension.
     *
     * @var SuspendValidator
     */
    protected $validator;

    /**
     * @param SuspendValidator $validator
     */
    public function __construct(ProfileValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(UserWillBeSaved::class, [$this, 'whenUserWillBeSaved']);
    }

    /**
     * @param UserWillBeSaved $event
     */
    public function whenUserWillBeSaved(UserWillBeSaved $event)
    {
        $attributes = array_get($event->data, 'attributes', []);

        if (array_key_exists('socialButtons', $attributes)) {
            $this->validator->assertValid($attributes);

            $user = $event->user;
            $actor = $event->actor;

            if ($actor->id !== $user->id) {
                $this->assertPermission(
                    $this->elementsOnlyRemoved(
                        $user->social_buttons,
                        $attributes['socialButtons']
                    )
                );
                $this->assertCan($actor, 'edit', $user);
            }

            $user->social_buttons = $attributes['socialButtons'];
            $user->raise(new UserButtonsWereChanged($user));
        }
    }

    protected function elementsOnlyRemoved($current, $proposed)
    {
        $current = json_decode($current);
        $proposed = json_decode($proposed);

        foreach ($proposed as $component) {
            if (! $this->hasMatchingComponent($current, $component)) {
                return false;
            }
        }

        return true;
    }

    protected function hasMatchingComponent($array, $component)
    {
        $foundMatch = false;

        foreach ($array as $test) {
            if ($component == $test) {
                $foundMatch = true;
                break;
            }
        }

        return $foundMatch;
    }
}
