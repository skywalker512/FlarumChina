<?php

namespace Flagrow\Masquerade\Listeners;

use Flagrow\Masquerade\Answer;
use Flagrow\Masquerade\Api\Serializers\AnswerSerializer;
use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\UserBasicSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Core\User;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddUserBioRelationship
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'addUserBioRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'addUserBioToApi']);
        $events->listen(PrepareApiAttributes::class, [$this, 'addUserBioApiAttributes']);
        $events->listen(ConfigureApiController::class, [$this, 'addUserBioIncludes']);
    }

    /**
     * @param GetModelRelationship $event
     * @return mixed
     */
    public function addUserBioRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(User::class, 'bioFields')) {
            return $event->model->hasMany(Answer::class)
                ->whereHas('field', function ($q) {
                    $q->where('on_bio', true);
                });
        }
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship
     */
    public function addUserBioToApi(GetApiRelationship $event)
    {
        if ($event->model instanceof User && $event->relationship == 'bioFields') {
            return $event->serializer->hasMany($event->model, AnswerSerializer::class, 'bioFields');
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function addUserBioApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->model instanceof User) {
            if ($event->actor->cannot('flagrow.masquerade.view-profile')) {
                $event->model->setRelation('bioFields', null);
            }

            $event->model->load('bioFields');
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function addUserBioIncludes(ConfigureApiController $event)
    {
        if (in_array($event->controller->serializer, [
            UserBasicSerializer::class,
            UserSerializer::class,
            CurrentUserSerializer::class
        ])) {
            $event->addInclude('bioFields');
            $event->addInclude('bioFields.field');
        }
    }
}
