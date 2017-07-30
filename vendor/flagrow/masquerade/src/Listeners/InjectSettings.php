<?php

namespace Flagrow\Masquerade\Listeners;

use Flagrow\Masquerade\Repositories\FieldRepository;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class InjectSettings
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'permissions']);
    }

    public function permissions(PrepareApiAttributes $event)
    {
        if ($event->serializer instanceof ForumSerializer) {
            // Dispatcher not yet available if we're using IoC in construct.
            $fields = app(FieldRepository::class);
            $event->attributes['masquerade.force-profile-completion'] = $this->settings->get('masquerade.force-profile-completion', false);
            $event->attributes['masquerade.disable-user-bio'] = $this->settings->get('masquerade.disable-user-bio', false);
            $event->attributes['masquerade.profile-completed'] = $event->actor && $event->actor->id ? $fields->completed($event->actor->id) : false;
        }
    }
}
