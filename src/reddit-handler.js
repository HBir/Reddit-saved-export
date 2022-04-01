/* eslint-disable camelcase */
const fs = require('fs').promises;
const Snoowrap = require('snoowrap');
const { dirname } = require('path');

const projectPath = dirname(require.main.filename);

const { humanReadableMs } = require('./common-helpers');
const { log } = require('./logger');

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

const getCache = async () => {
  try {
    // eslint-disable-next-line import/no-unresolved
    return require('../resources/cache.json');
  } catch (err) {
    log('[INFO] Cache file not found');
    return {};
  }
};

const pruneKeys = (posts) => posts.map(({
  saved,
  approved_at_utc,
  mod_reason_title,
  gilded,
  clicked,
  hidden,
  pwls,
  link_flair_css_class,
  thumbnail_height,
  top_awarded_type,
  hide_score,
  quarantine,
  link_flair_text_color,
  author_flair_background_color,
  subreddit_type,
  thumbnail_width,
  author_flair_template_id,
  user_reports,
  is_meta,
  can_mod_post,
  approved_by,
  is_created_from_ads_ui,
  author_premium,
  author_flair_css_class,
  author_flair_richtext,
  gildings,
  mod_note,
  wls,
  removed_by_category,
  banned_by,
  author_flair_type,
  allow_live_comments,
  likes,
  suggested_sort,
  banned_at_utc,
  archived,
  no_follow,
  is_crosspostable,
  pinned,
  all_awardings,
  awarders,
  _config,
  _r,
  _fetch,
  _hasFetched,
  spoiler,
  locked,
  treatment_tags,
  num_reports,
  mod_reason_by,
  removal_reason,
  link_flair_background_color,
  is_robot_indexable,
  report_reasons,
  discussion_type,
  send_replies,
  whitelist_status,
  contest_mode,
  mod_reports,
  author_patreon_flair,
  author_flair_text_color,
  parent_whitelist_status,
  stickied,
  ...keep
}) => keep);

const getAllSavedPostWithCache = async () => {
  const cache = await getCache();

  const cacheTtl = process.env.REDDIT_CACHE_TTL || 3600000;
  const tsAge = Date.now() - cache.timestamp || 0;
  if (cache.content && tsAge < cacheTtl) {
    log(`Using cache from ${humanReadableMs(tsAge)} ago. (${cache.content.length} posts)`);
    return cache.content;
  }

  log('Fetching content from Reddit...');
  const freshData = await r.getMe().getSavedContent()
    .fetchAll({ skipReplies: true });

  const prunedData = pruneKeys(freshData);

  log(`Recieved ${freshData.length} posts`);
  await fs.writeFile(`${projectPath}/resources/cache.json`, JSON.stringify({ timestamp: Date.now(), content: prunedData }, null, 2));
  return freshData;
};

module.exports = {
  getAllSavedPostWithCache,
};
