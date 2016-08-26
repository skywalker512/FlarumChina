<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Api\Controller;

use Flarum\Api\Controller\AbstractResourceController;
use Sijad\Links\Api\Serializer\LinkSerializer;
use Sijad\Links\Command\EditLink;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateLinkController extends AbstractResourceController
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
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data');

        return $this->bus->dispatch(
            new EditLink($id, $actor, $data)
        );
    }
}
