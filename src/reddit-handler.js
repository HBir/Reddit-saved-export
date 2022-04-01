const fs = require('fs').promises;
const Snoowrap = require('snoowrap');
const { dirname } = require('path');
const pruneKeys = require('./pruneKeys');

const projectPath = dirname(require.main.filename);

const { humanReadableMs } = require('./common-helpers');
const { log } = require('./logger');

const {
  userAgent, clientId, clientSecret, username, password,
} = process.env;

const r = new Snoowrap({
  userAgent,
  clientId,
  clientSecret,
  username,
  password,
});

const getCache = async () => {
  try {
    // eslint-disable-next-line import/no-unresolved
    return require('../resources/cache.json');
  } catch (err) {
    log('[INFO] Cache file not found');
    return {};
  }
};

const getAllSavedPostWithCache = async (force) => {
  const cache = await getCache();

  const cacheTtl = process.env.REDDIT_CACHE_TTL || 3600000;
  const tsAge = Date.now() - cache.timestamp || 0;
  if (!force && cache.content && tsAge < cacheTtl) {
    log(`Using cache from ${humanReadableMs(tsAge)} ago. (${cache.content.length} posts)`);
    return cache.content;
  }

  log('Fetching content from Reddit...');
  const freshData = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true });

  const prunedData = pruneKeys(freshData);

  log(`Recieved ${freshData.length} posts`);
  await fs.writeFile(`${projectPath}/resources/cache.json`, JSON.stringify({ timestamp: Date.now(), content: prunedData }, null, 2));
  return freshData;
};

module.exports = {
  getAllSavedPostWithCache,
};
