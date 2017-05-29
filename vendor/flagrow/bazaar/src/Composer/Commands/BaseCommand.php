<?php

namespace Flagrow\Bazaar\Composer\Commands;

use Composer\Installer;
use Flagrow\Bazaar\Composer\ComposerEnvironment;
use Flagrow\Bazaar\Composer\ComposerOutput;
use Flagrow\Bazaar\Composer\Utils\ComposerFactory;
use Flagrow\Bazaar\Composer\Utils\ComposerFileEditor;
use Flagrow\Bazaar\Composer\Utils\ComposerIO;
use Flagrow\Bazaar\Exceptions\ComposerException;

abstract class BaseCommand
{
    /**
     * @var ComposerEnvironment
     */
    protected $env;

    /**
     * @var ComposerIO
     */
    protected $io;

    /**
     * @var ComposerFileEditor
     */
    protected $fileEditor;

    /**
     * @var ComposerInstaller
     */
    protected $installer;

    /**
     * @param ComposerEnvironment $env
     */
    public function __construct(ComposerEnvironment $env)
    {
        $this->env = $env;
    }

    /**
     * @return ComposerIO
     */
    protected function getIO()
    {
        if (!$this->io) {
            $this->io = new ComposerIO();
        }

        return $this->io;
    }

    /**
     * @return ComposerFileEditor
     */
    protected function getFileEditor()
    {
        if (!$this->fileEditor) {
            $this->fileEditor = new ComposerFileEditor($this->env->getComposerJsonPath());
        }

        return $this->fileEditor;
    }

    /**
     * @return Installer
     */
    protected function getInstaller()
    {
        if (!$this->installer) {
            $factory = new ComposerFactory();
            $composer = $factory->createComposer(
                $this->getIO(),
                $this->env->getComposerJsonPath(),
                false,
                $this->env->getComposerInstallRoot()
            );
            $this->installer = Installer::create($this->getIO(), $composer);
        }

        return $this->installer;
    }

    /**
     * @param array|null $packages
     * @return ComposerOutput
     * @throws \Exception
     */
    public function run(array $packages = null)
    {
        $startTime = microtime(true);

        $this->env->configureComposerEnvironment();
        $this->env->prepareDirectories();

        try {
            $this->handle($packages);

            $installer = $this->getInstaller();

            $installer->setUpdate(true);
            $installer->setSkipSuggest(true);
            if (!empty($packages)) {
                $installer->setUpdateWhitelist($packages);
            }
            $installer->setWhitelistDependencies(true);
            $installer->setOptimizeAutoloader(true);
            // Prevent prestissimo issues (dropping repositories header configuration)
            $installer->disablePlugins();

            $exitCode = $installer->run();

            if ($exitCode !== 0) {
                // Exceptions should be caught by the ComposerIO handler
                // This is only for errors that the installer did not report verbally
                throw new ComposerException('Installer run error');
            }
        } catch (\Exception $exception) {
            if ($this->fileEditor) {
                $this->fileEditor->restoreToFile();
            }

            throw $exception;
        }

        $this->env->switchVendorDirectories();

        $endTime = microtime(true);
        $elapsedTime = round($endTime - $startTime); // In s
        $memoryUsed = round(memory_get_peak_usage()/1000000); // In MB

        return new ComposerOutput($exitCode, $this->getIO(), $elapsedTime, $memoryUsed);
    }

    /**
     * The code specific to the command
     * @param array|null $packages List of packages to manipulate
     * @return void
     */
    protected abstract function handle(array $packages = null);
}
