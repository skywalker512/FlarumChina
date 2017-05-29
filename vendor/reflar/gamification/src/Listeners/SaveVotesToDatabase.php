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

use Flarum\Core\Notification;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Core\Post\Floodgate;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasDownvoted;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Gamification;
use Reflar\gamification\Notification\DownvotedBlueprint;
use Reflar\gamification\Notification\UpvotedBlueprint;
use Reflar\gamification\Rank;

class SaveVotesToDatabase
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var FloodGate
     */
    protected $floodgate;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    public function __construct(Gamification $gamification, Dispatcher $events, FloodGate $floodgate, NotificationSyncer $notifications)
    {
        $this->gamification = $gamification;
        $this->events = $events;
        $this->floodgate = $floodgate;
        $this->notifications = $notifications;
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
        $data = $event->data;
        $actor = $event->actor;
        $user = $post->user;
        $discussion = $post->discussion;

        $this->floodgate->assertNotFlooding($actor);

        if (isset($data['attributes']['isUpvoted'])) {
            $isUpvoted = $data['attributes']['isUpvoted'];
        } else {
            $isUpvoted = false;
        }

        if (isset($data['attributes']['isDownvoted'])) {
            $isDownvoted = $data['attributes']['isDownvoted'];
        } else {
            $isDownvoted = false;
        }

        if ($post->exists) {
            $vote = $this->gamification->findVote($post->id, $actor->id);

            if (isset($vote)) {
                if ($isUpvoted == false && $isDownvoted == false) {
                    if ($vote->type == 'Up') {
                        $user->decrement('votes');

                        if ($post->number == 1) {
                            $discussion->decrement('votes');
                        }
                    } else {
                        $user->increment('votes');

                        if ($post->number == 1) {
                            $discussion->increment('votes');
                        }
                    }
                    $this->checkDownUserVotes($user);
                    $vote->delete();
                } elseif ($vote->type == 'Up') {
                    $vote->type = 'Down';

                    $vote->save();

                    $user->votes = $user->votes - 2;

                    if ($post->number == 1) {
                        $discussion->votes = $discussion->votes - 2;
                    }

                    $this->sendDownvotedData($post, $user, $actor);
                } elseif ($vote->type == 'Down') {
                    $vote->type = 'Up';

                    $vote->save();

                    $user->votes = $user->votes + 2;

                    if ($post->number == 1) {
                        $discussion->votes = $discussion->votes + 2;
                    }

                    $this->sendUpvotedData($post, $user, $actor);
                }
            } elseif ($isDownvoted == true) {
                $this->gamification->downvote($post->id, $actor);

                $user->decrement('votes');

                if ($post->number == 1) {
                    $discussion->decrement('votes');
                }

                $this->sendDownvotedData($post, $user, $actor);
            } elseif ($isUpvoted == true) {
                $this->gamification->upvote($post->id, $actor);

                $user->increment('votes');

                if ($post->number == 1) {
                    $discussion->increment('votes');
                }

                $this->sendUpvotedData($post, $user, $actor);
            }
            $user->save();
            $discussion->save();
            $post->save();
            $this->gamification->calculateHotness($post->discussion);
        }
    }

    public function sendDownvotedData($post, $user, $actor)
    {
        $oldVote = Notification::where([
            'data'       => $actor->id,
            'subject_id' => $post->id,
            'type'       => 'upvoted',
        ])->first();

        if ($oldVote !== null) {
            $oldVote->type = 'downvoted';
            $oldVote->save();
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new DownvotedBlueprint($post, $actor, $user),
                [$user]);
        }

        $this->events->fire(
            new PostWasUpvoted($post, $user, $actor)
        );

        $this->checkDownUserVotes($user);
    }

    public function sendUpvotedData($post, $user, $actor)
    {
        $oldVote = Notification::where([
            'data'       => $actor->id,
            'subject_id' => $post->id,
            'type'       => 'downvoted',
        ])->first();

        if ($oldVote !== null) {
            $oldVote->type = 'upvoted';
            $oldVote->save();
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new UpvotedBlueprint($post, $actor, $user),
                [$user]);
        }

        $this->events->fire(
            new PostWasDownvoted($post, $user, $actor)
        );

        $this->checkUpUserVotes($user);
    }

    /**
     * @param $user
     */
    private function checkUpUserVotes($user)
    {
        $ranks = Rank::where('points', '<=', $user->votes)->get();

        if ($ranks !== null) {
            $user->ranks()->detach();
            foreach ($ranks as $rank) {
                $user->ranks()->attach($rank->id);
            }
        }
    }

    /**
     * @param $user
     */
    private function checkDownUserVotes($user)
    {
        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if ($ranks !== null) {
            foreach ($ranks as $rank) {
                $user->ranks()->detach($rank->id);
            }
        }
    }
}
