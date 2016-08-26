<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\User;

class EditLink
{
    /**
     * The ID of the link to edit.
     *
     * @var int
     */
    public $linkId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes to update on the link.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $linkId The ID of the link to edit.
     * @param User $actor The user performing the action.
     * @param array $data The attributes to update on the link.
     */
    public function __construct($linkId, User $actor, array $data)
    {
        $this->linkId = $linkId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
