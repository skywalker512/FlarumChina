<?php

namespace WiseClock\ProfileImageCrop;

use DirectoryIterator;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureClientView;

return function (Dispatcher $events)
{
    $events->listen(ConfigureClientView::class, function (ConfigureClientView $event)
    {
        if ($event->isForum())
        {
            $event->addAssets([
                __DIR__.'/js/forum/dist/extension.js',
                __DIR__.'/js/forum/dist/croppie.min.js',
                __DIR__.'/style/croppie.css',
                __DIR__.'/style/profile-image-crop.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-profile-image-crop/main');
        }
    });
};
