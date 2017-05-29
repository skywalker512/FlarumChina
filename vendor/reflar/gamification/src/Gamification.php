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

namespace Reflar\gamification;

use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;

class Gamification
{
    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param PostRepository              $posts
     * @param UserRepository              $users
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(PostRepository $posts, UserRepository $users, SettingsRepositoryInterface $settings)
    {
        $this->posts = $posts;
        $this->users = $users;
        $this->settings = $settings;
    }

    /**
     * @return mixed
     */
    public function query()
    {
        return posts_votes::query();
    }

    /**
     * @param $post_id
     * @param $user_id
     * @param $type
     */
    public function saveVote($post_id, $user_id, $type)
    {
        $vote = new Vote();
        $vote->post_id = $post_id;
        $vote->user_id = $user_id;
        $vote->type = $type;
        $vote->save();
    }

    /**
     * @param $post_id
     * @param User $actor
     */
    public function upvote($post_id, User $actor)
    {
        $post = $this->posts->query()->where('id', $post_id)->first();

        if ($post !== null) {
            $this->saveVote($post->id, $actor->id, 'Up');
        }
    }

    /**
     * @param $post_id
     * @param User $actor
     */
    public function downvote($post_id, User $actor)
    {
        $post = $this->posts->findOrFail($post_id, $actor);
        $user = $post->user;

        $this->saveVote($post->id, $actor->id, 'Down');
    }

    /**
     * The Reddit hotness algorithm from https://github.com/reddit/reddit.
     *
     * @param $discussion
     */
    public function calculateHotness($discussion)
    {
        $date = strtotime($discussion->start_time);

        $s = $discussion->votes;
        $order = log10(max(abs($s), 1));

        if ($s > 0) {
            $sign = 1;
        } elseif ($s < 0) {
            $sign = -1;
        } else {
            $sign = 0;
        }

        $seconds = $date - 1134028003;

        $discussion->hotness = round($sign * $order + $seconds / 45000, 10);

        $discussion->save();
    }

    /**
     * @param $post_id
     * @param $user_id
     *
     * @return mixed
     */
    public function findVote($post_id, $user_id)
    {
        return Vote::where([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ])->first();
    }

    /**
     * @return mixed
     */
    public function orderByPoints($limit, $offset)
    {
        $blockedUsers = explode(', ', $this->settings->get('reflar.gamification.blockedUsers'));

        $query = User::query()
            ->whereNotIn('username', $blockedUsers)
            ->orderBy('votes', 'desc')
            ->offset($offset)
            ->take($limit)
            ->get();

        return $query;
    }

    /**
     * @param $post_id
     * @param $user_id
     * @param User $actor
     */
    public function convertLike($post_id, $user_id)
    {
        $user = $this->users->query()->where('id', $user_id)->first();
        $post = $this->posts->query()->where('id', $post_id)->first();

        if ($post !== null && $post->user !== null && $user !== null) {
            $post->user->increment('votes');

            if ($post->number = 1) {
                $post->discussion->increment('votes');
            }

            $this->upvote($post_id, $user);

            $ranks = json_decode($this->settings->get('reflar.gamification.ranks'), true);

            if (isset($ranks[$post->user->votes])) {
                $post->user->rank = $ranks[$post->user->votes];
                $post->user->save();
            }
        }
    }
}
