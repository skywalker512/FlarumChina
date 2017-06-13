<?php

namespace Flagrow\Bazaar\Extensions;

use Carbon\Carbon;
use Flagrow\Bazaar\Jobs\RemovePackage;
use Flagrow\Bazaar\Jobs\RequirePackage;
use Flagrow\Bazaar\Models\Task;

class PackageManager
{
    /**
     * Create and save a task model to use for a Composer job
     * @param string $command Task type
     * @param string $package Composer package name
     * @return Task
     */
    public function buildTask($command, $package)
    {
        $task = new Task();

        $task->command = $command;
        $task->package = $package;
        $task->created_at = Carbon::now();
        $task->save();

        return $task;
    }

    /**
     * Create and run an update job
     * RequirePackage is used behind the scene as we do not want to update any other dependency
     * But we need a separate method from requirePackage to correctly log the "update" in the task list
     * @param string $package
     */
    public function updatePackage($package)
    {
        $task = $this->buildTask('update', $package);

        RequirePackage::launchJob($task);
    }

    /**
     * Create and run the InstallPackage job
     * @param string $package
     */
    public function requirePackage($package)
    {
        $task = $this->buildTask('install', $package);

        RequirePackage::launchJob($task);
    }

    /**
     * Create and run the RemovePackage job
     * @param string $package
     */
    public function removePackage($package)
    {
        $task = $this->buildTask('uninstall', $package);

        RemovePackage::launchJob($task);
    }
}
