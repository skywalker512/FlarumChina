<?php

namespace Flagrow\Upload\Providers;

use Flagrow\Upload\Commands\DownloadHandler;
use Flagrow\Upload\Downloader\DefaultDownloader;
use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Templates\FileTemplate;
use Flagrow\Upload\Templates\ImagePreviewTemplate;
use Flagrow\Upload\Templates\ImageTemplate;
use Flarum\Foundation\AbstractServiceProvider;

class DownloadProvider extends AbstractServiceProvider
{
    public function boot()
    {
    }

    public function register()
    {
        DownloadHandler::addDownloader(
            $this->app->make(DefaultDownloader::class)
        );

        $this->loadViewsFrom(__DIR__ . '/../../resources/templates', 'flagrow.download.templates');

        /** @var Settings $settings */
        $settings = $this->app->make(Settings::class);

        $settings->addRenderTemplate($this->app->make(FileTemplate::class));
        $settings->addRenderTemplate($this->app->make(ImageTemplate::class));
        $settings->addRenderTemplate($this->app->make(ImagePreviewTemplate::class));
    }
}
