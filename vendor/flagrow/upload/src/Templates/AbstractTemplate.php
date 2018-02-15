<?php

namespace Flagrow\Upload\Templates;

use Flagrow\Upload\File;
use Illuminate\Contracts\View\Factory;

abstract class AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag;

    /**
     * The human readable name of the template.
     *
     * @return string
     */
    abstract public function name();

    /**
     * A clarification of how this template works.
     *
     * @return string
     */
    abstract public function description();
    /**
     * The unique tag for this template.
     *
     * @return string
     */
    public function tag()
    {
        return $this->tag;
    }

    /**
     * @param string $view
     * @param array $arguments
     * @return string
     */
    protected function getView($view, $arguments = [])
    {
        return app(Factory::class)->make($view, $arguments);
    }

    /**
     * @param $key
     * @param array $params
     * @return mixed
     */
    protected function trans($key, array $params = [])
    {
        return app('translator')->trans($key, $params);
    }

    /**
     * The rendered template to use with this tag.
     *
     * @return string
     */
    abstract public function template();

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    abstract public function bbcode();

    /**
     * Generates a preview bbcode string.
     *
     * @param File $file
     * @return string
     */
    public function preview(File $file)
    {
        $bbcode = $this->bbcode();

        return preg_replace_callback_array([
            '/\](?<find>.*)\[/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->base_name, $m[0]);
            },
            '/size=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->humanSize, $m[0]);
            },
            '/uuid=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->uuid, $m[0]);
            },
            '/url=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->url, $m[0]);
            }
        ], $bbcode);
    }
}
