#!/usr/bin/env bash
GIT_ROOT=$(git rev-parse --show-toplevel)
CURRENT_DIR=$PWD
cd $GIT_ROOT
echo Updating version to $1
sed -E -i.bak "s/\"version\": \"[0-9]\.[0-9]\.[0-9]+\"/\"version\": \"$1\"/" composer.json
grep -HEo "\"version\": \"[0-9]\.[0-9]\.[0-9]+\"" composer.json
sed -E -i.bak "s/const VERSION = \"[0-9]\.[0-9]\.[0-9]+\"/const VERSION = \"$1\"/" src/Cloudinary.php
sed -E -i.bak "s/const USER_AGENT = \"CloudinaryPHP\/[0-9]\.[0-9]\.[0-9]+\"/const USER_AGENT = \"CloudinaryPHP\/$1\"/" src/Cloudinary.php
grep -HEo "const VERSION = \"[0-9]\.[0-9]\.[0-9]+\"" src/Cloudinary.php
grep -HEo "const USER_AGENT = \"CloudinaryPHP\/[0-9]\.[0-9]\.[0-9]+\"" src/Cloudinary.php
git add composer.json src/Cloudinary.php CHANGELOG.md
git commit -m "Version $1"
git tag -a $1 -m "Version $1"
cd $CURRENT_DIR