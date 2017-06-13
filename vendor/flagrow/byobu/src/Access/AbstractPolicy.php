<?php

namespace Flagrow\Byobu\Access;

use Flarum\Core\Access\AbstractPolicy as Policy;
use Flarum\Event\ScopeHiddenDiscussionVisibility;
use Flarum\Event\ScopeModelVisibility;
use Flarum\Event\ScopePostVisibility;
use Illuminate\Contracts\Events\Dispatcher;

abstract class AbstractPolicy extends Policy
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        parent::subscribe($events);

        $events->listen(ScopeModelVisibility::class, [$this, 'scopeModelVisibilityAfter'], -100);
        if (method_exists($this, 'scopeHiddenDiscussionVisibility')) {
            $events->listen(ScopeHiddenDiscussionVisibility::class, [$this, 'scopeHiddenDiscussionVisibility']);
        }
        if (method_exists($this, 'scopePostVisibility')) {
            $events->listen(ScopePostVisibility::class, [$this, 'scopePostVisibility']);
        }
    }


    /**
     * @param ScopeModelVisibility $event
     */
    public function scopeModelVisibilityAfter(ScopeModelVisibility $event)
    {
        if ($event->model instanceof $this->model && method_exists($this, 'findAfter')) {
            call_user_func_array([$this, 'findAfter'], [$event->actor, $event->query]);
        }
    }
}
