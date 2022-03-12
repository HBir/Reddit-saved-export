const linuxSafeString = (string) => (string || 'undefined').replaceAll(/[^a-zA-Z_0-9åäö\\-]/ig, '_').replaceAll(/_+/g, '_');

const getFileExtension = (string) => {
  // eslint-disable-next-line prefer-regex-literals
  const regexp = new RegExp('\\/[^\\/]*\\.([^\\.\\/]*)$');
  return ((string || '').match(regexp) || [])[1] || '';
};


const formatPostData = (post) => {
  const extension = getFileExtension(post.url);

  const filename = `${linuxSafeString((post.author || {}).name || post.author)}_[`
    + `${(post.subreddit || {}).display_name || post.subreddit}]_`
    + `${linuxSafeString(post.title)}`
    // + `.${fileExtension}`;

  return {
    url: post.url,
    post_hint: linuxSafeString(post.post_hint),
    filename,
    extension
  };
};

module.exports = {
  linuxSafeString,
  getFileExtension,
  formatPostData,
}