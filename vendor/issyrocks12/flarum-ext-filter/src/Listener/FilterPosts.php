<?php

namespace issyrocks12\filter\Listener;

use DirectoryIterator;
use Flarum\Core\Post\CommentPost;
use Flarum\Core\Repository\PostRepository;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\PostWasPosted;
use Flarum\Event\PostWillBeSaved;
use Flarum\Flags\Flag;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Symfony\Component\Translation\TranslatorInterface;

class FilterPosts
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    /**
     * @var Application
     */
    protected $app;
    /**
     * @var Mailer
     */
    protected $mailer;
    /**
     * @var TranslatorInterface
     */
    protected $translator;
    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param Application                 $app
     * @param TranslatorInterface         $translator
     * @param Mailer                      $mailer
     * @param PostRepository              $posts
     */
    public function __construct(SettingsRepositoryInterface $settings, Mailer $mailer, Application $app, TranslatorInterface $translator, PostRepository $posts)
    {
        $this->settings = $settings;
        $this->app = $app;
        $this->mailer = $mailer;
        $this->translator = $translator;
        $this->posts = $posts;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWillBeSaved::class, [$this, 'checkPost']);
        $events->listen(PostWasPosted::class, [$this, 'mergePost']);
        $events->listen(ConfigureLocales::class, [$this, 'configLocales']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function checkPost(PostWillBeSaved $event)
    {
        $words = explode(', ', $this->settings->get('Words'));
        $post = $event->post;
        $content = $post->content;
        foreach ($words as $word) {
            if (stripos($content, $word) !== false) {
                $this->flagPost($post);
                if ($this->settings->get('emailWhenFlagged') == 1 && $post->emailed == 0) {
                    $this->sendEmail($post);
                }
                break;
            }
        }
    }

    public function mergePost(PostWasPosted $event)
    {
        $post = $event->post;

        if ($post instanceof CommentPost && $post->number !== 1 && $this->settings->get('autoMergePosts') == 1) {
            $oldPost = $this->posts->query()
              ->where('discussion_id', '=', $post->discussion_id)
              ->where('number', '<', $post->number)
              ->where('hide_time', '=', null)
              ->orderBy('number', 'desc')
              ->firstOrFail();

            if ($oldPost->user_id == $post->user_id) {
                $oldPost->revise($oldPost->content.'
                
'.$post->content, $post->user);

                $oldPost->save();

                $post->hide();
                $post->save();
            }
        }
    }

    public function flagPost($post)
    {
        $post->is_approved = false;
        $post->afterSave(function ($post) {
            if ($post->number == 1) {
                $post->discussion->is_approved = false;
                $post->discussion->save();
            }
            $flag = new Flag();
            $flag->post_id = $post->id;
            $flag->type = $this->translator->trans('issyrocks12-filter.forum.flagger_name');
            $flag->reason = $this->translator->trans('issyrocks12-filter.forum.flag_message');
            $flag->time = time();
            $flag->save();
        });
    }

    public function sendEmail($post)
    {
        // Admin hasn't saved an email template to the database
        if ($this->settings->get('flaggedSubject') == '' && $this->settings->get('flaggedEmail') == '') {
            $this->settings->set('flaggedSubject', $this->translator->trans('issyrocks12-filter.admin.email.default_subject'));
            $this->settings->set('flaggedEmail', $this->translator->trans('issyrocks12-filter.admin.email.default_text'));
        }
        $email = $post->user->email;
        $linebreaks = ["\n", "\r\n"];
        $subject = $this->settings->get('flaggedSubject');
        $text = str_replace($linebreaks, $post->user->username, $this->settings->get('flaggedEmail'));
        $this->mailer->send('issyrocks12-filter::default', ['text' => $text], function (Message $message) use ($subject, $email) {
            $message->to($email);
            $message->subject($subject);
        });
        $post->emailed = true;
    }

    public function configLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__.'/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'], false)) {
                $event->locales->addTranslations($file->getBasename('.'.$file->getExtension()), $file->getPathname());
            }
        }
    }
}
