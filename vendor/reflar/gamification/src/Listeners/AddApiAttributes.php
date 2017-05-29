<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Listeners;

use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\ConfigureForumRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Api\Controllers;

class AddApiAttributes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(ConfigureForumRoutes::class, [$this, 'configureForumRoutes']);
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/reflar/gamification/convert', 'reflar.gamification.convert', Controllers\ConvertLikesController::class);

        $event->get('/ranks', 'ranks.index', Controllers\ListRanksController::class);

        $event->post('/ranks', 'ranks.create', Controllers\CreateRankController::class);

        $event->post('/reflar/topimage/{id}', 'reflar.topImage', Controllers\UploadTopImageController::class);

        $event->patch('/ranks/{id}', 'ranks.update', Controllers\UpdateRankController::class);
        $event->delete('/ranks/{id}', 'ranks.delete', Controllers\DeleteRankController::class);
        $event->get('/rankings', 'rankings', Controllers\OrderByPointsController::class);
    }

    /*
     * @param ConfigureForumRoutes $event
     */
    public function configureForumRoutes(ConfigureForumRoutes $event)
    {
        $event->get('/rankings', 'rankings');
    }
}
