<?php

namespace Flagrow\Analytics\Listeners;

use Flagrow\Analytics\Piwik\PaqPushList;
use Flarum\Event\ConfigureWebApp;
use Flarum\Core\Guest;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Str;

class AddTrackingJs
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addAssets']);
    }

    public function addAssets(ConfigureWebApp $event)
    {
        if ($event->isForum()) {
            // Add google analytics if tracking UA has been configured.
            if ($this->settings->get('flagrow.analytics.statusGoogle') && $this->settings->get('flagrow.analytics.googleTrackingCode')) {
                $rawJs = file_get_contents(realpath(__DIR__ . '/../../assets/js/google-analytics.html'));
                $js = str_replace("%%TRACKING_CODE%%", $this->settings->get('flagrow.analytics.googleTrackingCode'), $rawJs);
                $event->view->addHeadString($js);
            }

            // get the validation data
            $settings = [
                'statusPiwik' => $this->settings->get('flagrow.analytics.statusPiwik'),
                'piwikUrl' => $this->settings->get('flagrow.analytics.piwikUrl'),
                'piwikSiteId' => $this->settings->get('flagrow.analytics.piwikSiteId'),
            ];
            // Add piwik specific tracking code if configured in admin.
            if ($settings['statusPiwik'] && $settings['piwikUrl'] && $settings['piwikSiteId']) {
                $piwikUrl = $settings['piwikUrl'];

                // Use protocol-relative url if no protocol is defined
                if (!Str::startsWith($piwikUrl, ['http://', 'https://', '//'])) {
                    $piwikUrl = '//' . $piwikUrl;
                }

                // Add trailing slash if not already present
                if (!Str::endsWith($piwikUrl, '/')) {
                    $piwikUrl .= '/';
                }

                // get all the data
                $settings += [
                    'piwikHideAliasUrl' => $this->settings->get('flagrow.analytics.piwikHideAliasUrl'),
                    'piwikAliasUrl' => $this->settings->get('flagrow.analytics.piwikAliasUrl'),
                    'piwikTrackSubdomain' => $this->settings->get('flagrow.analytics.piwikTrackSubdomain'),
                    'piwikPrependDomain' => $this->settings->get('flagrow.analytics.piwikPrependDomain'),
                    'piwikTrackAccounts' => $this->settings->get('flagrow.analytics.piwikTrackAccounts'),
                ];

                $rawJs = file_get_contents(realpath(__DIR__ . '/../../assets/js/piwik-analytics.html'));

                $options = new PaqPushList();

                $options->addPush('setSiteId', $settings['piwikSiteId']);

                if ($settings['piwikTrackSubdomain']) {
                    $options->addPush('setCookieDomain', '*.' . $_SERVER['HTTP_HOST']);
                }

                if ($settings['piwikPrependDomain']) {
                    $options->addPush('setDocumentTitle', $options->raw('document.domain + \'/\' + document.title'));
                }

                if ($settings['piwikHideAliasUrl'] && $settings['piwikAliasUrl']) {
                    $options->addPush('setDomains', '*.' . $settings['piwikAliasUrl']);
                }

                if (in_array($settings['piwikTrackAccounts'], ['username', 'email'])) {
                    $user = $event->request->getAttribute('actor');

                    if (!($user instanceof Guest)) {
                        $userId = $user->{$settings['piwikTrackAccounts']};

                        $options->addPush('setUserId', $userId);
                    }
                }

                // Replace the ##piwik_options## has with the settings or an empty string.
                $js = str_replace('##piwik_options##', $options->asJavascript(), $rawJs);

                $js = str_replace("##piwik_url##", $piwikUrl, $js);
                $event->view->addHeadString($js);
            }
        }
    }
}
