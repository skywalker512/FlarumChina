# Flarum User Management by ReFlar

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://gitlab.com/ReFlar/user-management/blob/master/LICENSE) [![Latest Stable Version](https://img.shields.io/packagist/v/reflar/user-management.svg)](https://gitlab.com/ReFlar/user-management)

A [Flarum](http://flarum.org) extension that allows your to manage every aspect of your users, with style!

This extension allows you to give users strikes for posts if they violate rules. Those strikes are kept and can be viewed at anytime by anyone with permission. This extension also allows your to disable the email registration option, as well as adds age and gender at registration. The user's age and gender is shown on their profile page. You can also manually activate users from the admin interface, or from the users page.

![gif](http://i.imgur.com/pkMM6aA.gif)


![gif](http://i.imgur.com/dfHaFwL.gif)

### Goals

- To make registration more customizable
- To log user incidents

### Usage

- Moderators can asign strikes to posts
- Strikes can be tracked from admin page or directly from user page
- Remove email registration
- Added age and gender

### Installation

Install it with composer:

```bash
composer require reflar/user-management
```

Then login and enable the extension.

### Developer Guide

You have 2 events to listen for "UserWillBeGivenStrike" as well as "UserWasGivenStike" which both contain the offending post, the user being struck, the strike issuer, and the reason.

You also have the api/strike post route to give a user a strike, /API strike/{userId} get route to get a user's strikes, and /api/strike/{id} delete route to delete the strike.

You can also post to /api/reflar/usermanagement/attributes to set a user's gender and age.

### To Do

- Requests?

### Issues

- None known


### Links

- [on github](https://gitlab.com/ReFlar/user-management)
- [on packagist](https://packagist.org/packages/ReFlar/user-management)
- [issues](https://gitlab.com/ReFlar/user-management/issues)
