<?php

namespace Flagrow\Byobu;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddGambits::class);
    $events->subscribe(Listeners\AddRecipientsRelationships::class);
    $events->subscribe(Listeners\AddPermissions::class);
    $events->subscribe(Listeners\CreatePostWhenRecipientsChanged::class);
    $events->subscribe(Listeners\SaveRecipientsToDatabase::class);

    $events->subscribe(Access\DiscussionPolicy::class);
    $events->subscribe(Access\PostPolicy::class);
    $events->subscribe(Access\ApprovePrivateDiscussions::class);

    // Support for flagrow/split
    $events->subscribe(Listeners\AddRecipientsToSplitDiscussion::class);
};
