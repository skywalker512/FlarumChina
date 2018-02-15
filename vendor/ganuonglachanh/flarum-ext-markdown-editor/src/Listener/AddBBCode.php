<?php
/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */
namespace GaNuongLaChanh\MarkdownEditor\Listener;

use Flarum\Event\ConfigureFormatter;
use Illuminate\Contracts\Events\Dispatcher;

class AddBBCode
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'addBBCode']);
    }
    /**
     * @param ConfigureFormatter $event
     */
    public function addBBCode(ConfigureFormatter $event)
    {
        // $event->configurator->BBCodes->addFromRepository('RIGHT');
        $event->configurator->BBCodes->addCustom(
            '[RIGHT]{TEXT}[/RIGHT]',
            '<div style="text-align:right">{TEXT}</div>'
        );
        //$event->configurator->BBCodes->addFromRepository('HL');
        $event->configurator->BBCodes->addCustom(
            '[HL]{TEXT}[/HL]',
            '<mark>{TEXT}</mark>'
        );
        //$event->configurator->BBCodes->addFromRepository('VIDEO');
        $event->configurator->BBCodes->addCustom(             
            '[AUDIO]{URL}[/AUDIO]',             
            '<audio controls><source src="{URL}" type="audio/mpeg">你的浏览器不支持 HTML5 音频，请使用 chrome 浏览器访问。</audio>'
        );
        //$event->configurator->BBCodes->addFromRepository('AUDIO');
        $event->configurator->BBCodes->addCustom(             
            '[video]{URL}[/video]',             
            '<video width="100%" controls><source src="{URL}" type="video/mp4">你的浏览器不支持 HTML5 视频，请使用 chrome 浏览器访问。</video>'
        );
        //$event->configurator->BBCodes->addFromRepository('SIZE1');
        $event->configurator->BBCodes->addCustom(             
            '[SIZE1]{TEXT}[/SIZE1]',             
            '<span style="font-size: 12px;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('SIZE2');
        $event->configurator->BBCodes->addCustom(             
            '[SIZE2]{TEXT}[/SIZE2]',             
            '<span style="font-size: 15px;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('SIZE3');
        $event->configurator->BBCodes->addCustom(             
            '[SIZE3]{TEXT}[/SIZE3]',             
            '<span style="font-size: 22px;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('SIZE4');
        $event->configurator->BBCodes->addCustom(             
            '[SIZE4]{TEXT}[/SIZE4]',             
            '<span style="font-size: 26px;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORT');
        $event->configurator->BBCodes->addCustom(             
            '[COLORT]{TEXT}[/COLORT]',             
            '<span style="color: #1abc9c;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORG');
        $event->configurator->BBCodes->addCustom(             
            '[COLORG]{TEXT}[/COLORG]',             
            '<span style="color: #2ecc71;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORB');
        $event->configurator->BBCodes->addCustom(             
            '[COLORB]{TEXT}[/COLORB]',             
            '<span style="color: #3498db;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORP');
        $event->configurator->BBCodes->addCustom(             
            '[COLORP]{TEXT}[/COLORP]',             
            '<span style="color: #9b59b6;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORY');
        $event->configurator->BBCodes->addCustom(             
            '[COLORY]{TEXT}[/COLORY]',             
            '<span style="color: #f1c40f;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORO');
        $event->configurator->BBCodes->addCustom(             
            '[COLORO]{TEXT}[/COLORO]',             
            '<span style="color: #e67e22;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORR');
        $event->configurator->BBCodes->addCustom(            
            '[COLORR]{TEXT}[/COLORR]',             
            '<span style="color: #e74c3c;">{TEXT}</span>'
        );
        //$event->configurator->BBCodes->addFromRepository('COLORS');
        $event->configurator->BBCodes->addCustom(             
            '[COLORS]{TEXT}[/COLORS]',             
            '<span style="color: #95a5a6;">{TEXT}</span>'
        );
    }
}
