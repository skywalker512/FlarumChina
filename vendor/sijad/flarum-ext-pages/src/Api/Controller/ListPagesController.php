<?php

namespace Sijad\Pages\Api\Controller;

use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Api\UrlGenerator;
use Flarum\Core\Search\SearchCriteria;
use Psr\Http\Message\ServerRequestInterface;
use Sijad\Pages\Search\Page\PageSearcher;
use Tobscure\JsonApi\Document;

class ListPagesController extends AbstractCollectionController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Sijad\Pages\Api\Serializer\PageSerializer';

    /**
     * {@inheritdoc}
     */
    public $sortFields = ['time', 'editTime'];

    /**
     * @var PageSearcher
     */
    protected $searcher;

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param PageSearcher $searcher
     * @param UrlGenerator $url
     */
    public function __construct(PageSearcher $searcher, UrlGenerator $url)
    {
        $this->searcher = $searcher;
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $query = array_get($this->extractFilter($request), 'q');
        $sort = $this->extractSort($request);

        $criteria = new SearchCriteria($actor, $query, $sort);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $results = $this->searcher->search($criteria, $limit, $offset);

        $document->addPaginationLinks(
            $this->url->toRoute('pages.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $results->areMoreResults() ? null : 0
        );

        return $results->getResults();
    }
}
