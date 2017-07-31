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
            $event->configurator->Autoimage;
            $event->configurator->MediaEmbed->add(
                'music163',
	[
		'host'    => 'music.163.com',
		'extract' => [
			"!music\\.163\\.com/#/song\\?id=(?'song_id'\\d+)!",
			"!music\\.163\\.com/#/album\\?id=(?'playlist_id'\\d+)!",
			"!music\\.163\\.com/#/playlist\\?id=(?'playlist_id'\\d+)!"
		],
		'choose'  => [
			'when' => [
				'test' => '@song_id',
				'iframe'  => [
					'width'  => 330,
					'height' => 86,
					'src'    => 'http://music.163.com/outchain/player?type=2&id={@song_id}&auto=0&height=66'
				]
			],
			'otherwise' => [
				'iframe'  => [
					'width'  => 330,
					'height' => 450,
					'src'    => 'http://music.163.com/outchain/player?type=1&id={@playlist_id}&auto=0&height=430'
				]
			]
		]
	]
            );
            $event->configurator->MediaEmbed->add(
                'youku1',
                [
                    'host'    => 'v.youku.com',
                    'extract' => "!v\\.youku\\.com/v_show/\\id_(?'id'[-0-9A-Z_a-z]+)!",
                    'iframe'  => [
                        'width'  => 720,
                        'height' => 405,
                        'src'    => 'https://players.youku.com/embed/{@id}'
                    ]
                ]
            );
            $event->configurator->MediaEmbed->add(
                'bilibili',
                [   
                    'host'    => 'www.bilibili.com',
                    'extract' => [
                    	"!www.bilibili.com/video/av(?'id'\\d+)/!",
                    	"!www.bilibili.com/mobile/video/av(?'id'\\d+)\\.html!"
                    ],
                    'flash'  => [
                        'width'  => 760,
                        'height' => 450,
                        'src'    => '//static.hdslb.com/miniloader.swf?aid={@id}'
                    ]
                ]
            );
             $event->configurator->MediaEmbed->add(
                'qq',
                [
                    'host'    => 'qq.com',
                    'extract' => [
                       "!qq\\.com/x/cover/\\w+/(?'id'\\w+)\\.html!",
                       "!qq\\.com/x/cover/\\w+\\.html\\?vid=(?'id'\\w+)!",
                       "!qq\\.com/cover/[^/]+/\\w+/(?'id'\\w+)\\.html!",
                       "!qq\\.com/cover/[^/]+/\\w+\\.html\\?vid=(?'id'\\w+)!",
                       "!qq\\.com/x/page/(?'id'\\w+)\\.html!",
                       "!qq\\.com/page/[^/]+/[^/]+/[^/]+/(?'id'\\w+)\\.html!"
                    ],
                    'iframe'  => [
                        'width'  => 760,
                        'height' => 450,
                        'src'    => '//v.qq.com/iframe/player.html?vid={@id}&tiny=0&auto=0'
                    ]
                ]
            );
            (new MediaPack)->configure($event->configurator);
		}
	);
};
return __NAMESPACE__ . '\\subscribe';
