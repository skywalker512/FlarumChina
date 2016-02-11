# flarum-ext-auth-qq

flarum 的 QQ Oauth 2.0 认证插件

### 安装


修改 flarum 根目录的 composer.json 中的 require，增加依赖

```json
"lazyboywu/flarum-ext-auth-qq": "^0.1.0"
```

flarum 根目录通过 composer 进行插件安装

```bash
$ composer update lazyboywu/oauth2-qq
$ composer update lazyboywu/flarum-ext-auth-qq
```

> 如果觉得的 [packagist](http://packagist.org/) 太慢，可以使用 github 和国内的镜像 [phpcomposer](http://packagist.phpcomposer.com) 直接下载，composer.json 增加
> ```json
"repositories": [
    {
        "type": "vcs",
        "url": "https://github.com/lazyboywu/flarum-ext-auth-qq"
    },
    {
        "type": "vcs",
        "url": "https://github.com/lazyboywu/oauth2-qq"
    },
    {
        "type": "composer",
        "url": "http://packagist.phpcomposer.com"
    },
    {
        "packagist": false
    }
]
```

后台启用插件，设置appid和appkey

因为需要记录 QQ 的 OpenId，修改数据库的 user 表, 在 flarum 根目录中执行
```
$ ./flarum migrate
```
