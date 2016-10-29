<?php

namespace Sijad\Pages;

use Flarum\Database\AbstractModel;
use Flarum\Formatter\Formatter;

class Page extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'pages';

    /**
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'is_hidden' => 'boolean',
        'is_html' => 'boolean',
    ];

    /**
     * {@inheritdoc}
     */
    protected $dates = ['time', 'edit_time'];

    /**
     * The text formatter instance.
     *
     * @var \Flarum\Formatter\Formatter
     */
    protected static $formatter;

    /**
     * Create a new page.
     *
     * @param string $name
     * @param string $url
     * @param string $type
     *
     * @return static
     */
    public static function build($title, $slug, $content, $isHidden)
    {
        $page = new static();

        $page->title = $title;
        $page->slug = $slug;
        $page->time = time();
        $page->content = $content;
        $page->is_hidden = $isHidden && true;

        return $page;
    }

    /**
     * Unparse the parsed content.
     *
     * @param string $value
     *
     * @return string
     */
    public function getContentAttribute($value)
    {
        return static::$formatter->unparse($value);
    }

    /**
     * Get the parsed/raw content.
     *
     * @return string
     */
    public function getParsedContentAttribute()
    {
        return $this->attributes['content'];
    }

    /**
     * Parse the content before it is saved to the database.
     *
     * @param string $value
     */
    public function setContentAttribute($value)
    {
        $this->attributes['content'] = $value ? static::$formatter->parse($value, $this) : null;
    }

    /**
     * Get the content rendered as HTML.
     *
     * @return string
     */
    public function getContentHtmlAttribute()
    {
        if ($this->is_html) {
            return nl2br($this->content);
        }
        return static::$formatter->render($this->attributes['content'], $this);
    }

    /**
     * Get the text formatter instance.
     *
     * @return \Flarum\Formatter\Formatter
     */
    public static function getFormatter()
    {
        return static::$formatter;
    }

    /**
     * Set the text formatter instance.
     *
     * @param \Flarum\Formatter\Formatter $formatter
     */
    public static function setFormatter(Formatter $formatter)
    {
        static::$formatter = $formatter;
    }
}
