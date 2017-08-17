<?php
namespace GaNuongLaChanh\MarkdownEditor;
use Illuminate\Contracts\Events\Dispatcher;
use GaNuongLaChanh\MarkdownEditor\Listener;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddApplicationAssets::class);
};

#yeah
