<?php namespace Davis\InviteOnly\Providers;

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
        $avatarsFilesystem = function (Container $app) {
            return $app->make('Illuminate\Contracts\Filesystem\Factory')->disk('flarum-avatars')->getDriver();
        };
        $this->app->when('Davis\InviteOnly\Commands\RegisterUserHandler')
            ->needs('League\Flysystem\FilesystemInterface')
            ->give($avatarsFilesystem);
    }
}