<?php

namespace Sijad\ReCaptcha\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Flarum\Event\ConfigureValidator;
use Flarum\Core\Validator\UserValidator;
use Flarum\Core\Command\RegisterUser;
use Flarum\Settings\SettingsRepositoryInterface;
use Sijad\ReCaptcha\RecaptchaValidator;
use ReCaptcha\ReCaptcha;

class AddValidatorRule {
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureValidator::class, [$this, 'addRule']);
    }

    public function addRule(ConfigureValidator $event) {
        $secret = $this->settings->get('sijad-recaptcha.secret');
        if (! empty($secret)) {
            if ($event->type instanceof RecaptchaValidator) {
                $event->validator->addExtension(
                    'recaptcha',
                    function($attribute, $value, $parameters) use ($secret) {
                        $recaptcha = new ReCaptcha($secret);
                        return $recaptcha->verify($value)->isSuccess();
                    }
                );
            }
        }
    }
}
