# flarum-ext-auth-wechat
This plugin is for Flarum using Wechat third-party login.

![image http://forum.sixbays.com/assets/images/2-NZcok3IOlGxzRCxM.png](http://forum.sixbays.com/assets/images/2-NZcok3IOlGxzRCxM.png)

![image http://forum.sixbays.com/assets/images/2-LdkX1knD3CjnM833.png](http://forum.sixbays.com/assets/images/2-LdkX1knD3CjnM833.png)

![image http://forum.sixbays.com/assets/images/2-HEaASxLbbmUSN8sK.png](http://forum.sixbays.com/assets/images/2-HEaASxLbbmUSN8sK.png)


# Setup
1. install extension:
>composer require stanleysong/flarum-ext-auth-wechat

update extension:
>composer update

2. config:
You need to have open platform app id and secrets of wechat (https://open.weixin.qq.com)
fill app id and secrets and callback url
callback url is your domian with "/auth/wechat"
eg.
www.yourdomain.com/auth/wechat

your authrizon callback domian in https://open.weixin.qq.com  can be www.yourdomain.com


3. fill wechat callback url, it will get back this url while login success

# Notice
As wechat has not provide email, here using a random string as email,
Also if your wechant nickname not using English, will replace to random string
you can change it in the pop window of first time login, otherwise after login
you can go to profile to change it or email.

# License
The MIT License (MIT)

Copyright (c) 2017 Stanley Song

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
