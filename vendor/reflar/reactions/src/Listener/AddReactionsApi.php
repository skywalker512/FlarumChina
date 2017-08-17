<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Listener;

use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Reactions\Api\Controller;

class AddReactionsApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->get('/reactions', 'reactions.index', Controller\ListReactionsController::class);

        $event->post('/reactions', 'reactions.create', Controller\CreateReactionController::class);

        $event->patch('/reactions/{id}', 'reactions.update', Controller\UpdateReactionController::class);
        $event->delete('/reactions/{id}', 'reactions.delete', Controller\DeleteReactionController::class);
    }
}
