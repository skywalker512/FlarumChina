# 微信登录SDK

[![Latest Stable Version](https://poser.pugx.org/henter/wechat-oauth/v/stable.png)](https://packagist.org/packages/henter/wechat-oauth) [![Total Downloads](https://poser.pugx.org/henter/wechat-oauth/downloads.png)](https://packagist.org/packages/henter/wechat-oauth) [![Build Status](https://travis-ci.org/henter/WeChat-OAuth.png?branch=master)](https://travis-ci.org/henter/WeChat-OAuth) [![Coverage Status](https://coveralls.io/repos/henter/WeChat-OAuth/badge.png?branch=master)](https://coveralls.io/r/henter/WeChat-OAuth)

## Overview
微信OAuth登录SDK

## Installation
#### Composer (推荐)
把下面的配置加入你的`composer.json`文件
```json
"henter/wechat-oauth": "dev-master"
```
然后使用[Composer](https://getcomposer.org/)来安装SDK
```bash
composer install
```
如果[Packagist](https://packagist.org)故障或者不可用导致无法安装SDK的，可以使用[Satis](https://github.com/composer/satis "Satis - Package Repository Generator")或者Artifact来进行本地安装，详见Composer文档中的[Repositories](https://getcomposer.org/doc/05-repositories.md#hosting-your-own)

#### Manually
复制`lib/Henter/WeChat`到项目目录，然后`require "/path/to/sdk/OAuth.php"`

## Usage
#### Autoload
如果你用Composer来安装，可以用以下代码自动加载
```php
require 'vendor/autoload.php';
```
SDK位于全局命名空间下。
```php
use Henter\WeChat\OAuth
```

#### Initialization
实例化`OAuth`即可完成初始化
```php
$oauth = new \Henter\WeChat\OAuth($appid, $secret);
```
`$appid`和`$secret`是微信开放平台的应用的唯一标识和秘钥AppSecret

#### Code samples
##### 登录
```php
$oauth = new \Henter\WeChat\OAuth($appid, $secret);
$callback_url = 'http://your_site.com/your_callback_url';
$url = $oauth->getAuthorizeURL($callback_url);
```
重定向到`$url`，待用户允许授权后，将会重定向到`$callback_url`上，并且带上`code`和`state`参数（示例代码未传入`state`参数）

默认授权地址是跳转到微信扫描二维码页面（适用于PC端），如果用户在微信内访问网页点微信登陆，这种方式不太适合。
需要用下面的方法获取用于微信内的授权地址：

```php
$url = $oauth->getWeChatAuthorizeURL($callback_url);
```
注：这个在微信开放平台文档上没有（只在公众号平台文档有提到），不过测试发现同样适用于开放平台应用。


##### 通过`code`参数获取`access_token`
```php
//获取code参数
$code = $_GET['code'];

$oauth = new \Henter\WeChat\OAuth($appid, $secret);
if($access_token = $oauth->getAccessToken('code', $code)){
	$refresh_token = $oauth->getRefreshToken();
	$expires_in = $oauth->getExpiresIn();
	$openid = $oauth->getOpenid();
}else{
	echo $oauth->error();
}

```
如果获取成功，需保存这4个值用于后续接口调用，否则通过`$oauth->error()`获取错误信息


###### 通过`access_token`调用API

```php
$oauth = new \Henter\WeChat\OAuth($appid, $secret, $access_token);
```
或
```php
$oauth = new \Henter\WeChat\OAuth($appid, $secret);
$oauth->setAccessToken($access_token);
```

调用用户信息，需传入`openid`
```php
$userinfo = $oauth->api('sns/userinfo', array('openid'=>$openid));

```
其中`sns/userinfo`为api类型，具体请参考[微信API文档](https://open.weixin.qq.com/cgi-bin/frame?t=resource/res_main_tmpl&verify=1&lang=zh_CN&target=res/web_wx_powered_interface)


##### 通过`refresh_token`刷新或续期`access_token`
```php
$oauth = new \Henter\WeChat\OAuth($appid, $secret);

//以下两种方式一样
$access_token = $oauth->getAccessToken('token', $refresh_token);
或
$access_token = $oauth->refreshAccessToken($refresh_token);
```
此时可以通过`$oauth->getRefreshToken()`获取新的`refresh_token`

#### 其它
本SDK无任何抛异常部分，调用`$oauth->getAccessToken()`或`$oauth->api()`等方法时如果返回`false`则表示未成功，错误信息均通过`$oauth->error()`获取，所以无需使用`try {} catch {}`方式处理错误


## License
The MIT License (MIT)
Copyright (c) 2014 Henter &lt;henter@henter.me&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
