<?php

namespace Flagrow\Bazaar\Providers;

use Flagrow\Bazaar\Composer\ComposerEnvironment;
use Flarum\Foundation\AbstractServiceProvider;
use Illuminate\Filesystem\Filesystem;

class ComposerEnvironmentProvider extends AbstractServiceProvider
{
    public function boot(Filesystem $filesystem)
    {
        $this->app->singleton(ComposerEnvironment::class, function($app) use($filesystem) {
            return new ComposerEnvironment(
                $app->basePath(),
                $app->storagePath('/composer-home'),
                $filesystem);
        });
    }
}
