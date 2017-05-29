<?php

namespace Flagrow\Bazaar\Composer\Commands;

use Composer\Package\Version\VersionSelector;

class RequireCommand extends BaseCommand
{
    /**
     * @inheritdoc
     */
    protected function handle(array $packages = null)
    {
        $versionSelector = new VersionSelector($this->getFileEditor()->getPool($this->getIO()));

        if ($packages === null) {
            $packages = [];
        }

        foreach ($packages as $package) {
            $candidate = $versionSelector->findBestCandidate($package);

            if ($candidate) {
                $this->getFileEditor()->addPackage(
                    $candidate->getPrettyName(),
                    $versionSelector->findRecommendedRequireVersion($candidate)
                );
            }
        }

        if (!empty($packages)) {
            $this->getFileEditor()->saveToFile();
        }
    }
}
