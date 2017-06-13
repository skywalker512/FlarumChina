<?php

namespace Flagrow\Masquerade\Api\Controllers;

use Flagrow\Masquerade\Api\Serializers\FieldSerializer;
use Flagrow\Masquerade\Field;
use Flagrow\Masquerade\Repositories\FieldRepository;
use Flagrow\Masquerade\Validators\OrderFieldValidator;
use Flarum\Api\Controller\AbstractResourceController;
use Flarum\Core\Access\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class OrderFieldController extends AbstractResourceController
{
    use AssertPermissionTrait;

    public $serializer = FieldSerializer::class;
    /**
     * @var OrderFieldValidator
     */
    protected $validator;
    /**
     * @var FieldRepository
     */
    protected $fields;

    public function __construct(OrderFieldValidator $validator, FieldRepository $fields)
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

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'sort');

        $this->fields->sorting($order);
    }
}
