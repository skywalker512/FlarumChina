<?php

namespace Flagrow\Bazaar\Jobs;

use Flagrow\Bazaar\Composer\ComposerCommand;
use Flagrow\Bazaar\Models\Task;

class RequirePackage extends ComposerJob
{
    /**
     * @inheritdoc
     */
    public function handleComposer(ComposerCommand $command, Task $task)
    {
        return $command->requires($task->package);
    }
}
