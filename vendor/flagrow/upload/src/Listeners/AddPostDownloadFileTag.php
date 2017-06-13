<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Repositories\FileRepository;
use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterParser;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;
use s9e\TextFormatter\Configurator\Items\Tag;

class AddPostDownloadFileTag
{
    /**
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var FileRepository
     */
    private $files;

    function __construct(UrlGenerator $url, FileRepository $files)
    {
        $this->url = $url;
        $this->files = $files;
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
        $configurator = $event->configurator;

        $tagName = 'FLAGROW_DOWNLOAD';

        $tag = $configurator->tags->add($tagName);

        $tag->attributes->add('uuid');
        $tag->attributes->add('base_name');
        $tag->attributes->add('downloads')->filterChain->append('#uint');
        $tag->attributes->add('size')->filterChain->append('#uint');

        $tag->template =
            '<div class="flagrow-download-button ButtonGroup" data-uuid="{@uuid}">'.
                '<div class="Button hasIcon Button--icon Button--primary download"><i class="fa fa-download"></i></div>'.
                '<div class="Button"><xsl:value-of select="@base_name"/></div>'.
                '<div class="Button"><xsl:value-of select="@size"/><xsl:text>b</xsl:text></div>'.
                '<div class="Button"><xsl:value-of select="@downloads"/></div>'.
            '</div>';

        $tag->filterChain->prepend([static::class, 'addAttributes'])
            ->addParameterByName('fileRepository')
            ->setJS('function() { return true; }');

        $configurator->Preg->match('/'. preg_quote('$file-') .'(?<uuid>[a-z0-9-]{36})/', $tagName);
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }

    /**
     * @param $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes(Tag $tag, FileRepository $files)
    {
        $file = $files->findByUuid($tag->getAttribute('uuid'));
        $tag->setAttribute('base_name', $file->base_name);
        $tag->setAttribute('downloads', $file->downloads->count());
        $tag->setAttribute('size', $file->size);
        return true;
    }
}
