<?php namespace AntoineFr\Money\Listeners;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Core\User;
use Flarum\Event\PostWasPosted;
use Flarum\Event\PostWasRestored;
use Flarum\Event\PostWasHidden;
use Flarum\Event\DiscussionWasStarted;
use Flarum\Event\DiscussionWasRestored;
use Flarum\Event\DiscussionWasHidden;
use Flarum\Event\UserWillBeSaved;

class GiveMoney
{
    use AssertPermissionTrait;
    
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings) {
        $this->settings = $settings;
    }
    
    public function subscribe(Dispatcher $events) {
        $events->listen(PostWasPosted::class, [$this, 'postWasPosted']);
        $events->listen(PostWasRestored::class, [$this, 'postWasRestored']);
        $events->listen(PostWasHidden::class, [$this, 'postWasHidden']);
        $events->listen(DiscussionWasStarted::class, [$this, 'discussionWasStarted']);
        $events->listen(DiscussionWasRestored::class, [$this, 'discussionWasRestored']);
        $events->listen(DiscussionWasHidden::class, [$this, 'discussionWasHidden']);
        $events->listen(UserWillBeSaved::class, [$this, 'userWillBeSaved']);
    }
    
    public function giveMoney(User $user, $money) {
        $money = (float)$money;
        $user->money += $money;
        $user->save();
    }
    
    public function postWasPosted(PostWasPosted $event) {
        // If it's not the first post of a discussion
        if ($event->post['number'] > 1) {
            $minimumLength = (int)$this->settings->get('antoinefr-money.postminimumlength', 0);
            if (strlen($event->post->content) >= $minimumLength) {
                $money = (float)$this->settings->get('antoinefr-money.moneyforpost', 0);
                $this->giveMoney($event->actor, $money);
            }
        }
    }
    
    public function postWasRestored(PostWasRestored $event) {
        $minimumLength = (int)$this->settings->get('antoinefr-money.postminimumlength', 0);
        if (strlen($event->post->content) >= $minimumLength) {
            $money = (float)$this->settings->get('antoinefr-money.moneyforpost', 0);
            $this->giveMoney($event->post->user, $money);
        }
    }
    
    public function postWasHidden(PostWasHidden $event) {
        $minimumLength = (int)$this->settings->get('antoinefr-money.postminimumlength', 0);
        if (strlen($event->post->content) >= $minimumLength) {
            $money = (float)$this->settings->get('antoinefr-money.moneyforpost', 0);
            $this->giveMoney($event->post->user, -$money);
        }
    }
    
    public function discussionWasStarted(DiscussionWasStarted $event) {
        $money = (float)$this->settings->get('antoinefr-money.moneyfordiscussion', 0);
        $this->giveMoney($event->actor, $money);
    }
    
    public function discussionWasRestored(DiscussionWasRestored $event) {
        $money = (float)$this->settings->get('antoinefr-money.moneyfordiscussion', 0);
        $this->giveMoney($event->discussion->startUser, $money);
    }
    
    public function discussionWasHidden(DiscussionWasHidden $event) {
        $money = (float)$this->settings->get('antoinefr-money.moneyfordiscussion', 0);
        $this->giveMoney($event->discussion->startUser, -$money);
    }
    
    public function userWillBeSaved(UserWillBeSaved $event) {
        $attributes = array_get($event->data, 'attributes', []);
        if (array_key_exists('money', $attributes)) {
            $user = $event->user;
            $actor = $event->actor;
            $this->assertCan($actor, 'edit_money', $user);
            $user->money = (float)$attributes['money'];
        }
    }
}