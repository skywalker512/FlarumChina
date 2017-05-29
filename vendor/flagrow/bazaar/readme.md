# Bazaar by ![flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=15) [flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group), a project of [Gravure](https://gravure.io/).

[![CC-BY-NC-SA 4.0 license](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://github.com/flagrow/bazaar/blob/master/license.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/bazaar.svg)](https://github.com/flagrow/bazaar) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/bazaar.svg)](https://github.com/flagrow/bazaar)

The marketplace extension that allows you to add and remove extensions without composer or a terminal.

> Read the disclaimers!

![Bazaar in Action](https://discuss.hyn.me/assets/bazaar.gif)

### DISCLAIMERS

- Bazaar runs migrations down, meaning it will drop tables of extensions when you uninstall them.
- Bazaar cannot remove assets right now of extensions that are uninstalled.
- Bazaar attempts to increase its allowance of memory to 1GB, this might not work on your hosting environment.
- Bazaar reads the API on flagrow.io for compatible extensions. By installing and enabling this extension you agree to share some data so that the extension can do its work (Flarum version and URL).
- Bazaar is available under the [CC-BY-NC-SA 4.0 license](https://github.com/flagrow/bazaar/blob/master/license.md). In case you're interested in adapting the extension or using its code take the time to read and understand this license.

### GOALS

- Give admins easier control of installed and enabled extensions.
- Create a community driven, triaged list of quality extensions.
- Allow admins to connect to their Flagrow.io account and gain access to a dashboard showing the status of all forums.
- Support paid extensions for Flagrow and other extension developers.

For a complete overview of our changes, please visit the [changelog](https://github.com/flagrow/bazaar/blob/master/changelog.md) on Github.

### INSTALLATION

```bash
composer require flagrow/bazaar
```

Make sure that the following directories and files are writable by the web/php user:

- `composer.json`
- `composer.lock`
- `vendor/`

### UPDATING

```bash
composer update flagrow/bazaar
php flarum migrate
php flarum cache:clear
```

### CONFIGURATION

Enable the extension under the extensions tab in the admin area. A settings modal will popup asking you for a token, which most likely will already be there. You're good to go, open the Bazaar tab on the left and enjoy!

### SUPPORT OUR WORK

We prefer to keep our work available to everyone. In order to do so we rely on voluntary contributions on [patreon.com/flagrow](https://patreon.com/flagrow).

### FAQ

- Where do I get a token or the token field is empty?

> Please get in touch with us on our [issue tracker](https://github.com/flagrow/bazaar/issues).
