const imageExtensions = require('image-extensions');
const videoExtensions = require('video-extensions');

const linuxSafeString = (string) => (string || 'undefined')
  .replaceAll(/['`"]/ig, '')
  .replaceAll(/[^a-zA-Z_0-9åäö-]/ig, '_')
  .replaceAll(/_+/g, '_');

const getFileExtension = (string) => {
  const regexp = /\.((?:(?!\.)[A-Za-z0-9])*?)$/;
  return (string.match(regexp) || [])[1] || '';
};

const remapHint = (postHint, extension) => {
  if (!['undefined', 'link'].includes(postHint)) {
    return postHint;
  }
  if (imageExtensions.includes(extension)) {
    return 'image';
  }
  if (videoExtensions.includes(extension)) {
    return 'video';
  }

  return postHint;
};

const formatPostData = (post) => {
  if (!post.title || !post.url) {
    throw new Error('Invalid post: Missing title or url', post);
  }
  const author = (post.author || {}).name || post.author;
  const subreddit = (post.subreddit || {}).display_name || post.subreddit;
  const filename = `${linuxSafeString(author)}_[`
    + `${subreddit}]_${
      `${linuxSafeString(post.title)}`.substring(0, 145)}`;

  const extension = getFileExtension(post.url);
  const postHint = remapHint(linuxSafeString(post.post_hint), extension);
  return {
    url: post.url,
    postHint,
    filename,
    metadata: {
      reddit_url: `https://reddit.com${post.permalink}`,
      author,
      subreddit,
      title: post.title,
      score: post.score,
      created: post.created,
      num_comments: post.num_comments,
    },
  };
};

const humanReadableMs = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return (hours ? `${hours} hours ` : '') + (minutes ? `${minutes} minutes ` : '') + (seconds ? `${seconds} seconds` : '');
};

module.exports = {
  linuxSafeString,
  formatPostData,
  humanReadableMs,
  getFileExtension,
  remapHint,
};
