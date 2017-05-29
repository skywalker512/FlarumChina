# Gamification by ReFlar

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://gitlab.com/ReFlar/gamification/blob/master/LICENSE) [![Latest Stable Version](https://img.shields.io/packagist/v/reflar/gamification.svg)](https://gitlab.com/ReFlar/gamification)

A [Flarum](http://flarum.org) extension that adds upvotes, downvotes, and ranks to your Flarum Community!

Upvote and downvote posts anonymously, and reward active users with ranks, and sort posts by hotness/popularity.

### Usage

- Just click upvote or downvote
- Posts can be sorted by "Hotness"

### Installation

Install it with composer:

```bash
composer require reflar/gamification
```

Then login and enable the extension.

You can optionally convert your likes into upvotes, as well as calculate the hotness of all previous discussions.

### How hotness is sorted? 

The total amount of hotness is got between the amount of votes on the discussion and the posts inside of it. Also, newer posts with the same amount of upvotes as another post will have more hotness, so time is also an influent factor.

### Developer Guide

You have 2 events to listen for "PostWasUpvoted" as well as "PostWasDownvoted" which both contain the post, post's user, and the upvoter/downvoter.

### To Do

- ~~Add ranking page~~ - Done
- ~~Add notifications~~ - Done
- ~~Add a Modal for non-logged users trying to upvote/downvote~~ - Done
- ~~Add a hover popup to the vote count number~~ - Done
- Allow Mods to change user rank
- ~~Add customization to the word "Points" on the profile page.~~ - Done
- ~~Add the ability to change the icons of upvotes/downvotes as well as the word "Points"~~ - Done
- ~~Fix buttoms background.~~ - Done
- Requests?

### Important

This Extension is meant as a replacement for the Flarum Likes Extension. Therefore, they are not compatible and it's recommended to disable the Likes Extension.

### Issues

- [Open an issue on Gitlab](https://gitlab.com/ReFlar/gamification/issues) 

### Links

- [on gitlab](https://gitlab.com/ReFlar/gamification)
- [on packagist](https://packagist.org/packages/ReFlar/gamification)
