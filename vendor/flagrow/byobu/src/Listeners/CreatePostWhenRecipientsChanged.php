<?php

namespace Flagrow\Byobu\Listeners;

use Flagrow\Byobu\Events\AbstractRecipientsEvent;
use Flagrow\Byobu\Events\DiscussionMadePrivate;
use Flagrow\Byobu\Events\DiscussionMadePublic;
use Flagrow\Byobu\Events\DiscussionRecipientsChanged;
use Flagrow\Byobu\Posts\RecipientsModified;
use Flarum\Event\ConfigurePostTypes;
use Illuminate\Contracts\Events\Dispatcher;

class CreatePostWhenRecipientsChanged
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigurePostTypes::class, [$this, 'addPostType']);
        $events->listen(DiscussionMadePrivate::class, [$this, 'whenDiscussionWasTagged']);
        $events->listen(DiscussionMadePublic::class, [$this, 'whenDiscussionWasTagged']);
        $events->listen(DiscussionRecipientsChanged::class, [$this, 'whenDiscussionWasTagged']);
    }

    /**
     * @param ConfigurePostTypes $event
     */
    public function addPostType(ConfigurePostTypes $event)
    {
        $event->add(RecipientsModified::class);
    }

    /**
     * @param AbstractRecipientsEvent $event
     */
    public function whenDiscussionWasTagged(AbstractRecipientsEvent $event)
    {
        if ($event->oldUsers->isEmpty() && $event->oldGroups->isEmpty()) {
            return;
        }

        $post = RecipientsModified::reply($event);

        $event->discussion->mergePost($post);
    }
}
