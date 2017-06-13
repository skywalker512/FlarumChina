<?php

namespace Flagrow\Masquerade\Listeners;

use Flarum\Event\ConfigureMiddleware;
use Flagrow\Masquerade\Http\Middleware\DemandProfileCompletion as Middleware;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class DemandProfileCompletion
{
    /**
     * @var bool
     */
    protected $enforce;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->enforce = (bool) $settings->get('masquerade.force-profile-completion', false);
    }
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureMiddleware::class, [$this, 'force']);
    }

    /**
     * @param ConfigureMiddleware $event
     */
    public function force(ConfigureMiddleware $event)
    {
        if ($this->enforce && $event->isForum()) {
            $event->pipe(app(Middleware::class));
        }
    }
}
