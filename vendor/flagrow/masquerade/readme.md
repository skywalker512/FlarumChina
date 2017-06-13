# Masquerade by ![flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=15) [flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group)

[![Support on patreon](https://img.shields.io/badge/support%20on-patreon-orange.svg)](https://patreon.com/flagrow) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/flagrow/masquerade/license.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/masquerade.svg)](https://github.com/flagrow/masquerade) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/masquerade.svg)](https://github.com/flagrow/masquerade)

The user profile generator. Includes:

- New tab on user profile to show masquerade profile with answers provided to configured fields.
- New tab on user profile for user to set up a masquerade profile.
- Add, update, delete and order profile fields in admin.
- Permission who can have a masquerade profile.
- Permission who can view a masquerade profile.
- Allowing you to configure forced redirection to make a (email verified) user complete the required fields.

![](https://discuss.hyn.me/assets/files/2017-05-16/1494967396-0-masquerade-demo.gif)

### installation

```bash
composer require flagrow/masquerade
```

### updating

```bash
composer update flagrow/masquerade
php flarum migrate
php flarum cache:clear
```

### configuration

Enable the extension. Visit the masquerade tab in the admin to configure the fields. 

Be aware that the "Add new field" and "Edit field <foo>" toggle the field form when clicked.

Make sure you configure the masquerade permissions on the Admin Permissions tab to your needs.

### links

- [changelog](https://github.com/flagrow/masquerade/blob/master/changelog.md)
- [on github](https://github.com/flagrow/masquerade)
- [on packagist](http://packagist.com/packages/flagrow/masquerade)
- [issues](https://github.com/flagrow/masquerade/issues)


An extension by [Flagrow](https://flagrow.io), a project of [Gravure](https://gravure.io).
