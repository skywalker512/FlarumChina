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

namespace Reflar\Reactions\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Reactions\Command\DeleteReaction;

class DeleteReactionController extends AbstractDeleteController
{
    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * @param ServerRequestInterface $request
     */
    protected function delete(ServerRequestInterface $request)
    {
        $this->bus->dispatch(
            new DeleteReaction(array_get($request->getQueryParams(), 'id'), $request->getAttribute('actor'))
        );
    }
}
