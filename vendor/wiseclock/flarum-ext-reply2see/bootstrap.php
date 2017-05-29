<?php

namespace WiseClock\Reply2See;

use DirectoryIterator;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureFormatter;

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

    $events->listen(ConfigureFormatter::class, function (ConfigureFormatter $event)
    {
        $event->configurator->BBCodes->addCustom(
            '[REPLY]{TEXT}[/REPLY]',
            '<reply2see>{TEXT}</reply2see>'
        );
    });

    $events->listen(ConfigureClientView::class, function (ConfigureClientView $event)
    {
        if ($event->isForum())
        {
            $event->addAssets([
                __DIR__.'/js/forum/dist/extension.js',
                __DIR__.'/less/reply2see.less',
            ]);
            $event->addBootstrapper('wiseclock/flarum-ext-reply2see/main');
        }
    });
};
