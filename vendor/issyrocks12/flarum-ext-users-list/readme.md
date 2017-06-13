# Users-list by Avatar4eg updated by issyrocks12

A [Flarum](http://flarum.org) extension that adds users list to admin panel. Emails have full html support

### Screenshots

Users list page:  
![Imgur](https://i.imgur.com/JSlVsEn.png)  
Mail modal:  
![Imgur](https://i.imgur.com/PIHr4mT.png)  

### Goals

- Allow admin to view list of users registered users.
- Allow admin to send emails to user or all users.

### variables

- Typing "!!user!!" into the message box will replace it with the user it is being sent to, works will mail to all.

### Installation

```bash
composer require issyrocks12/flarum-ext-users-list
```

### Configuration

No configuration needed.

### Issues

- For now (while flarum/core[#987](https://github.com/flarum/core/issues/978)) sending mail for all users may have errors due php max_execution_time limit.

## End-user usage

On admin panel click Users button to view users. For each user there are buttons (mail and view user) and short info (last seen and post/discussion counter).

### Links

- [on github](https://github.com/issyrocks12/flarum-ext-users-list)
- [on packagist](https://packagist.org/packages/issyrocks12/flarum-ext-users-list)
- [issues](https://github.com/issyrocks12/flarum-ext-users-list/issues)
