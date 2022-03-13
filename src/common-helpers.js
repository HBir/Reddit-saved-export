const linuxSafeString = (string) => (string || 'undefined').replaceAll(/[^a-zA-Z_0-9åäö-]/ig, '_').replaceAll(/_+/g, '_');

const formatPostData = (post) => {
  if (!post.title || !post.url) {
    throw new Error('Invalid post: Missing title or url', post);
  }
  const filename = `${linuxSafeString((post.author || {}).name || post.author)}_[`
    + `${(post.subreddit || {}).display_name || post.subreddit}]_${
      `${linuxSafeString(post.title)}`.substring(0, 145)}`;

  return {
    url: post.url,
    postHint: linuxSafeString(post.post_hint),
    filename,
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
};
