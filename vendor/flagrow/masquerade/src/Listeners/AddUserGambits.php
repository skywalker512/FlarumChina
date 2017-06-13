<?php

namespace Flagrow\Masquerade\Listeners;

use Flagrow\Masquerade\Gambits\AnswerGambit;
use Flarum\Event\ConfigureUserGambits;
use Illuminate\Contracts\Events\Dispatcher;

class AddUserGambits
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureUserGambits::class, [$this, 'add']);
    }

    /**
     * @param ConfigureUserGambits $event
     */
    public function add(ConfigureUserGambits $event)
    {
        $event->gambits->add(AnswerGambit::class);
    }
}
