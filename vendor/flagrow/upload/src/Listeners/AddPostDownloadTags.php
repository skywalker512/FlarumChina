<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Templates\AbstractTemplate;
use Flagrow\Upload\Templates\FileTemplate;
use Flagrow\Upload\Templates\ImageTemplate;
use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterParser;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;
use s9e\TextFormatter\Configurator;

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
    protected static $templates = [];

    function __construct(UrlGenerator $url, FileRepository $files)
    {
        $this->url = $url;
        $this->files = $files;

        static::addTemplate(app()->make(FileTemplate::class));
        static::addTemplate(app()->make(ImageTemplate::class));
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
        foreach (static::$templates as $name => $template) {
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
        $tagName = strtoupper("FLAGROW_FILE_$name");

        $tag = $configurator->tags->add($tagName);

        $template->configureAttributes($tag);

        $tag->template = $template->template();

        $tag->filterChain->prepend([$template, 'addAttributes'])
            ->addParameterByName('fileRepository')
            ->setJS('function() { return true; }')
        ;

        $configurator->Preg->match(
            '/' . preg_quote('$' . $name . '-') . '(?<uuid>[a-z0-9-]{36})/',
            $tagName
        );
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }

    /**
     * @param AbstractTemplate $template
     */
    public static function addTemplate(AbstractTemplate $template)
    {
        static::$templates[$template->tag()] = $template;
    }
}
