const linuxSafeString = (string) => (string || 'undefined').replaceAll(/[^a-zA-Z_0-9åäö\\-]/ig, '_').replaceAll(/_+/g, '_');

const formatPostData = (post) => {
  const filename = `${linuxSafeString((post.author || {}).name || post.author)}_[`
    + `${(post.subreddit || {}).display_name || post.subreddit}]_${
      `${linuxSafeString(post.title)}`.substring(0, 145)}`;

  return {
    url: post.url,
    postHint: linuxSafeString(post.post_hint),
    filename,
  };
};

module.exports = {
  linuxSafeString,
  formatPostData,
};
