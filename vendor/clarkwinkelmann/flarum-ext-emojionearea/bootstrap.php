<?php

/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license
 */

use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->listen(ConfigureClientView::class, function (ConfigureClientView $event) {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/js/forum/dist/extension.js',
                __DIR__ . '/less/forum/extension.less',
                __DIR__ . '/css/forum/dist/emojionearea.css',
            ]);
            $event->addBootstrapper('clarkwinkelmann/emojionearea/main');
        }
    });
};
