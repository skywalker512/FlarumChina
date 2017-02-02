<?php namespace AntoineFr\Money\Listeners;

use Illuminate\Contracts\Events\Dispatcher;
use DirectoryIterator;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\ConfigureLocales;

class AddClientAssets
{    
    public function subscribe(Dispatcher $events) {
        $events->listen(ConfigureClientView::class, [$this, 'configureClientView']);
        $events->listen(ConfigureLocales::class, [$this, 'configureLocales']);
    }
    
    public function configureClientView(ConfigureClientView $event) {
        if ($event->isForum()) {
            $event->addAssets(__DIR__.'/../../js/forum/dist/extension.js');
            $event->addBootstrapper('antoinefr/money/main');
        }
        if ($event->isAdmin()) {
            $event->addAssets(__DIR__.'/../../js/admin/dist/extension.js');
            $event->addBootstrapper('antoinefr/money/main');
        }
    }
    
    public function configureLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}