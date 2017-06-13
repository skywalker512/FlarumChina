<?php

namespace Flagrow\Bazaar\Jobs;

use Carbon\Carbon;
use Flagrow\Bazaar\Composer\ComposerCommand;
use Flagrow\Bazaar\Composer\ComposerEnvironment;
use Flagrow\Bazaar\Composer\ComposerOutput;
use Flagrow\Bazaar\Models\Task;
use Psr\Log\LoggerInterface;

abstract class ComposerJob
{
    /**
     * Memory for Composer
     */
    const MEMORY_REQUESTED = '1G';

    /**
     * @var Task
     */
    protected $task;

    /**
     * @param Task $task
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Create the composer command and configure memory/timeout for the script
     * @param ComposerEnvironment $env
     * @return ComposerCommand
     */
    public function getComposerCommand(ComposerEnvironment $env)
    {
        @ini_set('memory_limit', static::MEMORY_REQUESTED);
        @set_time_limit(5 * 60);

        return new ComposerCommand($env);
    }

    /**
     * Run the job
     * @param ComposerEnvironment $env
     * @param LoggerInterface $log
     * @throws \Exception
     */
    public function handle(ComposerEnvironment $env, LoggerInterface $log)
    {
        $command = $this->getComposerCommand($env);

        $this->task->status = 'working';
        $this->task->started_at = Carbon::now();
        $this->task->save();

        $jobException = null;

        try {
            $output = $this->handleComposer($command, $this->task);

            $this->task->status = 'success';
            $this->task->output = $output->getOutput() . "\n--------\nBazaar stats\nDuration: {$output->getDuration()}s\nMemory: {$output->getMemory()}MB";
        } catch (\Exception $e) {
            $jobException = $e;

            $this->task->status = 'exception';
            $this->task->output = $e->getMessage();
            $log->error($e->getMessage());
        }

        $this->task->finished_at = Carbon::now();
        $this->task->save();

        // As long as the task is run as sync, we need to throw exceptions to get accurate request responses
        if ($jobException instanceof \Exception) {
            throw $jobException;
        }
    }

    /**
     * Sub-job than needs to be overwritten by children jobs to run the right composer command
     * @param ComposerCommand $command
     * @param Task $task
     * @return ComposerOutput
     */
    abstract protected function handleComposer(ComposerCommand $command, Task $task);

    /**
     * Workaround to easily launch jobs until Flarum support them
     * @param Task $task
     */
    public static function launchJob(Task $task)
    {
        $job = new static($task);
        $env = app()->make(ComposerEnvironment::class);
        $log = app()->make(LoggerInterface::class);
        $job->handle($env, $log);
    }
}
