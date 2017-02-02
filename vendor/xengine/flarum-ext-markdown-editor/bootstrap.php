<?php
use Illuminate\Contracts\Events\Dispatcher;
use XEngine\MarkdownEditor\Listener;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddApplicationAssets::class);
};

#yeah