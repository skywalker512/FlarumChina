<?php

namespace Flagrow\Bazaar\Traits;

trait FileSizeHelper
{
    public function sizeToByte($size)
    {
        list($size, $unit) = $this->identifySize($size);

        $matched = false;

        foreach(['p', 't', 'g', 'm', 'k'] as $higher) {
            if ($unit === $higher) {
                $matched = true;
            }

            if ($matched) {
                $size = $size * 1024;
            }
        }

        return $size;
    }

    /**
     * @param $size
     * @return array
     */
    public function identifySize($size)
    {
        if (preg_match('/^(?<size>[0-9]+)(?<unit>[a-z])b?$/i', $size, $m))
        {
            return [$m['size'], strtolower($m['unit'])];
        }

        throw new \InvalidArgumentException("Cannot identify $size.");
    }
}
