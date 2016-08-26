<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Sijad\Links\Api\Serializer\LinkSerializer;
use Sijad\Links\Command\CreateLink;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateLinkController extends AbstractCreateController
{
    /**
     * @inheritdoc
     */
    public $serializer = LinkSerializer::class;

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
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new CreateLink($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data'))
        );
    }
}
