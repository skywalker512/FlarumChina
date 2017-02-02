<?php

namespace WiwatSrt\BestAnswer\Listener;

use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class SelectBestAnswers
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(DiscussionWillBeSaved::class, [$this, 'whenDiscussionWillBeSaved']);
    }

    /**
     * @param DiscussionWillBeSaved $event
     */
    public function whenDiscussionWillBeSaved(DiscussionWillBeSaved $event)
    {
        $discussion = $event->discussion;
        $data = $event->data;

        if ($discussion->exists && isset($data['attributes']['bestAnswerPostId'])) {
            $bestAnswerPostId = $data['attributes']['bestAnswerPostId'];
            $discussion->best_answer_post_id = $bestAnswerPostId;
            $discussion->save();
        }
    }
}