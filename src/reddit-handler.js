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

const humanReadableMs = (ms) => {
  const seconds=Math.floor((ms/1000)%60)
  const minutes=Math.floor((ms/(1000*60))%60)
  const hours=Math.floor((ms/(1000*60*60))%24)

  return (hours ? `${hours} hours ` : '') + (minutes ? `${minutes} minutes ` : '') + (seconds ? `${seconds} seconds ` : '')
}

const getAllSavedPostWithCache = async () => {
  if (cache.content) {
    console.log(`Using cache from ${humanReadableMs(Date.now() - cache.timestamp)} ago. (${cache.content.length} posts)`);
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