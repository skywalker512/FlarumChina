<?php

namespace Flagrow\Masquerade\Api\Serializers;

use Flagrow\Masquerade\Field;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Relationship;
use Tobscure\JsonApi\Resource;

class FieldSerializer extends AbstractSerializer
{
    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Field|array $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param Field $model
     * @return string
     */
    public function getType($model)
    {
        return 'masquerade-field';
    }

    /**
     * @param Field $model
     * @return Relationship
     */
    public function answer($model)
    {
        if (!$this->getActor()) {
            return null;
        }

        $for = $model->for ? $model->for : $this->getActor()->id;

        if ($answer = $model->answers()->where('user_id', $for)->first()) {
            return new Relationship(new Resource(
                $answer,
                new AnswerSerializer
            ));
        } else {
            return null;
        }
    }
}
