<?php

namespace Flagrow\Bazaar\Extensions;

class ExtensionUtils
{
    /**
     * @param string $package Composer package name
     * @return string Bazaar extension ID
     */
    public static function packageToId($package)
    {
        // The ID can't be the same as the package name because it does not fit in URLs
        return str_replace('/', '$', $package);
    }

    /**
     * @param string $id Bazaar extension ID
     * @return string Composer package name
     */
    public static function idToPackage($id)
    {
        return str_replace('$', '/', $id);
    }

    /**
     * @param string $id Bazaar extension ID
     * @return string The shortname used by Flarum extension manager
     */
    public static function idToShortName($id)
    {
        list($vendor, $package) = explode('$', $id);
        $package = str_replace(['flarum-ext-', 'flarum-'], '', $package);
        return "$vendor-$package";
    }
}
