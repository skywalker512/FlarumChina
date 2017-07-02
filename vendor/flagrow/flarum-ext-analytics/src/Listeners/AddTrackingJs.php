<?php namespace Flagrow\Analytics\Listeners;

use Flarum\Event\ConfigureClientView;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Settings\SettingsRepositoryInterface;

class AddTrackingJs
{
    /**
     * @var SettingsRepository
     */
    protected $settings;


    /**
     * AddTrackingJs constructor.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'addAssets']);
    }

    /**
     * @param ConfigureClientView $event
     */
    public function addAssets(ConfigureClientView $event)
    {
        if ($event->isForum()) {
            // Add google analytics if tracking UA has been configured.
            if ($this->settings->get('flagrow.analytics.statusGoogle') && $this->settings->get('flagrow.analytics.googleTrackingCode')) {
                $rawJs = file_get_contents(realpath(__DIR__ . '/../../assets/js/google-analytics.js'));
                $js    = str_replace("%%TRACKING_CODE%%", $this->settings->get('flagrow.analytics.googleTrackingCode'), $rawJs);
                $event->view->addHeadString($js);
            }

            // get the validation data
            $settings = array (
                'statusPiwik' => $this->settings->get('flagrow.analytics.statusPiwik'),
                'piwikUrl'    => $this->settings->get('flagrow.analytics.piwikUrl'),
                'piwikSiteId' => $this->settings->get('flagrow.analytics.piwikSiteId')
            );
            // Add piwik specific tracking code if configured in admin.
            if ($settings['statusPiwik'] && $settings['piwikUrl'] && $settings['piwikSiteId']) {
                // get all the data
                $settings += array (
                    'piwikHideAliasUrl'   => $this->settings->get('flagrow.analytics.piwikHideAliasUrl'),
                    'piwikAliasUrl'       => $this->settings->get('flagrow.analytics.piwikAliasUrl'),
                    'piwikTrackSubdomain' => $this->settings->get('flagrow.analytics.piwikTrackSubdomain'),
                    'piwikPrependDomain'  => $this->settings->get('flagrow.analytics.piwikPrependDomain')
                );

                $rawJs = file_get_contents(realpath(__DIR__ . '/../../assets/js/piwik-analytics.js'));

                $options = [];

                $options[] = "_paq.push(['setSiteId', " . $settings['piwikSiteId'] . "]);";

                if ($settings['piwikTrackSubdomain']) {
                    $options[] = "_paq.push(['setCookieDomain', '*." . $_SERVER['HTTP_HOST'] . "']);";
                }

                if ($settings['piwikPrependDomain']) {
                    $options[] = "_paq.push(['setDocumentTitle', document.domain + '/' + document.title]);";
                }

                if ($settings['piwikHideAliasUrl'] && $settings['piwikAliasUrl']) {
                    $options[] = "_paq.push(['setDomains', ['*." . $settings['piwikAliasUrl'] . "']]);";
                }

                // Sanity check, add empty string or the combined array.
                if (count($options)) {
                    $options = implode("\n    ", $options);
                } else {
                    $options = '';
                }

                // Replace the ##piwik_options## has with the settings or an empty string.
                $js = str_replace('##piwik_options##', $options, $rawJs);

                $js = str_replace("##piwik_url##", $settings['piwikUrl'], $js);
                $event->view->addHeadString($js);
            }
        }
    }
}
