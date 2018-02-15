<?php

/**
 * This file is part of clarkwinkelmann/flarum-ext-emojionearea
 * See README.md for details and license.
 */

namespace ClarkWinkelmann\EmojiOneArea;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
};
