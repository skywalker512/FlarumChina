# Byobu by ![Flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=20) [Flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group), a project of [Gravure](https://gravure.io/)

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/flagrow/byobu/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/byobu.svg)](https://packagist.org/packages/flagrow/byobu) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/byobu.svg)](https://packagist.org/packages/flagrow/byobu) [![Donate](https://img.shields.io/badge/patreon-support-yellow.svg)](https://www.patreon.com/flagrow) [![Join our Discord server](https://discordapp.com/api/guilds/240489109041315840/embed.png)](https://flagrow.io/join-discord)

Private discussions for your forum. Allows you to select specific recipients for your discussions.

![Preview](https://discuss.hyn.me/assets/files/2017-01-26/11:29:440-private-discussionsgif.gif)

## Goals

- Create discussions only specific users or groups can participate in.
- Force new posts in these private discussions to show real-time.

## Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

    composer require flagrow/byobu

## Updating

    composer update flagrow/byobu
    php flarum migrate
    php flarum cache:clear

## Configuration

Enable the extension under the extensions tab in the admin area.

Make sure you configure the private discussions permission on the Admin Permissions tab to your needs;

- Create private discussions
- Edit recipients of private discussions

## Support our work

We prefer to keep our work available to everyone.
In order to do so we rely on voluntary contributions on [Patreon](https://www.patreon.com/flagrow).

## Security

If you discover a security vulnerability within Byobu, please send an email to the Gravure team at security@gravure.io. All security vulnerabilities will be promptly addressed.

Please include as many details as possible. You can use `php flarum info` to get the PHP, Flarum and extension versions installed.

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/4762-flagrow-by-bu-well-integrated-advanced-private-discussions)
- [Source code on GitHub](https://github.com/flagrow/byobu)
- [Changelog](https://github.com/flagrow/byobu/blob/master/CHANGELOG.md)
- [Report an issue](https://github.com/flagrow/byobu/issues)
- [Download via Packagist](https://packagist.org/packages/flagrow/byobu)

An extension by [Flagrow](https://flagrow.io/), a project of [Gravure](https://gravure.io/).
