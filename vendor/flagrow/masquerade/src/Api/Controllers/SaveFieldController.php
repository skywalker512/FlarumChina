<?php

namespace Flagrow\Masquerade\Api\Controllers;

use Flagrow\Masquerade\Api\Serializers\FieldSerializer;
use Flagrow\Masquerade\Repositories\FieldRepository;
use Flagrow\Masquerade\Validators\FieldValidator;
use Flarum\Api\Controller\AbstractResourceController;
use Flarum\Core\Access\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class SaveFieldController extends AbstractResourceController
{
    use AssertPermissionTrait;

    public $serializer = FieldSerializer::class;
    /**
     * @var FieldValidator
     */
    protected $validator;
    /**
     * @var FieldRepository
     */
    protected $fields;

    public function __construct(FieldValidator $validator, FieldRepository $fields)
    {
        $this->validator = $validator;
        $this->fields = $fields;
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

        $id = Arr::get($request->getQueryParams(), 'id');

        if ($id) {
            $attributes = Arr::get($request->getParsedBody(), 'attributes', []);
        } else {
            $attributes = $request->getParsedBody();
        }

        $this->validator->assertValid($attributes);

        $field = $this->fields->findOrNew($attributes);

        return $field;
    }
}
