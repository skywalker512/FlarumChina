# Flarum Composer Installer

[![Build Status](https://travis-ci.org/flarum/composer-installer.svg)](https://travis-ci.org/flarum/composer-installer)

A [Custom Installer](https://getcomposer.org/doc/articles/custom-installers.md) for Composer that places Flarum extensions in the `extensions` directory in the format of `{vendor}-{name}`. If present, a `flarum-` prefix will be removed from the extension name.

For example, if the extension package name is `tobscure/flarum-attachments`, then the extension will be installed to `extensions/tobscure-attachments`.

## Usage

This package is used in the [default Flarum application](https://github.com/flarum/flarum). As an extension developer, all you need to do is specify in your composer.json that your package is a Flarum extension:

```json
    "type": "flarum-extension",
```
