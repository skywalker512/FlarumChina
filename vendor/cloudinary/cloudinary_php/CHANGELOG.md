
1.8.0 / 2017-05-03
==================

New functionality and features
------------------------------

  * Advanced search API
  * Add `async` parameter to upload parameters.

Other Changes
-------------

  * Update tests to use `TestHelper`
  * Add compatibility for newer PHPUnit versions

1.7.2 / 2017-04-03
==================

  * Add update ocr parameters test
  * Merge pull request #71 from jtabet/fix-floats-issue
    * Added a number_format on float values in the transformation string
  * Add ocr parameters tests
  * Fix variables order. Add variables order tests.

1.7.1 / 2017-03-13
==================

  * Update phpunit to 5.7.*
  * Update travis.yml to test 5.6 and 7.0 (matching phpunit)
  * Don't normalize negative numbers. Fixed #68.

1.7.0 / 2017-03-09
==================

New functionality and features
------------------------------

  * User defined variables
  * Add `async` parameter to upload params (#65)
  * Add `fetch` prefix to overlay path
  * Support fetch overlay underlay

Other Changes
-------------

  * Rename items and add missing variables.

1.6.2 / 2017-02-23
==================

  * Add URL authentication.
  * Rename `auth_token`. 
  * Support nested values in `CLOUDINARY_URL`
  * Fix archive test.
  * Add a test for `build_eager`.

1.6.1 / 2017-02-16
==================

  * Allow 'invalidate' param in 'delete_transformation'
  * Upgrade Travis test from 7.0 to 7.1
  * Merge pull request #61 from dragosprotung/patch-1
  * Merge pull request #63 from cloudinary/support-invalidate-in-delete-transformation
  * Deleted stub file

1.6.0 / 2017-01-30
==================

New functionality and features
------------------------------

  * Add Akamai token generator

Other Changes
-------------

  * Revert using VERSION to set USER_AGENT. Fixes #58.
  * Fix USER_AGENT version.

1.5.0 / 2017-01-19
==================

New functionality and features
------------------------------

  * New `add_context` & `remove_all_context` API
  * support suffix url for private images
  * Escape ‘|' and ‘=‘ characters in context values
  * Support ‘iw’ and ‘ih’ transformation parameters for indicating initial width or height
  * Support `to_type` parameter in `rename`

Other Changes
-------------

  * Fix folder listing test
  * Add test for {effect: art:incognito}
  * expending retrieved list of transformation to allow test to pass properly
  * Add test case for 'to_type' + fix face_coordintes exceeding image boundaries
  * Fix typo in the archive `expires_at` parameter
  * Remove `$name` from call to `list_streaming_profiles`

1.4.2 / 2016-10-28
==================

New functionality and features
------------------------------

  * Add streaming profiles API
  * Merge pull request #40 from sergey-safonov/feature/config-connection-timeout
    * Allow specify connection timeout in config

1.4.1 / 2016-08-14
==================

New functionality and features
------------------------------

  * Add `allow_missing` parameter to the archive api
  * Add `skip_transformation_name` parameter to `create_archive`.
  * Add `expire_at` parameter to `create_archive`.
  * Add `transformation` parameter to `delete_resources`.
  * Add original height and width test.
  * Allow `cloud_name` to be specified in options array
  * Add TravisCI configuration
  * Add badges to README.md
  * Add license file
  * Update sample project: use cdnjs instead of locally stored JS files and bootstrap with `cloudinary_fileupload()`.

Other Changes
-------------

  * Merge pull request #38 from RobinMalfait/patch-1
  * Merge pull request #37 from Welkio/master
  * Merge pull request #41 from DacotahHarvey
  * Fix Zip tests.
  * Add default message to assertPost, assertGet, assertPut, assertDelete. Add optional message to assertUrl.
  * Add assert helper methods.
  * Add test for `gravity: auto` parameter.
  * Use eager transformation in timeout test.
  * Remove `overwrite` test.
  * Mock `eager` test.
  * Use random number for test tag.
  * Add `url_prefix` to the tests.
  * Mock restore tests.
  * Mock upload_presets tests.
  * Mock start_at test
  * Separare `mock` to `apiMock` and `uploadMock`. Use random public_ids in API tests.
  * Update README.md

1.4.0 / 2016-06-22
==================

New functionality and features
------------------------------

  * New configuration parameter `:client_hints`
  * Enhanced auto `width` values
  * Enhanced `quality` values

Other Changes
-------------

  * Disable explicit test

1.3.2 / 2016-06-02
==================

  * Add `next_cursor` to `Api->transformation()`.
  * Remove empty parameters from `update()` calls
  * Add tests
  * Add TestHelper.php. Create new `Curl` class.
  * Use constants in tests
  * Use comma in delete resources test

1.3.1 / 2016-03-22
==================

New functionality and features
------------------------------

  * Conditional Transformations

Other Changes
-------------

  * Fix categorization test
  * Use original file name as `public_id` for server side upload (sample project).
  * Remove support for `exclusive` in `add_tag`
  * Pass parameters in body unless it's a `get` call
  * Support PHP versions before 5.4
  * Use `isset` instead of `!= NULL`

1.3.0 / 2016-01-28
==================

  * New ZIP generation API.
  * Support responsive_breakpoints upload/explicit parameter.
  * Support line_spacing text layer parameter.
  * Support array parameters in Uploader.
  * Fix layer processsing
  * Implement parametrized test for layers
  * Better escaping for , and / in text layer

1.2.0 / 2015-11-01
==================

  * Escape / in overlays
  * Support crc32 on 32-bit systems
  * Support upload_mappings API
  * Support Backup restoration API
  * Support easy overlay/underlay construction
  * Add script to update and commit new version
  * Add invalidate parameter to rename

1.1.4 / 2015-08-23
==================

  * Support passing array arguments in POST body for Uploader
  * Add test for #33 - huge id list in `add_tag` api.

1.1.3 / 2015-08-19
==================

  * Add aspect_ratio
  * Add `context` and `invalidate` to the explicit API parameters.
  * Fix timeout test and make test compatible with PHP 5.3
  * Replace CURLOPT_TIMEOUT_MS with CURLOPT_TIMEOUT as it is not supported before cURL 7.16.2.
  * Added comments specifying curl option version requirements.

1.1.2 / 2015-07-27
==================

  * Fix eager ignoring format

1.1.1 / 2015-06-2
===================


  * new format and method for USER_AGENT
  * support adding information to the USER_AGENT
  * solve bad URLs created with secure_cdn_subdomain. Resolves #28

1.1.0 / 2015-04-7
===================

  * support video tag generation and url helpers
  * support video transformation parameters: audio_codec, audio_frequency, bit_rate, video_sampling, duration, end_offset, start_offset, video_codec
  * support zoom transformation parameter
  * support ftp url
  * allow specifying request timeout
  * enable eager_async and eager_notification_url in explicit
  * change upload_large's endpoint to use upload with content_range header
  * support chunk_size in cl_upload_tag

1.0.17 / 2015-02-10
===================

  * Add a changelog
  * Add support for 'overwrite' option in upload
  * Allow root path for shared CDN

1.0.16 / 2014-12-22
===================

  * Support folder listing
  * Secure domain sharding
  * Don't sign version component
  * URL suffix and root path support
  * Support tags in upload large
  * Make call_api public

1.0.15 / 2014-11-2
===================

  * Support api_proxy parameter for setting up a proxy between the PHP client and Cloudinary
  * Fixed HHVM compatibility issue

1.0.14 / 2014-10-15
===================

  * Remove force SSLv3

1.0.13 / 2014-09-22
===================

  * Force SSLv3 when contacting the Cloudinary API
  * Support invalidation in bulk deletion req (if enabled in your account)

1.0.12 / 2014-08-24
===================

  * Support custom_coordinates is upload and update
  * Support coordinates in resource details
  * Support return_delete_token parameter in upload and cl_image_upload_tag
  * Correctly escape parentheses

1.0.11 / 2014-07-7
===================

  * Support for auto dpr, auto width and responsive width
  * Support for background_removal in upload and update

1.0.10 / 2014-04-29
===================

  * Remove closing PHP tags
  * Support upload_presets
  * Support unsigned uploads
  * Support start_at for resource listing
  * Support phash for upload and resource details
  * Better error message in case of file not found in uploader for PHP 5.5+

1.0.9 / 2014-02-26
===================

  * Admin API update method
  * Admin API listing by moderation kind and status
  * Support moderation status in admin API listing
  * Support moderation flag in upload
  * New Upload and update API parameters: moderation, ocr, raw_conversation, categorization, detection, similarity_search and auto_tagging
  * Support CLOUDINARY_URL ending with /
  * Support for uploading large raw files

1.0.8 / 2014-01-21
===================

  * Support overwrite upload parameter
  * Support specifying face coordinates in upload API
  * Support specifying context (currently alt and caption) in upload API and returning context in API
  * Support specifying allowed image formats in upload API
  * Support listing resources in admin API by multiple public IDs
  * Send User-Agent header with client library version in API request
  * Support for signed-URLs to override restricted dynamic URLs
  * Move helper methods and preloaded file to separate file and fix Composer autoload
  * Minor fixes
