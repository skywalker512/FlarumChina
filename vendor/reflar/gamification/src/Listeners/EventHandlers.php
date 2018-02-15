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

use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWasPosted;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Gamification;
use Reflar\gamification\Notification\VoteBlueprint;
use Reflar\gamification\Rank;
use Reflar\gamification\Vote;

class EventHandlers
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var Vote
     */
    protected $vote;

    /**
     * EventHandlers constructor.
     *
     * @param SettingsRepositoryInterface $settings
     * @param NotificationSyncer          $notifications
     * @param Gamification                $gamification
     */
    public function __construct(SettingsRepositoryInterface $settings, NotificationSyncer $notifications, Gamification $gamification)
    {
        $this->settings = $settings;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        $events->listen(PostWasPosted::class, [$this, 'addVote']);
        $events->listen(PostWasDeleted::class, [$this, 'removeVote']);
    }

    /**
     * @param PostWasPosted $event
     */
    public function addVote(PostWasPosted $event)
    {
        if ($this->settings->get('reflar.gamification.autoUpvotePosts') !== '0') {
            $actor = $event->actor;

            $actor->increment('votes');
            $event->post->discussion->increment('votes');
            $this->gamification->calculateHotness($event->post->discussion);

            $vote = Vote::build($event->post, $actor);
            $vote->type = 'Up';
            $vote->save();

            $ranks = Rank::where('points', '<=', $actor->votes)->get();

            if ($ranks !== null) {
                $actor->ranks()->detach();
                foreach ($ranks as $rank) {
                    $actor->ranks()->attach($rank->id);
                }
            }
        }
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        $event->add(VoteBlueprint::class, PostBasicSerializer::class, ['alert']);
    }

    /**
     * @param PostWasDeleted $event
     */
    public function removeVote(PostWasDeleted $event)
    {
        $user = $event->post->user;
        $event->post->user->decrement('votes');

        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if ($ranks !== null) {
            foreach ($ranks as $rank) {
                $user->ranks()->detach($rank->id);
            }
        }
    }
}
