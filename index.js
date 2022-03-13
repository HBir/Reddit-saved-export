/* eslint-disable no-await-in-loop, no-restricted-syntax */
require('dotenv').config();

const { formatPostData } = require('./src/helpers');
const { isAlreadyProcessed, printAmountSkipped } = require('./src/statusManager');
const { galleryDlDownloader } = require('./src/downloaders');
const { getAllSavedPostWithCache } = require('./src/reddit-handler');

const handlePost = async (post) => {
  const {
    url, postHint, filename, extension,
  } = formatPostData(post);
  await galleryDlDownloader(url, postHint, filename, extension);
};

const exportSavedRedditPosts = async (type, amount) => {
  const res = await getAllSavedPostWithCache();

  const filtered = res.filter((post) => !post.is_self)
    // .filter((post) => post.post_hint === type)
    .filter((post) => !isAlreadyProcessed(post.url));
    // .slice(0, amount);

  printAmountSkipped();

  for (const [i, post] of filtered.entries()) {
    console.log(`${i + 1}/${filtered.length}`);
    await handlePost(post);
  }
};

// const TYPE = 'link';
// const AMOUNT = 2;

exportSavedRedditPosts(TYPE, AMOUNT);
