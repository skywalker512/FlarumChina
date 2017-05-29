<?php

/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Listeners;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\UserManagement\Api\Controllers\AttributesController;
use Reflar\UserManagement\Api\Controllers\DeleteStrikeController;
use Reflar\UserManagement\Api\Controllers\ListStrikesController;
use Reflar\UserManagement\Api\Controllers\RegisterController;
use Reflar\UserManagement\Api\Controllers\ServeStrikeController;

class AddApiAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'addAttributes']);
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/reflar/usermanagement/register', 'reflar.usermanagement.register', RegisterController::class);
        $event->post('/strike', 'strike', ServeStrikeController::class);
        $event->post('/reflar/usermanagement/attributes', 'reflar.usermanagement.attributes', AttributesController::class);
        $event->get('/strike/{userId}', 'strike', ListStrikesController::class);
        $event->delete('/strike/{id}', 'strike', DeleteStrikeController::class);
    }

     /**
      * @param PrepareApiAttributes $event
      */
     public function addAttributes(PrepareApiAttributes $event)
     {
         if ($event->isSerializer(DiscussionSerializer::class)) {
             $event->attributes['canStrike'] = $event->actor->can('strike', $event->model);
         }
         if ($event->isSerializer(ForumSerializer::class)) {
             $event->attributes['ReFlar-emailRegEnabled'] = $this->settings->get('ReFlar-emailRegEnabled');
             $event->attributes['ReFlar-genderRegEnabled'] = $this->settings->get('ReFlar-genderRegEnabled');
             $event->attributes['ReFlar-ageRegEnabled'] = $this->settings->get('ReFlar-ageRegEnabled');
             $event->attributes['ReFlar-amountPerPage'] = $this->settings->get('ReFlar-amountPerPage');
         }
         if ($event->isSerializer(UserSerializer::class)) {
             $event->attributes['canActivate'] = $event->actor->can('activate', $event->model);
             $event->attributes['canViewStrike'] = $event->actor->can('strike', $event->model);
             $event->attributes['gender'] = $event->model->gender;
             $event->attributes['age'] = $event->model->age;
         }
     }
}
