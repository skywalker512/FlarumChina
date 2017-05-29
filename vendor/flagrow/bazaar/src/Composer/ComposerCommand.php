<?php

namespace Flagrow\Bazaar\Composer;

use Flagrow\Bazaar\Composer\Commands\RemoveCommand;
use Flagrow\Bazaar\Composer\Commands\RequireCommand;
use Flagrow\Bazaar\Composer\Commands\UpdateCommand;

class ComposerCommand
{
    /**
     * @var ComposerEnvironment
     */
    protected $env;

    /**
     * @param ComposerEnvironment $composerEnvironment
     */
    public function __construct(ComposerEnvironment $composerEnvironment)
    {
        $this->env = $composerEnvironment;
    }

    /**
     * Runs `composer require`
     * @param string $package
     * @return ComposerOutput
     */
    public function requires($package)
    {
        return (new RequireCommand($this->env))->run([$package]);
    }

    /**
     * Runs `composer update`
     * @param string|null $package Package to update or empty for all.
     * @return ComposerOutput
     */
    public function update($package = null)
    {
        $packages = null;

        if (!is_null($package)) {
            $packages = [$package];
        }

        return (new UpdateCommand($this->env))->run($packages);
    }

    /**
     * Runs `composer remove`
     * @param string $package
     * @return ComposerOutput
     */
    public function remove($package)
    {
        return (new RemoveCommand($this->env))->run([$package]);
    }
}
