<?php

namespace Flagrow\Bazaar\Models;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $status
 * @property string $command
 * @property string $package
 * @property string $output
 * @property Carbon $created_at
 * @property Carbon $started_at
 * @property Carbon $finished_at
 */
class Task extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'bazaar_tasks';

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'created_at' => 'date',
        'started_at' => 'date',
        'finished_at' => 'date',
    ];

    /**
     * Craft a task with basic values
     * @param string $command
     * @param string|null $package
     * @return static
     */
    public static function build($command, $package = null)
    {
        $task = new static;

        $task->command = $command;
        $task->package = $package;
        $task->created_at = Carbon::now();

        return $task;
    }
}
