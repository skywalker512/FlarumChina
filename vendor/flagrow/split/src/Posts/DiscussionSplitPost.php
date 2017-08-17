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
namespace Flagrow\Split\Posts;

use Flarum\Core\Discussion;
use Flarum\Core\Post;
use Flarum\Core\Post\AbstractEventPost;
use Flarum\Core\Post\MergeableInterface;
use Flarum\Core\User;
use Flarum\Forum\UrlGenerator;
use Illuminate\Database\Eloquent\Collection;

class DiscussionSplitPost extends AbstractEventPost implements MergeableInterface {

    /**
     * @var string
     */
    public static $type = 'discussionSplit';

    /**
     * Save the model, given that it is going to appear immediately after the
     * passed model.
     *
     * @param Post $previous
     * @return Post The model resulting after the merge. If the merge is
     *     unsuccessful, this should be the current model instance. Otherwise,
     *     it should be the model that was merged into.
     */
    public function saveAfter(Post $previous = null)
    {
        $this->save();

        return $this;
    }

    /**
     * Saves a post in the OLD Discussion referring to the new Discussion.
     *
     * @param Discussion $new
     * @param Discussion $old
     * @param User $user
     * @param Collection $posts
     * @return static
     */
    public static function to(Discussion $new, Discussion $old, User $user, Collection $posts)
    {
        $post = static::newReply($user, $old);

        $post->content = static::buildContent($new->title, $posts->count(), $new->id, $new->slug, true);

        $post->save();

        $old->setLastPost($post);

        return $post;
    }

    /**
     * Saves post in the NEW Discussion referring to the old Discussion.
     *
     * @param Discussion $new
     * @param Discussion $old
     * @param User $user
     * @param Collection $posts
     * @return DiscussionSplitPost
     */
    public static function from(Discussion $new, Discussion $old, User $user, Collection $posts)
    {
        $post = static::newReply($user, $new);

        $post->content = static::buildContent($old->title, $posts->count(), $old->id, $old->slug, false);

        $post->save();

        $new->setLastPost($post);

        return $post;
    }

    /**
     * @param User $user
     * @param Discussion $discussion
     * @return static
     */
    protected static function newReply(User $user, Discussion $discussion)
    {
        $post = new Static;
        $post->time = time();
        $post->user_id = $user->id;
        $post->discussion_id = $discussion->id;

        return $post;
    }

    /**
     *
     *
     * @param string $title
     * @param int $postCount
     * @param int $discussionId
     * @param string $slug
     * @param bool $toNew
     * @return array
     * @internal param Discussion $discussion
     */
    protected static function buildContent(string $title, int $postCount, int $discussionId, string $slug, bool $toNew)
    {
        /** @var UrlGenerator $url */
        $url = app(UrlGenerator::class);

        return [
            'title' => $title,
            'count' => $postCount,
            'url' => $url->toRoute('discussion', [
                'id' => "{$discussionId}-{$slug}"
            ]),
            'toNew' => $toNew
        ];
    }
}
