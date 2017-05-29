<?php

namespace Flagrow\Bazaar\Api\Serializers;

use Flagrow\Bazaar\Extensions\Extension;
use Flarum\Api\Serializer\AbstractSerializer;

class ExtensionSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'bazaar-extensions';

    /**
     * {@inheritdoc}
     *
     * @param array $extension
     */
    public function getDefaultAttributes($extension)
    {
        if ($extension instanceof Extension) {
            return $extension->toArray();
        }

        return $extension;
    }
}
