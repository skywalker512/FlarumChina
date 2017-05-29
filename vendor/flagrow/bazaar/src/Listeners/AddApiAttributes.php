<?php

namespace Flagrow\Bazaar\Listeners;

use Flagrow\Bazaar\Search\FlagrowApi;
use Flarum\Event\PrepareUnserializedSettings;
use Illuminate\Events\Dispatcher;

class AddApiAttributes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareUnserializedSettings::class, [$this, 'addAdminAttributes']);
    }

    /**
     * @param PrepareUnserializedSettings $event
     */
    public function addAdminAttributes(PrepareUnserializedSettings $event)
    {
        $event->settings['flagrow.bazaar.flagrow-host'] = FlagrowApi::getFlagrowHost();
    }
}
