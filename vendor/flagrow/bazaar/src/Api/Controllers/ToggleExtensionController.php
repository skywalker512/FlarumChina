<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Api\Serializers\ExtensionSerializer;
use Flagrow\Bazaar\Extensions\ExtensionUtils;
use Flagrow\Bazaar\Repositories\ExtensionRepository;
use Flarum\Api\Controller\AbstractResourceController;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Extension\ExtensionManager;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ToggleExtensionController extends AbstractResourceController
{
    use AssertPermissionTrait;

    public $serializer = ExtensionSerializer::class;
    /**
     * @var ExtensionRepository
     */
    private $extensions;
    /**
     * @var ExtensionManager
     */
    private $manager;

    function __construct(ExtensionRepository $extensions, ExtensionManager $manager)
    {
        $this->extensions = $extensions;
        $this->manager = $manager;
    }

    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $enabled = Arr::get($request->getParsedBody(), 'enabled');
        $id = Arr::get($request->getQueryParams(), 'id');

        $shortName = ExtensionUtils::idToShortName($id);

        if ($enabled === true) {
            $this->manager->enable($shortName);
        } else {
            $this->manager->disable($shortName);
        }

        return $this->extensions->getExtension($id);
    }
}
