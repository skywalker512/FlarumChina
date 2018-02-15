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

You have 1 event to listen for `PostWasVoted` it contains the post, post's user, the actor, and the vote type (up or down).

### To Do

- Requests?

### Important

This Extension is meant as a replacement for the Flarum Likes Extension. Therefore, they are not compatible and it's recommended to disable the Likes Extension.

### Issues

- [Open an issue on Gitlab](https://gitlab.com/ReFlar/gamification/issues) 

### Links

- [on gitlab](https://gitlab.com/ReFlar/gamification)
- [on packagist](https://packagist.org/packages/ReFlar/gamification)
