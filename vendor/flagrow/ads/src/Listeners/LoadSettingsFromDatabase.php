<?php


namespace Flagrow\Ads\Listeners;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Settings\SettingsRepositoryInterface;

class LoadSettingsFromDatabase
{
    protected $addSettings = [
        'under-header',
        'between-posts',
        'under-nav-items',
        'between-n-posts'
    ];

    /**
     * Gets the settings variable. Called on Object creation.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Get the setting values from the database and make them available
     * in the forum.
     *
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {

            $additionalSettings = [];

            foreach($this->addSettings as $key) {
                $additionalSettings[$this->prefix($key)] = $this->settings->get($this->prefix($key));
            }

            $event->attributes = array_merge($event->attributes, $additionalSettings);
        }
    }

    protected function prefix($key)
    {
        return 'flagrow.ads.' . $key;
    }
}
