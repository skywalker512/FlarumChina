<?php

/*
 * This file is part of JSON-API.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Tobscure\JsonApi;

use LogicException;

abstract class AbstractSerializer implements SerializerInterface
{
    /**
     * The type.
     *
     * @var string
     */
    protected $type;

    /**
     * {@inheritdoc}
     */
    public function getType($model)
    {
        return $this->type;
    }

    /**
     * {@inheritdoc}
     */
    public function getId($model)
    {
        return $model->id;
    }

    /**
     * {@inheritdoc}
     */
    public function getAttributes($model, array $fields = null)
    {
        return [];
    }

    /**
     * {@inheritdoc}
     *
     * @throws LogicException
     */
    public function getRelationship($model, $name)
    {
        if (method_exists($this, $name)) {
            $relationship = $this->$name($model);

            if ($relationship !== null && ! ($relationship instanceof Relationship)) {
                throw new LogicException('Relationship method must return null or an instance of '
                    .Relationship::class);
            }

            return $relationship;
        }
    }
}
