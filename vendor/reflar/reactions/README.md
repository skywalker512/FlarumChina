# Reactions by ReFlar

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://gitlab.com/ReDevelopers/ReFlar/reactions/blob/master/LICENSE) [![Latest Stable Version](https://img.shields.io/packagist/v/reflar/reactions.svg)](https://gitlab.com/ReDevelopers/ReFlar/reactions) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A [Flarum](http://flarum.org) extension that adds reactions to your Flarum Community!

### Usage

- Just click the react button when hovering over a post, and choose the reaction!
- Custom reactions can be easily added via the admin page
- Integration with Likes and Gamification

### Installation

Install it with composer:

```bash
composer require reflar/reactions
```

Then login and enable the extension.

You can optionally convert specific reactions into likes, upvotes, and downvotes.

### Developer Guide

You have 2 events to listen for `PostWasReacted` as well as `PostWasUnreacted` which both contain the post and reactor. `PostWasReacted` also includes the reaction identifier.

### Issues

- [Open an issue on Gitlab](https://gitlab.com/ReDevelopers/ReFlar/reactions/issues)

### Links

- [GitLab](https://gitlab.com/ReDevelopers/ReFlar/reactions)
- [Packagist](https://packagist.org/packages/ReFlar/reactions)
