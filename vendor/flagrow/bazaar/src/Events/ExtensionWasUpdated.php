<?php

namespace Flagrow\Bazaar\Events;

use Flarum\Extension\Extension;

class ExtensionWasUpdated
{
    /**
     * @var Extension
     */
    public $extension;

    /**
     * @param Extension $extension
     */
    public function __construct(Extension $extension)
    {
        $this->extension = $extension;
    }
}
