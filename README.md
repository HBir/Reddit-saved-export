# Reddit saved sync

Downloads the media of your saved reddit posts locally.

Stores in `resources/files_done.json` and `resources/files_failed.json` the status of already downloaded posts.

Will not download already attempted posts again, modify these files to retry.

## Dependency

Requires `gallery-dl` to be installed and in PATH

Install instructions here: https://github.com/mikf/gallery-dl

## Setup

Run `npm install -g .` to set up the necessary files

Create a reddit application (https://www.reddit.com/prefs/apps/) and fill in `.env` with the following information.
```
userAgent=
clientId=
clientSecret=
username=
password=

REDDIT_CACHE_TTL=
OUT_PATH=
```

## Usage
```
Usage: reddit [options]

CLI to sync reddit saved posts locally

Options:
  -V, --version          output the version number
  -t, --type <type>      Only process this type of `post_hint` posts (example: `image`, `rich:video` ...)
  -a, --amount <number>  Stop after processing this amount of posts
  -o, --output <path>    Folder to download files to. Default overwritten with env var OUT_PATH (default: "./out")
  -d, --dryrun           Don't download any files
  -n, --onlynumber       Output number of unsynced posts
  -q, --quiet            Quiet logging.
  -h, --help             display help for command
```