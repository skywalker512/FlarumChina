<?php

namespace Flagrow\Bazaar\Composer\Utils;

use Composer\IO\BufferIO;
use Flagrow\Bazaar\Exceptions\ComposerException;

class ComposerIO extends BufferIO
{
    /**
     * @inheritdoc
     */
    public function writeError($messages, $newline = true, $verbosity = self::NORMAL)
    {
        // As all console output goes through this method, we need to find out if it contains an error
        if (substr($messages, 0, 7) === '<error>') {
            throw new ComposerException($messages);
        }

        parent::writeError($messages);
    }
}
