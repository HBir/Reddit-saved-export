# Reddit saved export

Downloads the media of your saved reddit posts locally.

Stores in `resources/files_done.json` and `resources/files_failed.json` the status of already downloaded posts.

Will not download already downloaded posts again, modify these files to retry.

## Dependency

Requires `gallery-dl` to be installed and in PATH

Install instructions here: https://github.com/mikf/gallery-dl

## Setup

Run `npm install` to set up the necessary files

Create a reddit application (https://www.reddit.com/prefs/apps/) and fill in `.env` with the following information.
```
userAgent=
clientId=
clientSecret=
username=
password=
```

## Usage

The following environent variables can be used on `npm start`:
* `AMOUNT` Stop after processing this amount of posts
* `TYPE` Only process this type of `post_hint` posts (example: `image`, `rich:video` ...)
* `DRYRUN` Don't download any files

Example: `AMOUNT=10 TYPE=image DRYRUN=true npm start`