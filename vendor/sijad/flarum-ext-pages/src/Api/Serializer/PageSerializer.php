<?php

namespace Sijad\Pages\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

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
            'contentHtml' => $page->content_html,
        ];

        if ($this->actor->isAdmin()) {
            $attributes['content'] = $page->content;
            $attributes['isHidden'] = $page->is_hidden;
        }

        return $attributes;
    }
}
