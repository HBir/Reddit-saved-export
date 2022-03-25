const fs = require('fs').promises;
const Snoowrap = require('snoowrap');

const { humanReadableMs } = require('./common-helpers');

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
    console.log('[INFO] Cache file not found');
    return {};
  }
};

const getAllSavedPostWithCache = async () => {
  const cache = await getCache();

  const oneHour = 3600000;
  const tsAge = Date.now() - cache.timestamp || 0;
  if (cache.content && tsAge < oneHour) {
    console.log(`Using cache from ${humanReadableMs(tsAge)} ago. (${cache.content.length} posts)`);
    return cache.content;
  }

  console.log('Fetching content from Reddit...');
  const freshData = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true });

  console.log(`Recieved ${freshData.length} posts`);
  await fs.writeFile('resources/cache.json', JSON.stringify({ content: freshData, timestamp: Date.now() }, null, 2));
  return freshData;
};

module.exports = {
  getAllSavedPostWithCache,
};
