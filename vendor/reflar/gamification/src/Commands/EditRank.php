<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Commands;

use Flarum\Core\User;

class EditRank
{
    /**
     * @var int
     */
    public $rankId;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var array
     */
    public $data;

    /**
     * @param int   $rankId
     * @param User  $actor
     * @param array $data
     */
    public function __construct($rankId, User $actor, array $data)
    {
        $this->rankId = $rankId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
