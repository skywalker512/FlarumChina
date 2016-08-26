<?php 
namespace Vingle\Share\Social\Listeners;

use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareApiData;

class AddClientAssets
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    
    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAssets']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function addAssets(ConfigureClientView $event)
    {
        if($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../js/admin/dist/extension.js',
                ]);

            $event->addBootstrapper('vingle/share/social/main');
        }
        if($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/../../js/forum/dist/extension.js',
                __DIR__ . '/../../less/forum/extension.less',
                ]);

            $event->addBootstrapper('vingle/share/social/main');
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        $event->attributes['vingle.share.social'] = $this->settings->get('vingle.share.social');
    }
}
