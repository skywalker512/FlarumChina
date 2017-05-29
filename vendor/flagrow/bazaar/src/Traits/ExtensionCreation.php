<?php

namespace Flagrow\Bazaar\Traits;

use Flagrow\Bazaar\Extensions\Extension;
use Flarum\Extension\ExtensionManager;

trait ExtensionCreation
{
    /**
     * Create an Extension object and map all data sources
     * @param array $apiPackage
     * @return Extension
     */
    public function createExtension(array $apiPackage)
    {
        $extension = Extension::createFromAttributes($apiPackage['attributes']);

        $installedExtension = app(ExtensionManager::class)->getExtension($extension->getShortName());

        if (!is_null($installedExtension)) {
            $extension->setInstalledExtension($installedExtension);
        }

        return $extension;
    }
}
