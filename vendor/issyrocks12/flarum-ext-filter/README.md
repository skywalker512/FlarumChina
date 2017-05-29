# Filter

A [Flarum](http://flarum.org) extension that filters and flags posts by keywords

### Goals

- Make a moderator's job easier by filtering posts as they are posted

### Usage

- Input strings seperated by a comma and a space ", "

### Installation

```bash
composer require issyrocks12/flarum-ext-filter
```

### To Do

- Add regex support (in progress)
- Ability to change flagger name, and fix (to do)
- Add a notification to the user's notifications (to do)
- Requests?

### Issues

- Flagger_name doesn't work

## End-user usage

Input the strings, posts will be filtered as they are posted. They will be flagged and unapproved. An email will be send to the poster if the setting is on.

### Links

- [on github](https://github.com/issyrocks12/flarum-ext-filter)
- [on packagist](https://packagist.org/packages/issyrocks12/flarum-ext-filter)
- [issues](https://github.com/issyrocks12/flarum-ext-filter/issues)
