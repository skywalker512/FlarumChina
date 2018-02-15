<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Listener;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWillBeSaved;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Reactions\Event\PostWasReacted;
use Reflar\Reactions\Event\PostWasUnreacted;
use Reflar\Reactions\Reaction;

class SaveReactionsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SaveVotesToDatabase $gamification
     */
    public function __construct(SettingsRepositoryInterface $settings) {
        $this->settings = $settings;
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

        if ($post->exists && isset($data['attributes']['reaction'])) {
            $actor = $event->actor;
            $reacted = (bool)$data['attributes']['reaction'];
            $reactionType = $data['attributes']['reaction'];

            $this->assertCan($actor, 'react', $post);

            if (class_exists('Reflar\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('reflar.reactions.convertToUpvote')) {
                app()->make('Reflar\Gamification\Listeners\SaveVotesToDatabase')->vote($post, $isDownvoted = false, $isUpvoted = true, $actor, $post->user);

            } elseif (class_exists('Reflar\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('reflar.reactions.convertToDownvote')) {
                app()->make('Reflar\Gamification\Listeners\SaveVotesToDatabase')->vote($post, $isDownvoted = true, $isUpvoted = false, $actor, $post->user);

            } elseif (class_exists('Flarum\Likes\Listener\SaveLikesToDatabase') && $reactionType == $this->settings->get('reflar.reactions.convertToLike')) {
                $liked = $post->likes()->where('user_id', $actor->id)->exists();
                if ($liked) {
                    return;
                } else {
                    $post->likes()->attach($actor->id);

                    $post->raise(new PostWasLiked($post, $actor));
                }
            } else {

                $currentlyReacted = $post->reactions()->where('user_id', $actor->id)->exists();

                if ($reacted && !$currentlyReacted) {
                    $reaction = Reaction::where('identifier', $reactionType)->firstOrFail();

                    $post->reactions()->attach($reaction, ['user_id' => $actor->id, 'reaction_id' => $reaction->identifier]);

                    $post->raise(new PostWasReacted($post, $actor, $reaction->identifier));

                } elseif ($currentlyReacted) {

                    $post->reactions()->detach($post->reactions()->where('user_id', $actor->id)->first());

                    $post->raise(new PostWasUnreacted($post, $actor));
                }
            }
        }
    }

    /**
     * @param PostWasDeleted $event
     */
    public function whenPostWasDeleted(PostWasDeleted $event)
    {
        $event->post->reactions()->detach();
    }
}
