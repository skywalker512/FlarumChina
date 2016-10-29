<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\User;

class DeleteLink
{
    /**
     * The ID of the link to delete.
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
     * Any other link input associated with the action. This is unused by
     * default, but may be used by extensions.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $linkId The ID of the link to delete.
     * @param User $actor The user performing the action.
     * @param array $data Any other link input associated with the action. This
     *     is unused by default, but may be used by extensions.
     */
    public function __construct($linkId, User $actor, array $data = [])
    {
        $this->linkId = $linkId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
