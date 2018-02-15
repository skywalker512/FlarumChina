<?php

namespace Flagrow\Upload\Templates;


class ImagePreviewTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'image-preview';

    /**
     * {@inheritdoc}
     */
    public function name()
    {
        return $this->trans('flagrow-upload.admin.templates.image-preview');
    }

    /**
     * {@inheritdoc}
     */
    public function description()
    {
        return $this->trans('flagrow-upload.admin.templates.image-preview_description');
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('flagrow.download.templates::image-preview');
    }

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    public function bbcode()
    {
        return '[upl-image-preview url={URL}]';
    }
}
