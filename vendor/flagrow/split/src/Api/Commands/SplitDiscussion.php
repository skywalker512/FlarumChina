<?php
/*
 * This file is part of flagrow/flarum-ext-split.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Split\Api\Commands;

use Flarum\Core\User;

class SplitDiscussion
{
    /**
     * The post to start splitting from.
     *
     * @var int
     */
    public $start_post_id;

    /**
     * The post to end splitting on.
     *
     * @var int
     */
    public $end_post_number;

    /**
     * The title of the new discussion.
     *
     * @var string
     */
    public $title;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * SplitDiscussion constructor.
     *
     * @param string $title
     * @param int    $start_post_id
     * @param int    $end_post_number
     * @param User   $actor
     */
    public function __construct($title, $start_post_id, $end_post_number, User $actor)
    {
        $this->title           = $title;
        $this->start_post_id   = $start_post_id;
        $this->end_post_number = $end_post_number;
        $this->actor           = $actor;
    }
}
