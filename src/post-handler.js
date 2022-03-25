const { formatPostData } = require('./common-helpers');
const { isAlreadyProcessed, logAmountSkipped } = require('./dl-status-cache');
const { downloadFile } = require('./downloaders');
const { getAllSavedPostWithCache } = require('./reddit-handler');

const handlePost = async (post, dryrun) => {
  const {
    url, postHint, filename,
  } = formatPostData(post);
  if (!dryrun) {
    await downloadFile(url, postHint, filename);
  } else {
    console.log('[DRYRUN]', url, postHint, filename);
  }
};

const filterByType = (filtertype, postHint) => {
  if (!filtertype) {
    return true;
  }
  return postHint === filtertype;
};

Array.prototype.limitPostAmount = function f(limitAmount) {
  return limitAmount ? this.slice(0, limitAmount) : this;
};

const exportSavedRedditPosts = async (filtertype, limitAmount, dryrun) => {
  const res = await getAllSavedPostWithCache();
  if (filtertype) {
    console.log(`[INFO] TYPE=${filtertype} - Only processing post_hint=${filtertype} posts`);
  }
  if (limitAmount) {
    console.log(`[INFO] AMOUNT=${limitAmount} - Stopping after ${limitAmount} posts processed`);
  }
  if (dryrun) {
    console.log(`[INFO] DRYRUN=${dryrun} - Runnign in dry run mode`);
  }

  const filtered = res.filter((post) => !post.is_self)
    // .filter((post) => filterByType(post.post_hint, filtertype))
    .filter((post) => !isAlreadyProcessed(post.url))
    .limitPostAmount(limitAmount);

  logAmountSkipped();

  for (const [i, post] of filtered.entries()) {
    console.log(`${i + 1}/${filtered.length}`);
    await handlePost(post, dryrun);
  }
};

module.exports = {
  exportSavedRedditPosts,
};
