<?php

namespace Flagrow\Byobu\Listeners;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddPermissions
{

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['canStartPrivateDiscussion'] = $event->actor->can('startPrivateDiscussionWithUsers') || $event->actor->can('startPrivateDiscussionWithGroups');
            $event->attributes['canStartPrivateDiscussionWithUsers'] = $event->actor->can('startPrivateDiscussionWithUsers');
            $event->attributes['canStartPrivateDiscussionWithGroups'] = $event->actor->can('startPrivateDiscussionWithGroups');
        }
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['canEditRecipients'] = $event->actor->can('editUserRecipients', $event->model) || $event->actor->can('editGroupRecipients', $event->model);
            $event->attributes['canEditUserRecipients'] = $event->actor->can('editUserRecipients', $event->model);
            $event->attributes['canEditGroupRecipients'] = $event->actor->can('editGroupRecipients', $event->model);
        }
    }
}
