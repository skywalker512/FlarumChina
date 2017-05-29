<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Api\Serializers\ExtensionSerializer;
use Flagrow\Bazaar\Repositories\ExtensionRepository;
use Flagrow\Bazaar\Search\FlagrowApi;
use Flarum\Api\Controller\AbstractResourceController;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class FavoriteExtensionController extends AbstractResourceController
{

    public $serializer = ExtensionSerializer::class;
    /**
     * @var bool
     */
    private $connected;
    /**
     * @var ExtensionRepository
     */
    private $extensions;

    function __construct(FlagrowApi $api, SettingsRepositoryInterface $settings, ExtensionRepository $extensions)
    {
        $this->connected = $settings->get('flagrow.bazaar.connected') === '1';
        $this->extensions = $extensions;
    }

    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document $document
     * @return mixed
     * @throws PermissionDeniedException
     * @throws \Exception
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        if (!$this->connected) {
            throw new PermissionDeniedException("Bazaar not connected");
        }

        $response = $this->extensions->favorite(
            Arr::get($request->getQueryParams(), 'id'),
            Arr::get($request->getParsedBody(), 'favorite')
        );

        if ($response) {
            return $response;
        }

        throw new \Exception('Could not favorite, connection to service failed.');
    }
}
