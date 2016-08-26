<?php

namespace Sijad\Pages\Api\Controller;

use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Sijad\Pages\PageRepository;
use Tobscure\JsonApi\Document;

class ShowPageController extends AbstractResourceController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Sijad\Pages\Api\Serializer\PageSerializer';

    /**
     * @var PageRepository
     */
    protected $pages;

    /**
     * @param PageRepository $pages
     */
    public function __construct(PageRepository $pages)
    {
        $this->pages = $pages;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'id');

        $actor = $request->getAttribute('actor');

        return $this->pages->findOrFail($id, $actor);
    }
}
