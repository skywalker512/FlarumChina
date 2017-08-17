<?php
/*
* This file is part of flagrow/flarum-ext-split.
*
* Copyright (c) Flagrow.
*
* http://flagrow.github.io
*
* For the full copyright and license information, please view the license.md
* file that was distributed with this source code.
*/

namespace Flagrow\Split\Listeners;

use Flagrow\Split\Api\Controllers\SplitController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Flags\Api\Controller;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class AddSplitApi
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
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['canSplit'] = $event->actor->can('split', $event->model);
        }
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/split', 'flagrow.split.run', SplitController::class);
    }
}
