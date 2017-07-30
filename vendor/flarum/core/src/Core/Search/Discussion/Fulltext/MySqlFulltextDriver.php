<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Search\Discussion\Fulltext;

use Flarum\Core\Post;
use Flarum\Core\Discussion;

class MySqlFulltextDriver implements DriverInterface
{
    /**
     * {@inheritdoc}
     */
    public function match($string)
    {
        $discussionIds = Discussion::whereRaw("is_approved = 1 AND title LIKE '%$string%'")
            ->orderBy('id', 'desc')
            ->limit(50)
            ->lists('id','start_post_id');
        $relevantPostIds = [];
        foreach ($discussionIds as $postId => $discussionId) {
            $relevantPostIds[$discussionId][] = $postId;
        }
        $discussionIds = Post::whereRaw("is_approved = 1 AND content LIKE '%$string%'")
            ->orderBy('id', 'desc')
            ->limit(50)
            ->lists('discussion_id', 'id');
        foreach ($discussionIds as $postId => $discussionId) {
            $relevantPostIds[$discussionId][] = $postId;
        }
        return $relevantPostIds;
    }
}
