<?php

namespace Sijad\Pages\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Sijad\Pages\Util\Html;

class PageSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'pages';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($page)
    {
        $attributes = [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'time' => $page->time,
            'editTime' => $page->edit_time,
            'contentHtml' => Html::render($page->content_html, $page)
        ];

        if ($this->actor->isAdmin()) {
            $attributes['content'] = $page->content;
            $attributes['isHidden'] = $page->is_hidden;
        }

        return $attributes;
    }
}
