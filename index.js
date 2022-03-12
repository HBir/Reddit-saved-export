const Snoowrap = require('snoowrap');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');

require('dotenv').config();
const {
  userAgent, clientId, clientSecret, username, password,
} = process.env;

const cache = require('./cache.json') || {};

const {
  linuxSafeString,
  getFileExtension,
  formatPostData,
} = require('./helpers');

const {
  isAlreadyProcessed,
  printAmountSkipped
} = require('./statusManager')

const {
  youtubeDlDownload,
  galleryDlDownloader
} = require('./downloaders')

const r = new Snoowrap({
  userAgent,
  clientId,
  clientSecret,
  username,
  password,
});



const handlePost = async (post) => {
  const { url, post_hint, filename, extension } = formatPostData(post);
  await galleryDlDownloader(url, post_hint, filename, extension);
};

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

const exportSavedRedditPosts = async (type, amount) => {
  const res = await getAllSavedPostWithCache()

  const filtered = res.filter((post) => !post.is_self)
    .filter((post) => post.post_hint === type)
    .filter((post) => !isAlreadyProcessed(post.url))
    .slice(20, amount);

  printAmountSkipped()


  console.log(`Processing ${filtered.length} posts`);
  for (const post of filtered) {
    await handlePost(post);
  }
  console.log(`Handled ${filtered.length} posts`);
};

const type = 'image'
const amount = 1;

exportSavedRedditPosts(type, amount);
