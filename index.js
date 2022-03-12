require('dotenv').config();

const {
  linuxSafeString,
  getFileExtension,
  formatPostData,
} = require('./src/helpers');
const { isAlreadyProcessed, printAmountSkipped } = require('./src/statusManager')
const { youtubeDlDownload, galleryDlDownloader } = require('./src/downloaders')
const { getAllSavedPostWithCache } = require('./src/reddit-handler')

const handlePost = async (post) => {
  const { url, post_hint, filename, extension } = formatPostData(post);
  await galleryDlDownloader(url, post_hint, filename, extension);
};

const exportSavedRedditPosts = async (type, amount) => {
  const res = await getAllSavedPostWithCache()

  const filtered = res.filter((post) => !post.is_self)
    // .filter((post) => post.post_hint === type)
    .filter((post) => !isAlreadyProcessed(post.url))
    // .slice(0, amount);

  printAmountSkipped()


  console.log(`Processing ${filtered.length} posts`);
  for (const [i, post] of filtered.entries()) {
    console.log(`${i+1}/${filtered.length}`);
    await handlePost(post);
  }
  console.log(`Handled ${filtered.length} posts`);
};

const TYPE = 'link'
const AMOUNT = 2;

exportSavedRedditPosts(TYPE, AMOUNT);