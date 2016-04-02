# image-upload by ![flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=15) [flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group)

[![Latest Stable Version](https://poser.pugx.org/flagrow/flarum-ext-image-upload/v/stable)](https://packagist.org/packages/flagrow/flarum-ext-image-upload) [![Gitter](https://badges.gitter.im/flagrow/flarum-ext-image-upload.svg)](https://gitter.im/flagrow/chat) [![Total Downloads](https://poser.pugx.org/flagrow/flarum-ext-image-upload/downloads)](https://packagist.org/packages/flagrow/flarum-ext-image-upload)

A [Flarum](http://flarum.org) extension that adds an image upload button on discussion and comment creation, uploads the image(s) to the configured upload connection and then adds a markdown link to the uploaded image.

### Screenshots

![Imgur](http://i.imgur.com/YOdQaJO.png) ![Imgur](http://i.imgur.com/NN5GE7s.png)

### goals

- Allow uploading and attachment of images.
- Support any needed upload service.

For a complete overview of our releases, please visit the [milestones tracker](https://github.com/flagrow/flarum-ext-image-upload/milestones) on Github.

### installation

```bash
composer require flagrow/flarum-ext-image-upload
```

### configuration

- Visit the permission tab to select what user group can upload images in posts.
- Visit the settings tab of the extension in your admin to configure your image upload services.


## Upload services

The following upload services are supported:

- Locally in `assets/images` (default).
- Imgur anonymously (requires Client Id by signing up).
- Cloudinary.com (install with composer to use: `composer require cloudinary/cloudinary_php`).

## End-user usage

During post creation, click the Attach button to select a file. 
Once you've chosen an image, upload will immediately start and based on the image size and your connection will take some time to complete. 
The link to the image will then be added as markdown into the post composer.

### links

- [on github](https://github.com/flagrow/flarum-ext-image-upload)
- [on packagist](http://packagist.com/packages/flagrow/flarum-ext-image-upload)
- [issues](https://github.com/flagrow/flarum-ext-image-upload/issues)
- [changelog](https://github.com/flagrow/flarum-ext-image-upload/changelog.md)
- [flagrow extensions](https://github.com/flagrow?utf8=%E2%9C%93&query=flarum-ext-)
- [flagrow group information](http://flagrow.github.io/)

> Flagrow is a collaboration of Flarum extension developers to provide quality, maintained extensions.
