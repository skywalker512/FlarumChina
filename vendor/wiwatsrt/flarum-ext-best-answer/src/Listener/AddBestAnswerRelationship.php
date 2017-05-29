<?php

namespace WiwatSrt\BestAnswer\Listener;

use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Core\Discussion;
use Flarum\Core\Post;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddBestAnswerRelationship
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
        $events->listen(ConfigureApiController::class, [$this, 'includeBestAnswerPost']);
    }

    /**
     * @param GetModelRelationship $event
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'bestAnswerPost')) {
            return $event->model->belongsTo(Post::class, 'best_answer_post_id');
        }
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function getApiAttributes(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'bestAnswerPost')) {
            return $event->serializer->hasOne($event->model, PostSerializer::class, 'bestAnswerPost');
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['canSelectBestAnswer'] = (bool) $event->actor->can('selectBestAnswer', $event->model);
            $event->attributes['startUserId'] = $event->model->start_user_id;
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function includeBestAnswerPost(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class) || $event->isController(Controller\ShowDiscussionController::class)) {
            $event->addInclude('bestAnswerPost');
        }
    }
}
