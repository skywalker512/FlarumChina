<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Api\Serializers\ExtensionSerializer;
use Flagrow\Bazaar\Repositories\ExtensionRepository;
use Flagrow\Bazaar\Search\AbstractExtensionSearcher;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Api\UrlGenerator;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListExtensionController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    /**
     * @inheritdoc
     */
    public $serializer = ExtensionSerializer::class;

    /**
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var ExtensionRepository
     */
    protected $extensions;

    public function __construct(ExtensionRepository $extensions, UrlGenerator $url)
    {
        $this->url = $url;
        $this->extensions = $extensions;
    }

    /**
     * @inheritdoc
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $offset = $this->extractOffset($request);

        $results = $this->extensions->index($request->getQueryParams());

        $document->addPaginationLinks(
            $this->url->toRoute('bazaar.extensions.index'),
            $request->getQueryParams(),
            $offset,
            1, // Add one to the offset to get next page number
            $results->areMoreResults() ? null : 0
        );

        return $results->getResults();
    }
}
