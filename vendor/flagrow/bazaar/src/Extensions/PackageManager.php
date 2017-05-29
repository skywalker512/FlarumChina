<?php

namespace Flagrow\Bazaar\Extensions;

use Flagrow\Bazaar\Composer\ComposerCommand;
use Flagrow\Bazaar\Composer\ComposerEnvironment;
use Flagrow\Bazaar\Composer\ComposerOutput;
use Psr\Log\LoggerInterface;

class PackageManager
{
    /**
     * @var ComposerEnvironment
     */
    protected $env;

    /**
     * @var LoggerInterface
     */
    protected $log;

    public function __construct(ComposerEnvironment $env, LoggerInterface $log)
    {
        $this->env = $env;
        $this->log = $log;
    }

    public function getComposerCommand()
    {
        @ini_set('memory_limit', '1G');
        @set_time_limit(5 * 60);

        return new ComposerCommand($this->env);
    }

    public function updatePackages()
    {
        $output = $this->getComposerCommand()->update();

        $this->logCommandResult($output, 'update');
    }

    public function updatePackage($package)
    {
        $output = $this->getComposerCommand()->update($package);

        $this->logCommandResult($output, 'update');
    }

    public function requirePackage($package)
    {
        $output = $this->getComposerCommand()->requires($package);

        $this->logCommandResult($output, 'require');
    }

    public function removePackage($package)
    {
        $output = $this->getComposerCommand()->remove($package);

        $this->logCommandResult($output, 'remove');
    }

    /**
     * Write output & stats about the command in the log file
     * @param ComposerOutput $output
     * @param string $commandName
     */
    public function logCommandResult(ComposerOutput $output, $commandName)
    {
        $this->log->info('Bazaar: running composer command "'.$commandName.'" (Duration: '.$output->getDuration().'s, Memory: '.$output->getMemory().'MB)'.PHP_EOL.$output->getOutput());
    }
}
