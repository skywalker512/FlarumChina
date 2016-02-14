<?php

namespace Flarum\Composer;

use Composer\Installer\LibraryInstaller;
use Composer\Package\PackageInterface;

class Installer extends LibraryInstaller
{
    /**
     * {@inheritDoc}
     */
    public function getInstallPath(PackageInterface $package)
    {
        list($vendor, $name) = explode('/', $package->getPrettyName());

        $name = preg_replace('/^flarum-(ext-)?/', '', $name);

        return getcwd() . '/extensions/'.$vendor.'-'.$name;
    }

    /**
     * {@inheritDoc}
     */
    public function supports($packageType)
    {
        return 'flarum-extension' === $packageType;
    }
}
