<?php

namespace Flagrow\Masquerade\Api\Controllers;

use Flagrow\Masquerade\Api\Serializers\FieldSerializer;
use Flagrow\Masquerade\Field;
use Flagrow\Masquerade\Repositories\FieldRepository;
use Flagrow\Masquerade\Validators\AnswerValidator;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\User;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UserConfigureController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    public $serializer = FieldSerializer::class;

    public $include = ['answer'];
    /**
     * @var AnswerValidator
     */
    protected $validator;
    /**
     * @var FieldRepository
     */
    protected $fields;

    function __construct(AnswerValidator $validator, FieldRepository $fields)
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
        $actor = $request->getAttribute('actor');

        $this->assertRegistered($actor);

        /** @var \Illuminate\Database\Eloquent\Collection $fields */
        $fields = $this->fields->all();

        if ($request->getMethod() == 'POST') {
            $this->processUpdate($actor, $request->getParsedBody(), $fields);
        }

        return $fields;
    }

    /**
     * @param User $actor
     * @param $answers
     * @param \Illuminate\Database\Eloquent\Collection $fields
     */
    protected function processUpdate(User $actor, $answers, &$fields)
    {
        $fields->each(function (Field $field) use ($answers, $actor) {
            $content = Arr::get($answers, $field->id);

            $this->processBoolean($field, $content);

            $this->validator->setField($field);

            $this->validator->assertValid([
                $field->name => $content
            ]);

            $this->fields->addOrUpdateAnswer(
                $field,
                $content,
                $actor
            );
        });
    }

    protected function processBoolean(Field $field, &$content)
    {
        if ($this->hasType($field, 'boolean')) {
            $content = in_array(strtolower($content), ['yes', 'true']);
        }
    }

    protected function hasType(Field $field, $type)
    {
        return collect(explode(',', $field->validation))
            ->map(function ($rule) {
                return trim($rule);
            })
            ->filter()
            ->contains($type);
    }
}
