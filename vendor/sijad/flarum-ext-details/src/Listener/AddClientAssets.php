<?php

namespace Sijad\Details\Listener;

use DirectoryIterator;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAssets']);
    }

    public function addAssets(ConfigureClientView $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__.'/../../js/forum/dist/extension.js',
                __DIR__.'/../../less/forum/extension.less',
            ]);
            $event->addBootstrapper('sijad/details/main');
        }
    }
}
