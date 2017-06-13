<?php

namespace Flagrow\Upload\Templates;

use Flagrow\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Parser\Tag as ParserTag;
use s9e\TextFormatter\Configurator\Items\Tag as Tag;

class FileTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'file';
    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('flagrow.download.templates::file');
    }

    /**
     * @param Tag $tag
     */
    public function configureAttributes(Tag &$tag)
    {
        $tag->attributes->add('uuid');
        $tag->attributes->add('base_name');
        $tag->attributes->add('downloads')->filterChain->append('#uint');
        $tag->attributes->add('size');
    }

    /**
     * @param ParserTag $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes(ParserTag $tag, FileRepository $files)
    {
        $file = $files->findByUuid($tag->getAttribute('uuid'));
        $tag->setAttribute('base_name', $file->base_name);
        $tag->setAttribute('downloads', $file->downloads->count());
        $tag->setAttribute('size', $file->humanSize);
        return true;
    }
}
