<?php
namespace issyrocks12\UsersList\Api\Controller;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\UserRepository;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Zend\Diactoros\Response\EmptyResponse;

class SendAdminEmailController implements ControllerInterface
{
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Mailer
     */
    protected $mailer;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param Mailer $mailer
     * @param TranslatorInterface $translator
     * @param UserRepository $users
     */
    public function __construct(SettingsRepositoryInterface $settings, Mailer $mailer, TranslatorInterface $translator, UserRepository $users)
    {
        $this->settings = $settings;
        $this->mailer = $mailer;
        $this->translator = $translator;
        $this->users = $users;
    }

    /**
     * {@inheritdoc}
     * @throws \InvalidArgumentException
     */
    public function handle(ServerRequestInterface $request)
    {
        $actor = $request->getAttribute('actor');

        if ($actor !== null && $actor->isAdmin()) {
            $data = array_get($request->getParsedBody(), 'data', []); 
            if (isset($data['forAll']) && !empty($data['forAll'])) {
                $users = $this->users->query()->whereVisibleTo($actor)->get();
                foreach ($users as $user) {
                    $this->sendMail($user->email, $data['subject'], $data['text'], $user->username);
		}
            } else {
                foreach ($data['emails'] as $email) {
                    $this->sendMail($email, $data['subject'], $data['text'], $data['username']);                }
            }
        }

        return new EmptyResponse;
    }

    protected function sendMail($email, $subject, $text, $user)
    {
	$varText = str_replace("!!user!!", $user, $text);
        $this->mailer->send('issyrocks12-userlist::default', ['text' => $varText], function (Message $message) use ($email, $subject) {
            $message->to($email);
            $message->subject('[' . $this->settings->get('forum_title') . '] ' . ($subject !== '' ? $subject : $this->translator->trans('issyrocks12-users-list.email.default_subject')));
        });
    }
}
