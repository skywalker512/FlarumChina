# Users-list by Avatar4eg

A [Flarum](http://flarum.org) extension that adds users list to admin panel.

### Screenshots

Users list page:  
![Imgur](https://i.imgur.com/JSlVsEn.png)  
Mail modal:  
![Imgur](https://i.imgur.com/PIHr4mT.png)  

### Goals

- Allow admin to view list of users registered users.
- Allow admin to send emails to user or all users.

### Installation

```bash
composer require avatar4eg/flarum-ext-users-list
```

### Configuration

No configuration needed.

### Issues

- For now (while flarum/core[#987](https://github.com/flarum/core/issues/978)) sending mail for all users may have errors due php max_execution_time limit.

## End-user usage

On admin panel click Users button to view users. For each user there are buttons (mail and view user) and short info (last seen and post/discussion counter).

### Links

- [on github](https://github.com/avatar4eg/flarum-ext-users-list)
- [on packagist](https://packagist.com/packages/avatar4eg/flarum-ext-users-list)
- [issues](https://github.com/avatar4eg/flarum-ext-users-list/issues)
