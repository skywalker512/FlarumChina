<?php

namespace Flagrow\Bazaar\Providers;

use Flagrow\Bazaar\Composer\ComposerEnvironment;
use Flarum\Foundation\AbstractServiceProvider;
use Illuminate\Filesystem\Filesystem;

class ComposerEnvironmentProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->app->singleton(ComposerEnvironment::class, function($app) {
            return new ComposerEnvironment(
                $app->basePath(),
                storage_path('composer-home'),
                $app->make(Filesystem::class));
        });
    }
}
