<?php

namespace Flagrow\Bazaar\Composer;

use Flagrow\Bazaar\Composer\Utils\ComposerIO;

class ComposerOutput
{
    /**
     * @var int
     */
    protected $exitCode;

    /**
     * @var ComposerIO
     */
    protected $io;

    /**
     * @var int
     */
    protected $duration;

    /**
     * @var int
     */
    protected $memory;

    /**
     * @param int $exitCode
     * @param ComposerIO $io
     * @param int $duration
     * @param int $memory
     */
    public function __construct($exitCode, ComposerIO $io, $duration, $memory)
    {
        $this->exitCode = $exitCode;
        $this->io = $io;
        $this->duration = $duration;
        $this->memory = $memory;
    }

    /**
     * @return int
     */
    public function getExitCode()
    {
        return $this->exitCode;
    }

    /**
     * @return string
     */
    public function getOutput()
    {
        return $this->io->getOutput();
    }

    /**
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * @return int
     */
    public function getMemory()
    {
        return $this->memory;
    }
}
