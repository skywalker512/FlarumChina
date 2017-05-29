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

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Discussion;
use Flarum\Core\Post\CommentPost;
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\UserManagement\Events\UserWasGivenStrike;
use Reflar\UserManagement\Events\UserWillBeGivenStrike;
use Reflar\UserManagement\Repository\StrikeRepository;
use Reflar\UserManagement\Validators\StrikeValidator;

class ServeStrikeHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    protected $events;
    protected $users;
    protected $posts;
    protected $discussions;
    protected $settings;
    protected $validator;
    protected $strikes;

    /**
     * @param Dispatcher                  $events
     * @param UserRepository              $users
     * @param PostRepository              $posts
     * @param DiscussionRepository        $discussions
     * @param SettingsRepositoryInterface $settings
     * @param StrikeValidator             $validator
     * @param StrikeRepository            $strikes
     */
    public function __construct(
        Dispatcher $events,
        UserRepository $users,
        PostRepository $posts,
        DiscussionRepository $discussions,
        SettingsRepositoryInterface $settings,
        StrikeValidator $validator,
        StrikeRepository $strikes
    ) {
        $this->events = $events;
        $this->users = $users;
        $this->posts = $posts;
        $this->discussions = $discussions;
        $this->settings = $settings;
        $this->validator = $validator;
        $this->strikes = $strikes;
    }

    /**
     * @param ServeStrike $command
     *
     * @return \Flarum\Core\Discussion
     */
    public function handle(ServeStrike $command)
    {
        $this->assertCan($command->actor, 'discussion.strike');

        $this->validator->assertValid([
            'post_id' => $command->post_id,
        ]);

        $post = $this->posts->findOrFail($command->post_id, $command->actor);

        $user = $this->users->findOrFail($post->user_id, $command->actor);

        $content = $post->content;

        $this->events->fire(
            new UserWillBeGivenStrike($post, $user, $command->actor, $command->reason)
        );
        $strike = $this->strikes->serveStrike($post, $user, $command->actor->id, $command->reason);

        if ($post instanceof CommentPost) {
            if ($post->number == 1) {
                $discussion = $this->discussions->findOrFail($post->discussion_id, $command->actor);
                $discussion->hide_time = date('Y-m-d H:i:s');
                $discussion->save();
			}
        }
        $this->events->fire(
            new UserWasGivenStrike($post, $user, $command->actor, $command->reason)
        );

        return $strike;
    }
}
