<?php
/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Details\Listener;

use Flarum\Event\ConfigureFormatter;
use Illuminate\Contracts\Events\Dispatcher;

class AddBBCode
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'addBBCode']);
    }

    /**
     * @param ConfigureFormatter $event
     */
    public function addBBCode(ConfigureFormatter $event)
    {
        $event->configurator->BBCodes->addCustom(
            '[DETAILS title={TEXT1;optional}]{TEXT2}[/DETAILS]',
            '<details><summary>{TEXT1}</summary><div>{TEXT2}</div></details>'
        );
    }
}
