#!/usr/bin/env node

const path = require('path').dirname(require.main.filename);

require('dotenv').config({ path: `${path}/.env` });
const { Command } = require('commander');

const redditSavedSync = new Command();

const { syncSavedRedditPosts } = require('./src/post-handler');
const { setLoggingMode } = require('./src/logger');

exports.reddit = syncSavedRedditPosts;

redditSavedSync
  .version('1.0.0')
  .description('CLI to sync reddit saved posts locally')
  .usage('[options]')
  .option('-t, --type <type>', 'Only process this type of `post_hint` posts (example: `image`, `rich:video` ...)')
  .option('-a, --amount <number>', 'Stop after processing this amount of posts')
  .option(
    '-o, --output <path>',
    'Folder to download files to. Default overwritten with env var OUT_PATH',
    process.env.OUT_PATH || `${path}/out`,
  )
  .option('-d, --dryrun', 'Don\'t download any files')
  .option('-n, --onlynumber', 'Output number of unsynced posts')
  .option('-f, --force', 'Force fetch of new posts (Ignore cache)')
  .option('-q, --quiet', 'Quiet logging.')
  .parse(process.argv);

const options = redditSavedSync.opts();

setLoggingMode(options.quiet);

syncSavedRedditPosts(
  options.type,
  options.amount,
  options.dryrun,
  options.onlynumber,
  options.force,
  options.output,
);
