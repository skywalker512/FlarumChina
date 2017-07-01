<?php namespace Flagrow\Analytics\Listeners;

use DirectoryIterator;
use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\ConfigureLocales;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    public function addAssets(ConfigureClientView $event)
    {
        if($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../less/admin/analyticsPage.less',
                __DIR__ . '/../../js/admin/dist/extension.js',
            ]);

            $event->addBootstrapper('flagrow/analytics/main');
        } elseif($event->isForum())
        {
            $event->addAssets([
                __DIR__ . '/../../js/forum/dist/extension.js'
            ]);

            $event->addBootstrapper('flagrow/analytics/main');
        }
    }

    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}
