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

namespace Flagrow\ImageUpload\Providers;

use Flagrow\ImageUpload\Adapters\CloudinaryAdapter;
use Flagrow\ImageUpload\Adapters\ImgurAdapter;
use Flagrow\ImageUpload\Adapters\LocalAdapter;
use Flagrow\ImageUpload\Contracts\UploadAdapterContract;
use Illuminate\Container\Container;
use Illuminate\Support\ServiceProvider;
use Flagrow\ImageUpload\Commands\UploadImageHandler;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemInterface;
use Flarum\Settings\SettingsRepositoryInterface;

class StorageServiceProvider extends ServiceProvider
{

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $uploadAdapter = function (Container $app) {
            return $this->instantiateUploadAdapter($app);
        };

        $this->app->when(UploadImageHandler::class)
            ->needs(UploadAdapterContract::class)
            ->give($uploadAdapter);
    }

    /**
     * Sets the upload adapter for the specific preferred service.
     *
     * @param $app
     * @return FilesystemInterface
     */
    protected function instantiateUploadAdapter($app)
    {
        $settings = $app->make('flarum.settings');
        switch ($settings->get('flagrow.image-upload.uploadMethod', 'local')) {
            case 'imgur':
                return new ImgurAdapter($settings->get('flagrow.image-upload.imgurClientId'));
                break;
            case 'cloudinary':
                return new CloudinaryAdapter(
                    $settings->get('flagrow.image-upload.cloudinaryCloudName'),
                    $settings->get('flagrow.image-upload.cloudinaryApiKey'),
                    $settings->get('flagrow.image-upload.cloudinaryApiSecret')
                );
                break;
            default:
                return new LocalAdapter(
                    new Filesystem(new Local(public_path('assets/images'))),
                    $app->make(SettingsRepositoryInterface::class)
                );
        }
    }
}
