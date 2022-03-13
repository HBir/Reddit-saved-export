require('dotenv').config();

const { exportSavedRedditPosts } = require('./src/post-handler');

const { AMOUNT, TYPE, DRYRUN } = process.env;

const start = async () => exportSavedRedditPosts(TYPE, AMOUNT, DRYRUN);

// To be run from npm start
start();
