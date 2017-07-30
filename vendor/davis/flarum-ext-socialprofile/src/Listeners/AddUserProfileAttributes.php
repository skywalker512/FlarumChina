<?php

/*
 * This file is part of davis/flarum-ext-socialprofile
 *
 * © Connor Davis <davis@produes.co>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Davis\SocialProfile\Listeners;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddUserProfileAttributes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'addApiAttributes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function addApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(UserSerializer::class)) {
            $event->attributes['socialButtons'] = $event->model->social_buttons;
        }
    }
}
