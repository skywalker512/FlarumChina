<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Helpers\Settings;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareUnserializedSettings;
use Illuminate\Contracts\Events\Dispatcher;

class LoadSettingsFromDatabase
{
    /**
     * Gets the settings variable. Called on Object creation.
     *
     * @param Settings $settings
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareUnserializedSettings::class, [$this, 'addUploadMethods']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Get the setting values from the database and make them available
     * in the forum.
     *
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes = array_merge($event->attributes, $this->settings->toArrayFrontend());
        }
    }

    /**
     * Check for installed packages and provide the upload methods option
     * in the admin page-
     *
     * @param PrepareUnserializedSettings $event
     */
    public function addUploadMethods(PrepareUnserializedSettings $event)
    {
        $event->settings['flagrow.upload.availableUploadMethods'] = $this->settings->getAvailableUploadMethods()->toArray();
    }
}
