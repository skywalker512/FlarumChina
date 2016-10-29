<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Links\LinkRepository;

class DeleteLinkHandler
{
    use AssertPermissionTrait;

    /**
     * @var LinkRepository
     */
    protected $links;

    /**
     * @param LinkRepository $links
     */
    public function __construct(LinkRepository $links)
    {
        $this->links = $links;
    }

    /**
     * @param DeleteLink $command
     * @return \Sijad\Links\Link
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(DeleteLink $command)
    {
        $actor = $command->actor;

        $link = $this->links->findOrFail($command->linkId, $actor);

        $this->assertAdmin($actor);

        $link->delete();

        return $link;
    }
}
