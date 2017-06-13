<?php

namespace Flagrow\Masquerade\Listeners;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class InjectPermissions
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'permissions']);
    }

    public function permissions(PrepareApiAttributes $event)
    {
        if ($event->serializer instanceof ForumSerializer) {
            $event->attributes['canViewMasquerade'] = $event->actor->can('flagrow.masquerade.view-profile');
            $event->attributes['canHaveMasquerade'] = $event->actor->can('flagrow.masquerade.have-profile');
        }
    }
}
