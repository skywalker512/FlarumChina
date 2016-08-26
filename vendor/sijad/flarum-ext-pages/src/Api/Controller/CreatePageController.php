<?php

namespace Sijad\Pages\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Sijad\Pages\Command\CreatePage;
use Tobscure\JsonApi\Document;

class CreatePageController extends AbstractCreateController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Sijad\Pages\Api\Serializer\PageSerializer';

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
            new CreatePage($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data'))
        );
    }
}
