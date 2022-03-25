#!/usr/bin/env node

require('dotenv').config();

const { syncSavedRedditPosts } = require('./src/post-handler');

// The following environment variables can be used on `npm start`:
// * `AMOUNT` Stop after processing this amount of posts
// * `TYPE` Only process this type of `post_hint` posts (example: `image`, `rich:video` ...)
// * `DRYRUN` Don't download any files
const { AMOUNT, TYPE, DRYRUN } = process.env;

const start = async () => syncSavedRedditPosts(TYPE, AMOUNT, DRYRUN);

// To be run from npm start
start();
