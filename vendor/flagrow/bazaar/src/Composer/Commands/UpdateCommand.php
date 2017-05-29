<?php

namespace Flagrow\Bazaar\Composer\Commands;

class UpdateCommand extends BaseCommand
{
    /**
     * @inheritdoc
     */
    protected function handle(array $packages = null)
    {
        $this->getInstaller()->setUpdate(true);
        $this->getInstaller()->setSkipSuggest(true);
        $this->getInstaller()->setWhitelistDependencies(true);

        if (is_array($packages)) {
            $this->getInstaller()->setUpdateWhitelist($packages);
        }
    }
}
