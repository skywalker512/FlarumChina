<?php

namespace Flagrow\Upload\Providers;

use Flagrow\Upload\Helpers\Settings;
use Flarum\Foundation\AbstractServiceProvider;

class SettingsProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->app->singleton(Settings::class);
    }
}
