<?php
/**
* @package   s9e\mediaembed
* @copyright Copyright (c) 2015 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\Flarum\MediaEmbed;
use Flarum\Event\ConfigureFormatter;
use Illuminate\Events\Dispatcher;
use s9e\TextFormatter\Configurator\Bundles\MediaPack;
function subscribe(Dispatcher $events)
{
	$events->listen(
		ConfigureFormatter::class,
		function (ConfigureFormatter $event)
		{
            $event->configurator->MediaEmbed->add(
            'music163',
            [
                'host'    => 'music.163.com',
                'extract' => "!music\\.163\\.com/#/song\\?id=(?'id'[-0-9A-Z_a-z]+)!",
                'iframe'  => [
                    'width'  => 330,
                    'height' => 86,
                    'src'    => 'http://music.163.com/outchain/player?type=2&id={@id}&auto=0&height=66'
                ]
            ]
            );
            $event->configurator->MediaEmbed->add(
            'ku6',
            [
                'host'    => 'ku6.com',
                'extract' => "!ku6\\.com/show/(?'id'[\\w\\.\\-]+)\\.html!",
                'flash'  => [
                    'width'  => 480,
                    'height' => 400,
                    'flashvars' => "from=ku6",
                    'src'    => 'http://player.ku6.com/refer/{@id}/v.swf&auto=0'
                ]
            ]
            );
            $event->configurator->MediaEmbed->add(
				'tucao',
				[
					'host'    => 'tucao.tv',
					'extract' => "!tucao\\.tv/play/h(?'id'[-0-9A-Z_a-z]+)!",
					'iframe'  => ['src' => 'http://www.tucao.tv/mini/{@id}.swf']
				]
			);
			$event->configurator->MediaEmbed->add(
                'bilibili',
                [   
                    'host'    => 'www.bilibili.com',
                    'extract' => "!www.bilibili.com/video/av(?'id'[0-9]+)/!",
                    'flash'  => [
                        'width'  => 720,
                        'height' => 405,
                        'src'    => 'https://static-s.bilibili.com/miniloader.swf?aid={@id}'
                    ]
                ]
            );
			$event->configurator->Autoimage;
			(new MediaPack)->configure($event->configurator);
		}
	);
};
return __NAMESPACE__ . '\\subscribe';