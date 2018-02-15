# Upload by ![Flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=20) [Flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group), a project of [Gravure](https://gravure.io/)

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/flagrow/upload/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/upload.svg)](https://packagist.org/packages/flagrow/upload) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/upload.svg)](https://packagist.org/packages/flagrow/upload) [![Donate](https://img.shields.io/badge/patreon-support-yellow.svg)](https://www.patreon.com/flagrow) [![Join our Discord server](https://discordapp.com/api/guilds/240489109041315840/embed.png)](https://flagrow.io/join-discord)

An extension that handles file uploads intelligently for your forum.

## Features

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

## Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

```bash
composer require flagrow/upload
```

## Updating

```bash
composer update flagrow/upload
php flarum cache:clear
```

## Configuration

Enable the extension, a new tab will appear on the left hand side. This separate settings page allows you to further configure the extension.

Make sure you configure the upload permission on the permissions page as well.

### Mimetype regular expression

Regular expressions allow you a lot of freedom, but they are also very difficult to understand. Here are some pointers, but feel free to ask
for help on the official Flarum forums.

In case you want to allow all regular file types including video, music, compressed files and images, use this:

```text
(video\/(3gpp|mp4|mpeg|quicktime|webm))|(audio\/(aiff|midi|mpeg|mp4))|(image\/(gif|jpeg|png))|(application\/(x-(7z|rar)-compressed|zip|arj|x-(bzip2|gzip|lha|stuffit|tar)|pdf))
```

A mimetype consists of a primary and secondary type. The primary type can be `image`, `video` and `application` for instance. The secondary
is like a more detailed specification, eg `png`, `pdf` etc. These two are divided by a `/`, in regex you have to escape this character by using: `\/`.

## Changelog

Please visit the [thread](https://discuss.flarum.org/d/4154-flagrow-file-upload-the-intelligent-file-attachment-extension).

Check [future milestones](https://github.com/flagrow/upload/milestones).

## Support our work

We prefer to keep our work available to everyone.
In order to do so we rely on voluntary contributions on [Patreon](https://www.patreon.com/flagrow).

## Security

If you discover a security vulnerability within Upload, please send an email to the Gravure team at security@gravure.io. All security vulnerabilities will be promptly addressed.

Please include as many details as possible. You can use `php flarum info` to get the PHP, Flarum and extension versions installed.

## FAQ

-  __AWS S3__: read the [AWS S3 configuration page](https://github.com/flagrow/upload/wiki/AWS-S3).

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/4154-flagrow-upload-the-intelligent-file-attachment-extension)
- [Source code on GitHub](https://github.com/flagrow/upload)
- [Changelog](https://github.com/flagrow/upload/blob/master/CHANGELOG.md)
- [Report an issue](https://github.com/flagrow/upload/issues)
- [Download via Packagist](https://packagist.org/packages/flagrow/upload)

An extension by [Flagrow](https://flagrow.io/), a project of [Gravure](https://gravure.io/).
