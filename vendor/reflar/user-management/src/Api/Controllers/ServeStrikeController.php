<?php

/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Api\Controllers;

use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\UserManagement\Api\Serializers\StrikeSerializer;
use Reflar\UserManagement\Commands\DeleteStrike;
use Reflar\UserManagement\Commands\ServeStrike;
use Tobscure\JsonApi\Document;

class ServeStrikeController extends AbstractResourceController
{
    public $serializer = StrikeSerializer::class;
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $id = array_get($request->getParsedBody(), 'id');
        if (isset($id)) {
            return $this->bus->dispatch(
                new DeleteStrike($id, $actor)
            );
        } else {
            $post_id = array_get($request->getParsedBody(), 'post_id');
            $reason = array_get($request->getParsedBody(), 'reason');

            return $this->bus->dispatch(
                new ServeStrike($post_id, $reason, $actor)
            );
        }
    }
}
