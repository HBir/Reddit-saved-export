require('dotenv').config();

const { formatPostData } = require('./src/helpers');
const { isAlreadyProcessed, printAmountSkipped } = require('./src/statusManager');
const { galleryDlDownloader } = require('./src/downloaders');
const { getAllSavedPostWithCache } = require('./src/reddit-handler');

const { AMOUNT, TYPE, DRYRUN } = process.env;

const handlePost = async (post, dryrun) => {
  const {
    url, postHint, filename, extension,
  } = formatPostData(post);
  if (dryrun) {
    await galleryDlDownloader(url, postHint, filename, extension);
  } else {
    console.log('[DRYRUN]', url, postHint, filename, extension);
  }
};

const filterByType = (filtertype, postHint) => filtertype && postHint === filtertype;

Array.prototype.limitPostAmount = function f(limitAmount) {
  return limitAmount ? this.slice(0, limitAmount) : this;
};

const exportSavedRedditPosts = async (filtertype, limitAmount, dryrun) => {
  const res = await getAllSavedPostWithCache();

  const filtered = res.filter((post) => !post.is_self)
    .filter((post) => filterByType(post.post_hint, filtertype))
    .filter((post) => !isAlreadyProcessed(post.url))
    .limitPostAmount(limitAmount);

  printAmountSkipped();

  for (const [i, post] of filtered.entries()) {
    console.log(`${i + 1}/${filtered.length}`);
    await handlePost(post, dryrun);
  }
};

exportSavedRedditPosts(TYPE, AMOUNT, DRYRUN);
