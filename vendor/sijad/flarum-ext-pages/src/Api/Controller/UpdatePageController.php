<?php

namespace Sijad\Pages\Api\Controller;

use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Sijad\Pages\Command\EditPage;
use Tobscure\JsonApi\Document;

class UpdatePageController extends AbstractResourceController
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
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data');

        return $this->bus->dispatch(
            new EditPage($id, $actor, $data)
        );
    }
}
