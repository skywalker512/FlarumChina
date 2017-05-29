<?php

namespace Flagrow\Bazaar\Composer\Utils;

use Composer\Factory;
use Composer\IO\IOInterface;

class ComposerFactory extends Factory
{
    /**
     * @var string
     */
    protected static $vendorDir;

    public static function setVendorDir($vendorDir)
    {
        self::$vendorDir = $vendorDir;
    }

    public static function createConfig(IOInterface $io = null, $cwd = null)
    {
        $config = parent::createConfig($io, $cwd);

        $config->merge([
            'config' => ['vendor-dir' => self::$vendorDir],
        ]);

        return $config;
    }
}
