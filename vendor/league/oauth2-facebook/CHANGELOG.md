# CHANGELOG

## 1.1.0 - September 16, 2015

- Added `getCoverPhotoUrl()` method to `FacebookUser`.

## 1.0.0 - August 20, 2015

- Stable release! Boom!

## 1.0.0 Alpha 2 - August 10, 2015

- Renamed `asArray()` to  `toArray()` on `FacebookUser` to match the interface.

## 1.0.0 Alpha 1 - August 5, 2015

- Tagged an alpha release since we're closer to launch.

## 0.0.12 - July 28, 2015

- Added a method `asArray()` to `FacebookUser` to get all the data from the User node as a plain-old PHP array.

## 0.0.11 - July 14, 2015

- Renamed references from "user" to "resource owner" per [#376](https://github.com/thephpleague/oauth2-client/pull/376).

## 0.0.10 - July 8, 2015

- Fixes for most recent oAuth Client changes before stable release.

## 0.0.9 - June 30, 2015

- Additional fixes for oAuth Client v1.0 alpha 1

## 0.0.8 - June 16, 2015

- Fix for "funny" Facebook `content-type` responses.

## 0.0.7 - June 16, 2015

- Refactored to work with latest 1.0 branch of OAuth 2.0 Client package.
- Added support for exchanging short-lived access tokens with long-lived access tokens.

## 0.0.6 - May 14, 2015

- Refactored to work with latest 1.0 branch of OAuth 2.0 Client package.
- Added support for Facebook's [beta tier](https://developers.facebook.com/docs/apps/beta-tier).

## 0.0.5 - April 21, 2015

- Fixed Graph-specific error response handling.

## 0.0.4 - April 20, 2015

- Updated package to run on `egeloen/http-adapter` instead of Guzzle.

## 0.0.3 - April 20, 2015

- Added support to properly handle the new json response for access tokens starting in Graph `v2.3`.
- If the `graphApiVersion` option is not provided to the `Facebook` provider constructor an `\InvalidArgumentException` will be thrown.
- Removed the `Facebook::DEFAULT_GRAPH_VERSION` fallback value.
- Updated docs to reflect latest Graph version `v2.3`.

## 0.0.2 - February 4, 2015

- Added `branch-alias` to `composer.json`.

## 0.0.1 - February 4, 2015

- Updated `composer.json` to require OAuth 2.0 Client v1.0 with `@dev` flag.
- Updated tests to mock Guzzle v5.x.
- Added test to ensure an exception is thrown when trying to refresh an access token.

## 0.0.0 - February 4, 2015

- Initial release. Hello world!
