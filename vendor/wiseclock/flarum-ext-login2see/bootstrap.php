<?php

namespace WiseClock\Login2See;

use DirectoryIterator;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\ConfigureLocales;

return function (Dispatcher $events)
{
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);

    $events->listen(ConfigureLocales::class, function (ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__ . '/locale') as $file)
        {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml']))
            {
                $event->locales->addTranslations($file->getBasename('.' . $file->getExtension()), $file->getPathname());
            }
        }
    });

    $events->listen(ConfigureClientView::class, function (ConfigureClientView $event)
    {
        if ($event->isForum())
        {
            $event->addAssets([
                __DIR__.'/js/forum/dist/extension.js',
                __DIR__.'/less/login2see.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-login2see/main');
        }
        else if ($event->isAdmin())
        {
            $event->addAssets([
                __DIR__.'/js/admin/dist/extension.js',
                __DIR__.'/less/login2see-settings.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-login2see/main');
        }
    });
};
