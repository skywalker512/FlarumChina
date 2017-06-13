# Upload by ![flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=15) [flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/flagrow/upload/license.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/upload.svg)](https://github.com/flagrow/upload) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/upload.svg)](https://github.com/flagrow/upload) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/luceos)

An extension that handles file uploads intelligently for your forum.

### features

- For images:
  - Auto watermarks.
  - Auto resizing.
- Mime type to upload adapter mapping.
- Whitelisting mime types.
- Uploading on different storage services (local, imgur, AWS S3 for instance).
- Drag and drop uploads.
- Uploading multiple files at once (button and drag and drop both support this).
- Easily extendable, the extension heavily relies on Events.

For a complete overview of our releases, please visit the [milestones tracker](https://github.com/flagrow/upload/milestones) on Github.

### installation

```bash
composer require flagrow/upload
```

### updating

```bash
composer update flagrow/upload
php flarum cache:clear
```

### configuration

Enable the extension, a new tab will appear on the left hand side. This separate settings page allows you to further configure the extension.

Make sure you configure the upload permission on the permissions page as well.

#### Mimetype regular expression

Regular expressions allow you a lot of freedom, but they are also very difficult to understand. Here are some pointers, but feel free to ask
for help on the official Flarum forums.

In case you want to allow all regular file types including video, music, compressed files and images, use this:

```text
(video\/(3gpp|mp4|mpeg|quicktime|webm))|(audio\/(aiff|midi|mpeg|mp4))|(image\/(gif|jpeg|png))|(application\/(x-(7z|rar)-compressed|zip|arj|x-(bzip2|gzip|lha|stuffit|tar)|pdf))
```

A mimetype consists of a primary and secondary type. The primary type can be `image`, `video` and `application` for instance. The secondary
is like a more detailed specification, eg `png`, `pdf` etc. These two are divided by a `/`, in regex you have to escape this character by using: `\/`.


### donate

If you're happy with this extension, feel free to [buy me a cup of :coffee: and a :cake:](https://paypal.me/luceos/5) to keep me going.

---

### changelog

Please visit the [thread](https://discuss.flarum.org/d/4154-flagrow-file-upload-the-intelligent-file-attachment-extension).

Check [future milestones](https://github.com/flagrow/upload/milestones).

### links

- [on github](https://github.com/flagrow/upload)
- [on packagist](http://packagist.com/packages/flagrow/upload)
- [issues](https://github.com/flagrow/upload/issues)
- [flagrow group information](http://flagrow.github.io/)

> Flagrow is a collaboration of Flarum extension developers to provide quality, maintained extensions.

## FAQ

-  __AWS S3__: read the [AWS S3 configuration page](https://github.com/flagrow/upload/wiki/AWS-S3).
