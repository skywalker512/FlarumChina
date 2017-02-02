<?php

namespace WiwatSrt\BestAnswer\Listener;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddPostBestAnswerAttributes
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
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['hasBestAnswer'] = (bool) $event->model->has_best_answer;
            $event->attributes['startUserId'] = $event->model->start_user_id;
            $event->attributes['canSelectBestAnswer'] = (bool) $event->actor->can('selectBestAnswer', $event->model);
        }

        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['isBestAnswer'] = (bool) $event->model->is_best_answer;
        }
    }
}