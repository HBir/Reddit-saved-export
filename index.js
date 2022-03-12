const Snoowrap = require('snoowrap');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');

require('dotenv').config();

const filesDone = require('./files_done.json') || {};
const filesFailed = require('./files_failed.json') || {};

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

const linuxSafeString = (string) => string.replaceAll(/[^a-zA-Z_0-9åäö\\-]/ig, '_');

const getFileExtension = (string) => {
  // eslint-disable-next-line prefer-regex-literals
  const regexp = new RegExp('\\/[^\\/]*\\.([^\\.\\/]*)$');
  return (string.match(regexp) || [])[1] || '';
};

const markAsComplete = (url, filename) => {
  filesDone[url] = filename;
  fs.writeFileSync('files_done.json', JSON.stringify(filesDone));
};

const formatPostData = (post) => {
  const fileExtension = getFileExtension(post.url);

  const filename = `${linuxSafeString(post.author.name)}_[`
    + `${post.subreddit.display_name}]_`
    + `${linuxSafeString(post.title)}`
    + `.${fileExtension}`;

  return {
    url: post.url,
    post_hint: linuxSafeString(post.post_hint),
    filename,
  };
};

const downloadFile = async (url, folder, filename) => youtubedl(url, {
  output: `out/${folder}/${filename}`,
}).then((output) => {
  console.log(output);
  markAsComplete(url, filename);
})
  .catch(() => {
    filesFailed[url] = filename;
    fs.writeFileSync('files_failed.json', JSON.stringify(filesFailed));
  });

const handlePost = async (post) => {
  if (filesDone[post.url]) {
    console.log(`File already downloaded, skipping: ${post.url}`);
    return '';
  }

  const postData = formatPostData(post);

  await downloadFile(postData.url, postData.post_hint, postData.filename);

  return postData;
};

const main = async () => {
  const res = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true })
    .filter((post) => !post.is_self)
    .filter((post) => post.post_hint === 'image')
    .map((post) => handlePost(post))
    .filter((result) => result);

  console.log(res);
  console.log(res.length);
};

main();
