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

use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Reactions\Command\EditReaction;
use Tobscure\JsonApi\Document;

class UpdateReactionController extends AbstractResourceController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Reflar\Reactions\Api\Serializer\ReactionSerializer';
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
     * @param Document $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = $request->getParsedBody();

        return $this->bus->dispatch(
            new EditReaction($id, $actor, $data)
        );
    }
}
