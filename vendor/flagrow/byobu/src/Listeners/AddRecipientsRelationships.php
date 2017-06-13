<?php

namespace Flagrow\Byobu\Listeners;

use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\GroupSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Core\Discussion;
use Flarum\Core\Group;
use Flarum\Core\User;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddRecipientsRelationships
{

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiRelationship']);
        $events->listen(ConfigureApiController::class, [$this, 'includeRecipientsRelationship']);
    }

    /**
     * @param GetModelRelationship $event
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'recipientUsers')) {
            return $event->model->belongsToMany(
                User::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', null);
        }
        if ($event->isRelationship(User::class, 'privateDiscussions')) {
            return $event->model->belongsToMany(
                Discussion::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', null);
        }
        if ($event->isRelationship(Discussion::class, 'oldRecipientUsers')) {
            return $event->model->belongsToMany(
                User::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', '!=', 'null');
        }


        if ($event->isRelationship(Discussion::class, 'recipientGroups')) {
            return $event->model->belongsToMany(
                Group::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', null);
        }
        if ($event->isRelationship(Group::class, 'privateDiscussions')) {
            return $event->model->belongsToMany(
                Discussion::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', null);
        }
        if ($event->isRelationship(Discussion::class, 'oldRecipientGroups')) {
            return $event->model->belongsToMany(
                Group::class,
                'recipients'
            )
                ->withTimestamps()
                ->wherePivot('removed_at', '!=', 'null');
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function includeRecipientsRelationship(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class)
            || $event->isController(Controller\ShowDiscussionController::class)
            || $event->isController(Controller\CreateDiscussionController::class)
        ) {
            $event->addInclude('recipientUsers');
            $event->addInclude('oldRecipientUsers');
            $event->addInclude('recipientGroups');
            $event->addInclude('oldRecipientGroups');
        }
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship
     */
    public function getApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'recipientUsers')) {
            return $event->serializer->hasMany($event->model, UserSerializer::class, 'recipientUsers');
        }
        if ($event->isRelationship(DiscussionSerializer::class, 'oldRecipientUsers')) {
            return $event->serializer->hasMany($event->model, UserSerializer::class, 'oldRecipientUsers');
        }

        if ($event->isRelationship(DiscussionSerializer::class, 'recipientGroups')) {
            return $event->serializer->hasMany($event->model, GroupSerializer::class, 'recipientGroups');
        }
        if ($event->isRelationship(DiscussionSerializer::class, 'oldRecipientGroups')) {
            return $event->serializer->hasMany($event->model, GroupSerializer::class, 'oldRecipientGroups');
        }


        if ($event->isRelationship(UserSerializer::class, 'privateDiscussions')) {
            return $event->serializer->hasMany($event->model, DiscussionSerializer::class, 'privateDiscussions');
        }
    }
}
