<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Api\Serializers\ExtensionSerializer;
use Flagrow\Bazaar\Extensions\ExtensionUtils;
use Flagrow\Bazaar\Repositories\ExtensionRepository;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class InstallExtensionController extends AbstractCreateController
{
    use AssertPermissionTrait;

    /**
     * {@inheritdoc}
     */
    public $serializer = ExtensionSerializer::class;

    /**
     * @var ExtensionRepository
     */
    protected $extensions;

    /**
     * @param ExtensionRepository $extensions
     */
    public function __construct(ExtensionRepository $extensions)
    {
        $this->extensions = $extensions;
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

        $extensionId = array_get($request->getParsedBody(), 'id');
        $package = ExtensionUtils::idToPackage($extensionId);

        return $this->extensions->installExtension($package);
    }
}
