# Facebook Provider for OAuth 2.0 Client

[![Build Status](https://travis-ci.org/thephpleague/oauth2-facebook.png?branch=master)](https://travis-ci.org/thephpleague/oauth2-facebook)
[![Latest Stable Version](https://poser.pugx.org/league/oauth2-facebook/v/stable.png)](https://packagist.org/packages/league/oauth2-facebook)

This package provides Facebook OAuth 2.0 support for the PHP League's [OAuth 2.0 Client](https://github.com/thephpleague/oauth2-client).

This package is compliant with [PSR-1][], [PSR-2][], [PSR-4][], and [PSR-7][]. If you notice compliance oversights,
please send a patch via pull request.

[PSR-1]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md
[PSR-2]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md
[PSR-4]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md
[PSR-7]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-7-http-message.md


## Requirements

The following versions of PHP are supported.

* PHP 5.5
* PHP 5.6
* PHP 7.0
* HHVM

## Installation

Add the following to your `composer.json` file.

```json
{
    "require": {
        "league/oauth2-facebook": "~1.0"
    }
}
```

## Usage

### Authorization Code Flow

```php
session_start();

$provider = new League\OAuth2\Client\Provider\Facebook([
    'clientId'          => '{facebook-app-id}',
    'clientSecret'      => '{facebook-app-secret}',
    'redirectUri'       => 'https://example.com/callback-url',
    'graphApiVersion'   => 'v2.4',
]);

if (!isset($_GET['code'])) {

    // If we don't have an authorization code then get one
    $authUrl = $provider->getAuthorizationUrl([
        'scope' => ['email', '...', '...'],
    ]);
    $_SESSION['oauth2state'] = $provider->getState();
    
    echo '<a href="'.$authUrl.'">Log in with Facebook!</a>';
    exit;

// Check given state against previously stored one to mitigate CSRF attack
} elseif (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {

    unset($_SESSION['oauth2state']);
    echo 'Invalid state.';
    exit;

}

// Try to get an access token (using the authorization code grant)
$token = $provider->getAccessToken('authorization_code', [
    'code' => $_GET['code']
]);

// Optional: Now you have a token you can look up a users profile data
try {

    // We got an access token, let's now get the user's details
    $user = $provider->getResourceOwner($token);

    // Use these details to create a new profile
    printf('Hello %s!', $user->getFirstName());
    
    echo '<pre>';
    var_dump($user);
    # object(League\OAuth2\Client\Provider\FacebookUser)#10 (1) { ...
    echo '</pre>';

} catch (Exception $e) {

    // Failed to get user details
    exit('Oh dear...');
}

echo '<pre>';
// Use this to interact with an API on the users behalf
var_dump($token->getToken());
# string(217) "CAADAppfn3msBAI7tZBLWg...

// Number of seconds until the access token will expire, and need refreshing
var_dump($token->getExpires());
# int(1436825866)
echo '</pre>';
```

### The FacebookUser Entity

When using the `getResourceOwner()` method to obtain the user node, it will be returned as a `FacebookUser` entity.

```php
$user = $provider->getResourceOwner($token);

$id = $user->getId();
var_dump($id);
# string(1) "4"

$name = $user->getName();
var_dump($name);
# string(15) "Mark Zuckerberg"

$firstName = $user->getFirstName();
var_dump($firstName);
# string(4) "Mark"

$lastName = $user->getLastName();
var_dump($lastName);
# string(10) "Zuckerberg"

# Requires the "email" permission
$email = $user->getEmail();
var_dump($email);
# string(15) "thezuck@foo.com"

# Requires the "user_hometown" permission
$hometown = $user->getHometown();
var_dump($hometown);
# array(10) { ["id"]=> string(10) "12345567890" ...

# Requires the "user_about_me" permission
$bio = $user->getBio();
var_dump($bio);
# string(426) "All about me...

$pictureUrl = $user->getPictureUrl();
var_dump($pictureUrl);
# string(224) "https://fbcdn-profile-a.akamaihd.net/hprofile- ...

$coverPhotoUrl = $user->getCoverPhotoUrl();
var_dump($coverPhotoUrl);
# string(111) "https://fbcdn-profile-a.akamaihd.net/hphotos- ...

$gender = $user->getGender();
var_dump($gender);
# string(4) "male"

$locale = $user->getLocale();
var_dump($locale);
# string(5) "en_US"

$link = $user->getLink();
var_dump($link);
# string(62) "https://www.facebook.com/app_scoped_user_id/1234567890/"
```

You can also get all the data from the User node as a plain-old PHP array with `toArray()`.

```php
$userData = $user->toArray();
```

### Graph API Version

The `graphApiVersion` option is required. If it is not set, an `\InvalidArgumentException` will be thrown.

```php
$provider = new League\OAuth2\Client\Provider\Facebook([
    /* . . . */
    'graphApiVersion'   => 'v2.4',
]);
```

Each version of the Graph API has breaking changes from one version to the next. This package no longer supports a fallback to a default Graph version since your app might break when the fallback Graph version is updated.

See the [Graph API version schedule](https://developers.facebook.com/docs/apps/changelog) for more info.

### Beta Tier

Facebook has a [beta tier](https://developers.facebook.com/docs/apps/beta-tier) that contains the latest deployments before they are rolled out to production. To enable the beta tier, set the `enableBetaTier` option to `true`.

```php
$provider = new League\OAuth2\Client\Provider\Facebook([
    /* . . . */
    'enableBetaTier'   => true,
]);
```

### Refreshing a Token

Facebook does not support refreshing tokens. In order to get a new "refreshed" token, you must send the user through the login-with-Facebook process again.

From the [Facebook documentation](https://developers.facebook.com/docs/facebook-login/access-tokens#extending):

> Once [the access tokens] expire, your app must send the user through the login flow again to generate a new short-lived token.

The following code will throw a `League\OAuth2\Client\Provider\Exception\FacebookProviderException`.

```php
$grant = new \League\OAuth2\Client\Grant\RefreshToken();
$token = $provider->getAccessToken($grant, ['refresh_token' => $refreshToken]);
```

### Long-lived Access Tokens

Facebook will allow you to extend the lifetime of an access token by [exchanging a short-lives access token with a long-lived access token](https://developers.facebook.com/docs/facebook-login/access-tokens#extending).

Once you obtain a short-lived (default) access token, you can exchange it for a long-lived one.

```php
try {
    $token = $provider->getLongLivedAccessToken('short-lived-access-token');
} catch (Exception $e) {
    echo 'Failed to exchange the token: '.$e->getMessage();
    exit();
}

var_dump($token->getToken());
# string(217) "CAADAppfn3msBAI7tZBLWg...
```

## Testing

``` bash
$ ./vendor/bin/phpunit
```

## Contributing

Please see [CONTRIBUTING](https://github.com/thephpleague/oauth2-facebook/blob/master/CONTRIBUTING.md) for details.


## Credits

- [Sammy Kaye Powers](https://github.com/SammyK)
- [All Contributors](https://github.com/thephpleague/oauth2-facebook/contributors)


## License

The MIT License (MIT). Please see [License File](https://github.com/thephpleague/oauth2-facebook/blob/master/LICENSE) for more information.
