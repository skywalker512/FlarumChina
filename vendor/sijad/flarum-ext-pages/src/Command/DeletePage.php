<?php

namespace Sijad\Pages\Command;

use Flarum\Core\User;

class DeletePage
{
    /**
     * The ID of the page to delete.
     *
     * @var int
     */
    public $pageId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * Any other page input associated with the action. This is unused by
     * default, but may be used by extensions.
     *
     * @var array
     */
    public $data;

    /**
     * @param int   $pageId The ID of the page to delete.
     * @param User  $actor  The user performing the action.
     * @param array $data   Any other page input associated with the action. This
     *                      is unused by default, but may be used by extensions.
     */
    public function __construct($pageId, User $actor, array $data = [])
    {
        $this->pageId = $pageId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
