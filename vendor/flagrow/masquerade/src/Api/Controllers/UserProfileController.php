<?php

namespace Flagrow\Masquerade\Api\Controllers;

use Flagrow\Masquerade\Api\Serializers\FieldSerializer;
use Flagrow\Masquerade\Field;
use Flagrow\Masquerade\Repositories\FieldRepository;
use Flagrow\Masquerade\Validators\AnswerValidator;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Access\AssertPermissionTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UserProfileController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    public $serializer = FieldSerializer::class;

    public $include = ['answer'];
    /**
     * @var AnswerValidator
     */
    protected $validator;
    /**
     * @var \Illuminate\Database\Eloquent\Collection
     */
    protected $fields;

    function __construct(AnswerValidator $validator, FieldRepository $fields)
    {
        $this->validator = $validator;
        $this->fields = $fields->all();
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
        $actor = $request->getAttribute('actor');

        $this->assertCan($actor, 'flagrow.masquerade.view-profile');

        $id = array_get($request->getQueryParams(), 'id');

        if (!$id) {
            throw new ModelNotFoundException();
        }

        /** @var \Illuminate\Database\Eloquent\Collection $fields */
        $fields = $this->fields->each(function ($field) use ($id) {
            $field->for = $id;
        });

        return $fields;
    }
}
