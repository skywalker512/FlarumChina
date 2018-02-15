<?php

/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license.
 */

namespace ClarkWinkelmann\EmojiOneArea\Listeners;

use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'configureClientView']);
    }

    public function configureClientView(ConfigureClientView $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__.'/../../js/forum/dist/extension.js',
                __DIR__.'/../../less/forum/extension.less',
                __DIR__.'/../../css/forum/dist/emojionearea.css',
            ]);
            $event->addBootstrapper('clarkwinkelmann/emojionearea/main');
        }
    }
}
