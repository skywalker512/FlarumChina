<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Lazyboywu\Auth\Qq\Listener;

use Flarum\Events\ConfigureLocales;
use Illuminate\Contracts\Events\Dispatcher;

class AddQqLocale
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureLocales::class, [$this, 'addLocale']);
        //$events->listen(BuildClientView::class, [$this, 'buildTranslation']);
    }

    /**
     * @param RegisterLocales $event
     */
    public function addLocale(RegisterLocales $event) {
        $event->locales->addTranslations('en', __DIR__.'/../../locale/en.yml');
        $event->locales->addTranslations('zh', __DIR__.'/../../locale/zh.yml');
    }

    /**
     * @param BuildClientView $event
     */
    public function buildTranslation(BuildClientView $event)
    {
        // if ($event->isForum()) {
        //     $event->forumTranslations([
        //         'flarum_auth_qq.forum'
        //     ]);
        // }

        // if ($event->isAdmin()) {
        //     $event->addAssets([
        //         __DIR__ . '/../../js/admin/dist/extension.js'
        //     ]);
        //     $event->addBootstrapper('flarum/auth/qq/main');
        // }
    }
}
