<?php
/*
 * This file is part of flagrow/flarum-ext-image-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\ImageUpload\Listeners;

use Cloudinary;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareUnserializedSettings;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class LoadSettingsFromDatabase
{
    protected $settings;
    // this is the prefix we use in the settings table in the database
    protected $packagePrefix = 'flagrow.image-upload.';
    // those are the fields we need to get from the database
    protected $fieldsToGet = array(
        'uploadMethod',
        'imgurClientId',
        'mustResize',
        'resizeMaxWidth',
        'resizeMaxHeight'
    );

    /**
     * Gets the settings variable. Called on Object creation.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
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
            foreach ($this->fieldsToGet as $field) {
                $event->attributes[$this->packagePrefix . $field] = $this->settings->get($this->packagePrefix . $field);
            }
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
        // these are the upload methods that doesn't require external libraries
        $methods = [
            'local',
            'imgur'
        ];

        // check for Cloudinary, if present add the method
        if (class_exists(Cloudinary::class)) {
            $methods[] = 'cloudinary';
        }

        // add the methods with the relative translations
        $event->settings['flagrow.image-upload.availableUploadMethods'] = [];
        foreach ($methods as $method) {
            $event->settings['flagrow.image-upload.availableUploadMethods'][$method] = app('translator')->trans('flagrow-image-upload.admin.upload_methods.' . $method);
        }
    }
}
