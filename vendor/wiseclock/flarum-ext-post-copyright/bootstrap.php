<?php

namespace WiseClock\PostCopyright;

use DirectoryIterator;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureClientView;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Event\ConfigureLocales;

return function (Dispatcher $events)
{
    $events->listen(ConfigureClientView::class, function (ConfigureClientView $event)
    {
        if ($event->isForum())
        {
            $event->addAssets([
                __DIR__.'/js/forum/dist/extension.js',
                __DIR__.'/less/post-copyright.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-post-copyright/main');
        }
        else if ($event->isAdmin())
        {
            $event->addAssets([
                __DIR__.'/js/admin/dist/extension.js',
                __DIR__.'/less/post-copyright-settings.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-post-copyright/main');
        }
    });

    $events->subscribe(Listeners\PostWillBeSavedListener::class);

    $events->listen(PrepareApiAttributes::class, function (PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class))
        {
            $event->attributes['copyright'] = $event->model->copyright;
        }
    });

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
};
