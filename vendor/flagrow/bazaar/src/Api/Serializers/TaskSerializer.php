<?php

namespace Flagrow\Bazaar\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class TaskSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'bazaar-tasks';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($task)
    {
        return [
            'status'      => $task->status,
            'command'     => $task->command,
            'package'     => $task->package,
            'output'      => $task->output,
            'created_at'  => $this->formatDate($task->created_at),
            'started_at'  => $this->formatDate($task->started_at),
            'finished_at' => $this->formatDate($task->finished_at),
        ];
    }
}
