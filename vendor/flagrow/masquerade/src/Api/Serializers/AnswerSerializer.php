<?php

namespace Flagrow\Masquerade\Api\Serializers;

use Flagrow\Masquerade\Field;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Resource;

class AnswerSerializer extends AbstractSerializer
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
     * @param mixed $model
     * @return string
     */
    public function getType($model)
    {
        return 'masquerade-answer';
    }

    /**
     * @param $model
     * @return Resource
     */
    public function field($model)
    {
        return new Resource($model, new FieldSerializer);
    }
}
