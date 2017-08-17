<?php
namespace GaNuongLaChanh\MarkdownEditor\Listener;

use DirectoryIterator;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureWebApp;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class AddApplicationAssets{
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

    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addForumAssets']);
        $events->listen(ConfigureWebApp::class, [$this, 'addAdminAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function addForumAssets(ConfigureWebApp $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__.'/../../js/forum/dist/extension.js',
                __DIR__.'/../../less/markdown-editor.less',
            ]);
            $event->addBootstrapper('ganuonglachanh/mdeditor/main');
        }
    }

    public function addAdminAssets(ConfigureWebApp $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../js/admin/dist/extension.js'
            ]);
            $event->addBootstrapper('ganuonglachanh/mdeditor/main');
        }
    }

    /**
    * Provides i18n files.
    *
    * @param ConfigureLocales $event
    */
    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && $file->getExtension() === 'yaml') {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['editorSymbols'] = $this->settings->get('ganuonglachanh.mdeditor.symbols');
        }
    }
}
