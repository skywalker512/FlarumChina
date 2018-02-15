<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Templates\AbstractTemplate;
use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterParser;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;
use InvalidArgumentException;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Configurator\Exceptions\UnsafeTemplateException;

class AddPostDownloadTags
{
    /**
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var FileRepository
     */
    private $files;

    /**
     * @var array|AbstractTemplate[]
     */
    protected $templates = [];
    /**
     * @var Settings
     */
    private $settings;

    function __construct(UrlGenerator $url, FileRepository $files, Settings $settings)
    {
        $this->url = $url;
        $this->files = $files;
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'configure']);
        $events->listen(ConfigureFormatterParser::class, [$this, 'parse']);
    }

    /**
     * @param ConfigureFormatter $event
     */
    public function configure(ConfigureFormatter $event)
    {
        foreach ($this->settings->getRenderTemplates() as $name => $template) {
            $this->createTag($event->configurator, $name, $template);
        }
    }

    /**
     * @param Configurator $configurator
     * @param string $name
     * @param AbstractTemplate $template
     */
    protected function createTag(Configurator &$configurator, $name, AbstractTemplate $template)
    {
        try {
            $configurator->BBCodes->addCustom(
                $template->bbcode(),
                $template->template()
            );
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException("Failed importing $name due to {$e->getMessage()}");
        } catch (UnsafeTemplateException $e) {
            throw new UnsafeTemplateException("Failed importing $name due to {$e->getMessage()}", $e->getNode());
        }
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }
}
