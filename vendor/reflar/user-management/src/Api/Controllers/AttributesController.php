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
use Reflar\UserManagement\Api\Serializers\ActivateSerializer;
use Reflar\UserManagement\Commands\Attributes;
use Tobscure\JsonApi\Document;

class AttributesController extends AbstractResourceController
{
    public $serializer = ActivateSerializer::class;
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $body = $request->getParsedBody();
        $actor = $request->getAttribute('actor');

        return $this->bus->dispatch(
            new Attributes($body, $actor)
        );
    }
}
