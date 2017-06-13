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

namespace Flagrow\Upload\Helpers;

use Aws\AwsClient;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Techyah\Flysystem\OVH\OVHClient;

/**
 * @property int $maxFileSize
 */
class Settings
{
    const DEFAULT_MAX_FILE_SIZE = 2048;
    const DEFAULT_MAX_IMAGE_WIDTH = 100;

    /**
     * The settings shared with the frontend.
     *
     * @var array
     */
    protected $frontend = [
    ];

    /**
     * All setting options of this extension.
     *
     * @var array
     */
    protected $definition = [
        'mimeTypes',

        // Images
        'mustResize',
        'resizeMaxWidth',
        'cdnUrl',

        // Watermarks
        'addsWatermarks',
        'watermarkPosition',
        'watermark',

        // Override avatar upload
        'overrideAvatarUpload',

        // Imgur
        'imgurClientId',

        // AWS
        'awsS3Key',
        'awsS3Secret',
        'awsS3Bucket',
        'awsS3Region',

        // OVH
        'ovhUsername',
        'ovhPassword',
        'ovhTenantId',
        'ovhContainer',
        'ovhRegion',

        // Downloads
        'disableHotlinkProtection',
        'disableDownloadLogging',
    ];

    protected $prefix = 'flagrow.upload.';

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __get($name)
    {
        return $this->settings->get($this->prefix . $name);
    }

    public function __set($name, $value)
    {
        $this->settings->set($this->prefix . $name, $value);
    }

    public function __isset($name)
    {
        return $this->settings->get($this->prefix . $name) !== null;
    }

    /**
     * @param bool $prefixed
     * @param array|null $only
     * @return array
     */
    public function toArray($prefixed = true, array $only = null)
    {
        $definition = $this->definition;

        if ($only !== null) {
            $definition = Arr::only($definition, $only);
        }

        $result = [];

        foreach ($definition as $property) {
            if ($prefixed) {
                $result[$this->prefix . $property] = $this->get($property);
            } else {
                $result[$property] = $this->get($property);
            }
        }

        return $result;
    }

    /**
     * Loads only settings used in the frontend.
     *
     * @param bool $prefixed
     * @param array|null $only
     * @return array
     */
    public function toArrayFrontend($prefixed = true, array $only = [])
    {
        $only = array_merge($only, $this->frontend);

        return $this->toArray($prefixed, $only);
    }

    /**
     * @param $name
     * @param null $default
     * @return null
     */
    public function get($name, $default = null)
    {
        return $this->{$name} ? $this->{$name} : $default;
    }

    /**
     * @return array
     */
    public function getDefinition()
    {
        return $this->definition;
    }

    /**
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    /**
     * @return Collection
     */
    public function getAvailableUploadMethods()
    {
        /** @var Collection $methods */
        $methods = [
            'local',
        ];

        if (class_exists(AwsClient::class)) {
            $methods[] = 'aws-s3';
        }

        if (class_exists(OVHClient::class)) {
            $methods[] = 'ovh-svfs';
        }

        $methods[] = 'imgur';

        return collect($methods)
            ->keyBy(function ($item) {
                return $item;
            })
            ->map(function ($item) {
                return app('translator')->trans('flagrow-upload.admin.upload_methods.' . $item);
            });
    }

    /**
     * @param $field
     * @param null $default
     * @param null $attribute
     * @return Collection|mixed|null
     */
    public function getJsonValue($field, $default = null, $attribute = null)
    {
        $json = $this->{$field};

        if (empty($json)) {
            return $default;
        }

        $collect = collect(json_decode($json, true));

        if ($attribute) {
            return $collect->get($attribute, $default);
        }

        return $collect;
    }

    /**
     * @return Collection
     */
    public function getMimeTypesConfiguration()
    {
        return $this->getJsonValue(
            'mimeTypes',
            collect(['^image\/.*' => 'local'])
        );
    }
}
