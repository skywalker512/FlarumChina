<?php

namespace Sijad\Pages\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Pages\PageRepository;
use Sijad\Pages\PageValidator;

class EditPageHandler
{
    use AssertPermissionTrait;

    /**
     * @var PageRepository
     */
    protected $pages;

    /**
     * @var PageValidator
     */
    protected $validator;

    /**
     * @param PageRepository $pages
     * @param PageValidator  $validator
     */
    public function __construct(PageRepository $pages, PageValidator $validator)
    {
        $this->pages = $pages;
        $this->validator = $validator;
    }

    /**
     * @param EditPage $command
     *
     * @return \Sijad\Pages\Page
     *
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(EditPage $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $page = $this->pages->findOrFail($command->pageId, $actor);

        $this->assertAdmin($actor);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['title'])) {
            $page->title = $attributes['title'];
        }

        if (isset($attributes['slug'])) {
            $page->slug = $attributes['slug'];
        }

        if (isset($attributes['content'])) {
            $page->content = $attributes['content'];
        }

        if (isset($attributes['isHidden'])) {
            $page->is_hidden = $attributes['isHidden'];
        }

        if (isset($attributes['isHtml'])) {
            $page->is_html = $attributes['isHtml'];
        }

        $page->edit_time = time();

        $this->validator->assertValid($page->getDirty());

        $page->save();

        return $page;
    }
}
