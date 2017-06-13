<?php

namespace Flagrow\Byobu\Listeners;

use Flagrow\Byobu\Gambits\Discussion\PrivacyGambit;
use Flarum\Event\ConfigureDiscussionGambits;
use Illuminate\Contracts\Events\Dispatcher;

class AddGambits
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureDiscussionGambits::class, [$this, 'addPrivacyGambit']);
    }

    /**
     * @param ConfigureDiscussionGambits $event
     */
    public function addPrivacyGambit(ConfigureDiscussionGambits $event)
    {
        $event->gambits->add(PrivacyGambit::class);
    }
}
