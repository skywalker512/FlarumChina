<?php

namespace Flagrow\Upload\Providers;

use Flagrow\Upload\Commands\DownloadHandler;
use Flagrow\Upload\Downloader\DefaultDownloader;
use Flarum\Foundation\AbstractServiceProvider;

class DownloadProvider extends AbstractServiceProvider
{
    public function register()
    {
        DownloadHandler::addDownloader(
            $this->app->make(DefaultDownloader::class)
        );

        $this->loadViewsFrom(__DIR__ . '/../../assets/templates', 'flagrow.download.templates');
    }
}
