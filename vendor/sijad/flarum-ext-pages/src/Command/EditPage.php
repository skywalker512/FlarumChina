<?php

namespace Sijad\Pages\Command;

use Flarum\Core\User;

class EditPage
{
    /**
     * The ID of the page to edit.
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
     * The attributes to update on the page.
     *
     * @var array
     */
    public $data;

    /**
     * @param int   $pageId The ID of the page to edit.
     * @param User  $actor  The user performing the action.
     * @param array $data   The attributes to update on the page.
     */
    public function __construct($pageId, User $actor, array $data)
    {
        $this->pageId = $pageId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
