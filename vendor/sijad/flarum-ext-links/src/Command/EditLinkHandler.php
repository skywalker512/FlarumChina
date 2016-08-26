<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Links\LinkRepository;
use Sijad\Links\LinkValidator;

class EditLinkHandler
{
    use AssertPermissionTrait;

    /**
     * @var LinkRepository
     */
    protected $links;

    /**
     * @var LinkValidator
     */
    protected $validator;

    /**
     * @param LinkRepository $links
     * @param LinkValidator $validator
     */
    public function __construct(LinkRepository $links, LinkValidator $validator)
    {
        $this->links = $links;
        $this->validator = $validator;
    }

    /**
     * @param EditLink $command
     * @return \Sijad\Links\Link
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(EditLink $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $link = $this->links->findOrFail($command->linkId, $actor);

        $this->assertAdmin($actor);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['title'])) {
            $link->title = $attributes['title'];
        }

        if (isset($attributes['url'])) {
            $link->url = $attributes['url'];
        }

        if (isset($attributes['isInternal'])) {
            $link->is_internal = $attributes['isInternal'];
        }

        if (isset($attributes['isNewtab'])) {
            $link->is_newtab = $attributes['isNewtab'];
        }

        $this->validator->assertValid($link->getDirty());

        $link->save();

        return $link;
    }
}
