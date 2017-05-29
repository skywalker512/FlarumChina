<?php
/*
 * This file is part of reflar/user-management.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\UserManagement\Commands;

use Flarum\Core\User;

class ServeStrike
{
    /**.
     * @var integer
     */
    public $post_id;

    /**
     * @var string
     */
    public $reason;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param int    $post_id
     * @param string $reason
     * @param User   $actor
     */
    public function __construct($post_id, $reason, User $actor)
    {
        $this->post_id = $post_id;
        $this->reason = $reason;
        $this->actor = $actor;
    }
}
