<?php

namespace Vingle\Configure\Smtp\Listener;

use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAssets']);
    }

    /**
     * @param ConfigureClientView $event
     */
    public function addAssets(ConfigureClientView $event)
    {
		if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../js/admin/dist/extension.js'
            ]);
            $event->addBootstrapper('vingle/configure/smtp/main');
        }
    }
		
}
