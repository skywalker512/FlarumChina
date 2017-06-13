<?php

namespace Flagrow\Bazaar\Composer;

use Flagrow\Bazaar\Composer\Utils\ComposerFactory;
use Flagrow\Bazaar\Exceptions\FilePermissionException;
use Illuminate\Filesystem\Filesystem;

class ComposerEnvironment
{
    /**
     * @var string
     */
    protected $composerInstallRoot;

    /**
     * @var string
     */
    protected $composerHome;

    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * ComposerEnvironment constructor.
     * @param string $composerInstallRoot
     * @param string $composerHome
     * @param Filesystem $filesystem
     */
    public function __construct($composerInstallRoot, $composerHome, Filesystem $filesystem)
    {
        $this->composerInstallRoot = $composerInstallRoot;
        $this->composerHome = $composerHome;
        $this->filesystem = $filesystem;
    }

    /**
     * @return string
     */
    public function getComposerInstallRoot()
    {
        return $this->composerInstallRoot;
    }

    /**
     * @return string
     */
    public function getComposerHomePath()
    {
        return $this->composerHome;
    }

    /**
     * @return string
     */
    public function getVendorPath()
    {
        return $this->getComposerInstallRoot().'/vendor';
    }

    /**
     * @return string
     */
    public function getTemporaryVendorPath()
    {
        // Placing the temporary vendor dir at the same level is easier for permission check
        // And also keeps symlinks pointing outside vendor working
        return $this->getComposerInstallRoot().'/vendor2';
    }

    /**
     * @return string
     */
    public function getComposerJsonPath()
    {
        return $this->getComposerInstallRoot().'/composer.json';
    }

    /**
     * @return string
     */
    public function getComposerLockPath()
    {
        return $this->getComposerInstallRoot().'/composer.lock';
    }

    /**
     * Configure environment variables and default composer settings
     */
    public function configureComposerEnvironment()
    {
        putenv('COMPOSER_HOME='.$this->getComposerHomePath());
        ComposerFactory::setVendorDir($this->getTemporaryVendorPath());
    }

    /**
     * @return array
     */
    public function retrieveFilePermissions()
    {
        $pathsToCheck = [
            $this->getComposerInstallRoot(),
            $this->getComposerJsonPath(),
            $this->getComposerLockPath(),
            $this->getVendorPath(),
            $this->getTemporaryVendorPath(),
        ];

        $paths = [];

        foreach ($pathsToCheck as $path) {
            if (file_exists($path) && !is_writable($path)) {
                $paths[] = str_replace(base_path(), '/', $path);
            }
        }

        return $paths;
    }

    /**
     * @throws FilePermissionException
     */
    public function checkFilePermissions()
    {
        foreach ($this->retrieveFilePermissions() as $path) {
            throw new FilePermissionException('Write permission missing for '.$path);
        }
    }

    /**
     * Directory logic that has to run prior to composer
     */
    public function prepareDirectories()
    {
        $this->checkFilePermissions();
        $this->filesystem->deleteDirectory($this->getTemporaryVendorPath());
    }

    /**
     * Directory logic that has to run after composer
     */
    public function switchVendorDirectories()
    {
        $this->filesystem->deleteDirectory($this->getVendorPath());
        $this->filesystem->move($this->getTemporaryVendorPath(), $this->getVendorPath());
    }
}
