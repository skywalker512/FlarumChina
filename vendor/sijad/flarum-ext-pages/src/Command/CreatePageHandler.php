<?php

namespace Sijad\Pages\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Pages\Page;
use Sijad\Pages\PageValidator;

class CreatePageHandler
{
    use AssertPermissionTrait;

    /**
     * @var PageValidator
     */
    protected $validator;

    /**
     * @param PageValidator $validator
     */
    public function __construct(PageValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param CreatePage $command
     *
     * @return Page
     */
    public function handle(CreatePage $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $page = Page::build(
            array_get($data, 'attributes.title'),
            array_get($data, 'attributes.slug'),
            array_get($data, 'attributes.content'),
            array_get($data, 'attributes.isHidden')
        );

        $this->validator->assertValid($page->getAttributes());

        $page->save();

        return $page;
    }
}
