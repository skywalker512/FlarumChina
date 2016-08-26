<?php

namespace Sijad\Pages\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Pages\PageRepository;

class DeletePageHandler
{
    use AssertPermissionTrait;

    /**
     * @var PageRepository
     */
    protected $pages;

    /**
     * @param PageRepository $pages
     */
    public function __construct(PageRepository $pages)
    {
        $this->pages = $pages;
    }

    /**
     * @param DeletePage $command
     *
     * @return \Sijad\Pages\Page
     *
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(DeletePage $command)
    {
        $actor = $command->actor;

        $page = $this->pages->findOrFail($command->pageId, $actor);

        $this->assertAdmin($actor);

        $page->delete();

        return $page;
    }
}
