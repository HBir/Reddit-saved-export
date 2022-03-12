const Snoowrap = require('snoowrap');
const fs = require('fs');
require('dotenv').config();

// let filesDone = JSON.parse(fs.readFileSync('files_done.json'));
const filesDone = require('./files_done.json');

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
    // post_hint: post.post_hint,
    filename,
  };
};

const handlePost = (post) => {
  const postData = formatPostData(post);
  if (filesDone[postData.url]) {
    console.log(`File already downloaded, skipping: ${postData.url}`);
    return '';
  }

  markAsComplete(postData.url, postData.filename);
  return postData;
};

const main = async () => {
  const res = await r.getMe().getSavedContent()
    // .fetchAll({ skipReplies: true })
    .filter((post) => !post.is_self)
    .filter((post) => post.post_hint === 'image')
    .map((post) => handlePost(post));

  console.log(res);
  console.log(res.length);
};

main();
