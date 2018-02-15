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

namespace Reflar\gamification\Listeners;

use DateTime;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\FloodingException;
use Flarum\Core\Notification;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasVoted;
use Reflar\gamification\Gamification;
use Reflar\gamification\Notification\VoteBlueprint;
use Reflar\gamification\Rank;
use Reflar\gamification\Vote;

class SaveVotesToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @var Gamification
     */
    protected $gamification;

    public function __construct(Dispatcher $events, NotificationSyncer $notifications, Gamification $gamification)
    {
        $this->events = $events;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWillBeSaved::class, [$this, 'whenPostWillBeSaved']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function whenPostWillBeSaved(PostWillBeSaved $event)
    {
        $post = $event->post;
        if ($post->id) {
            $data = $event->data;
            $actor = $event->actor;
            $user = $post->user;

            $this->assertCan($actor, 'vote', $post->discussion);
            $this->assertNotFlooding($actor);

            $isUpvoted = false;
            $isDownvoted = false;

            if ($data['attributes']['isUpvoted']) {
                $isUpvoted = true;
            }

            if ($data['attributes']['isDownvoted']) {
                $isDownvoted = true;
            }

            $this->vote($post, $isDownvoted, $isUpvoted, $actor, $user);
        }
    }

    public function vote($post, $isDownvoted, $isUpvoted, $actor, $user)
    {
        $vote = Vote::where([
            'post_id' => $post->id,
            'user_id' => $actor->id,
        ])->first();

        if ($vote) {
            if (!$isUpvoted && !$isDownvoted) {
                if ($vote->type == 'Up') {
                    $this->changePoints($user, $post, -1);
                } else {
                    $this->changePoints($user, $post, 1);
                }
                $this->sendData($post, $user, $actor, 'None', $vote->type);
                $vote->delete();
            } else {
                if ($vote->type == 'Up') {
                    $vote->type = 'Down';
                    $this->changePoints($user, $post, -2);

                    $this->sendData($post, $user, $actor, 'Down', 'Up');
                } else {
                    $vote->type = 'Up';
                    $this->changePoints($user, $post, 2);

                    $this->sendData($post, $user, $actor, 'Up', 'Down');
                }
                $vote->save();
            }
        } else {
            $vote = Vote::build($post, $actor);
            if ($isDownvoted) {
                $vote->type = 'Down';
                $this->changePoints($user, $post, -1);
            } elseif ($isUpvoted) {
                $vote->type = 'Up';
                $this->changePoints($user, $post, 1);
            }
            $this->sendData($post, $user, $actor, $vote->type, ' ');
            $vote->save();
        }
        $actor->last_vote_time = new DateTime();
        $actor->save();
    }

    /**
     * @param $user
     * @param $post
     * @param $number
     */
    public function changePoints($user, $post, $number)
    {
        $user->votes = $user->votes + $number;
        $discussion = $post->discussion;

        if ($post->number == 1) {
            $discussion->votes = $discussion->votes + $number;
            $discussion->save();
            $this->gamification->calculateHotness($discussion);
        }
        $post->save();
        $user->save();
    }

    /**
     * @param $post
     * @param $user
     * @param $actor
     * @param $type
     */
    public function sendData($post, $user, $actor, $type, $before)
    {
        $oldVote = Notification::where([
            'sender_id' => $actor->id,
            'subject_id' => $post->id,
            'data' => '"'.$before.'"',
        ])->first();

        if ($oldVote) {
            if ($type === 'None') {
                $oldVote->delete();
            } else {
                $oldVote->data = $type;
                $oldVote->save();
            }
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new VoteBlueprint($post, $actor, $type),
                [$user]);
        }

        $this->events->fire(
            new PostWasVoted($post, $user, $actor, $type)
        );

        if ($type === 'Up') {
            $ranks = Rank::where('points', '<=', $user->votes)->get();

            if ($ranks !== null) {
                $user->ranks()->detach();
                foreach ($ranks as $rank) {
                    $user->ranks()->attach($rank->id);
                }
            }
        } elseif ($type === 'Down') {
            $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

            if ($ranks !== null) {
                foreach ($ranks as $rank) {
                    $user->ranks()->detach($rank->id);
                }
            }
        }
    }

    /**
     * @param $user
     *
     * @throws FloodingException
     */
    public function assertNotFlooding($actor)
    {
        if (new DateTime($actor->last_vote_time) >= new DateTime('-10 seconds')) {
            throw new FloodingException();
        }
    }
}
