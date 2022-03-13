const fs = require('fs');
const Snoowrap = require('snoowrap');

const cache = require('../resources/cache.json') || {};
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

const getAllSavedPostWithCache = async () => {
  const oneHour = 3600000;
  const tsAge = Date.now() - cache.timestamp;
  if (cache.content && tsAge < oneHour) {
    console.log(`Using cache from ${humanReadableMs(tsAge)} ago. (${cache.content.length} posts)`);
    return cache.content;
  }

  console.log('Fetching content from Reddit...');
  const freshData = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true });

  console.log(`Recieved ${freshData.length} posts`);
  fs.writeFileSync('cache.json', JSON.stringify({ content: freshData, timestamp: Date.now() }));
  return freshData;
};

module.exports = {
  getAllSavedPostWithCache,
};
