<?php

namespace Terabin\Sitemap\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\DiscussionWasStarted;
use Flarum\Event\DiscussionWasDeleted;
use Flarum\Core\Discussion;
use Flarum\Core\User;
use Flarum\Tags\Tag;
use Flarum\Foundation\Application;
use samdark\sitemap\Sitemap;
use samdark\sitemap\Index;
use Sijad\Pages\Page;

class GenerateSitemap
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(DiscussionWasStarted::class, [$this, 'UpdateSitemap']);
        $events->listen(DiscussionWasDeleted::class, [$this, 'UpdateSitemap']);
    }

    /**
     * Generate a new sitemap.
     */
    public function UpdateSitemap()
    {
        // Get url
        $url = $this->app->url();

        // Get basePath
        $basePath = $this->app->basePath();

        // Create sitemap
        $sitemap = new Sitemap($basePath.'/sitemap.xml');

        // Get all discussions
        $discussions = Discussion::all();

        // Add home
        $sitemap->addItem($url, time(), Sitemap::DAILY, 0.9);

        // Get all tags
        if (class_exists('Tag')) {
            $tags = Tag::all();

            // Add tags
            foreach ($tags as $tag) {
                $sitemap->addItem($url.'/t/'.$tag->slug, time(), Sitemap::DAILY, 0.9);
            }
        }

        // Get all pages
        if (class_exists('Page')) {
            $pages = Page::all();

            //Add pages
            foreach ($pages as $page) {
                $sitemap->addItem($url.'/p/'.$page->id, time(), Sitemap::DAILY, 0.5);
            }
        }

        // Add discussions
        foreach ($discussions as $discussion) {
            $sitemap->addItem($url.'/d/'.$discussion->id, strtotime($discussion->last_time), Sitemap::DAILY, 0.7);
        }

        // Write
        $sitemap->write();
    }
}
