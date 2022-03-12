const fs = require('fs');

const Snoowrap = require('snoowrap');

const cache = require('../resources/cache.json') || {};

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
  if (cache.content) {
    console.log(`Using cache from ${Date.now() - cache.timestamp} ago. (${cache.content.length} posts)`);
    return cache.content
  }

  console.log('Fetching content from Reddit...');
  const freshData = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true })

  console.log(`Recieved ${freshData.length} posts`);
  fs.writeFileSync('cache.json', JSON.stringify({content: freshData, timestamp: Date.now()}));
  return freshData;
}

module.exports = {
  getAllSavedPostWithCache,
}