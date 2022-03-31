const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl-exec');
const { log } = require('./logger');

const {
  markAsFailed,
  markAsComplete,
} = require('./dl-status-cache');

const youtubeDlDownload = async (url, folder, filename, out) => {
  log(`\nDownloading (youtube-dl) ${url} ${folder}/${filename}`);
  const options = {
    output: `${out}/${folder}/${filename}.%(ext)s`,
    playlistEnd: 1,
    addMetadata: true,
    format: 'best',
  };

  return youtubedl(url, options).then((output) => {
    log('Finished downloading', output);
    markAsComplete(url, filename, folder);
  }).catch((err) => {
    log(`[ERROR] (youtube-dl) Failed to download ${url} ${err.stderr}`);
    markAsFailed(url, filename, folder, err.stderr);
  });
};

const galleryDlDownloader = async (url, folder, filename, out) => {
  log(`Downloading (gallery-dl) ${url} ${folder}/${filename}`);
  try {
    const { stdout } = await exec(
      `gallery-dl ${url} -D ${out}/${folder} -f '${filename}{num!S}.{extension}'`,
    );
    log(stdout);
  } catch (err) {
    throw new Error(err);
  }

  markAsComplete(url, filename, folder);
};

const downloadFile = async (url, folder, filename, out) => {
  try {
    await galleryDlDownloader(url, folder, filename, out);
  } catch (err) {
    log(`[ERROR] (gallery-dl) Failed to download ${url}`);
    if ((err.message || '').includes('No suitable extractor')) {
      return youtubeDlDownload(url, folder, filename, out);
    }
    log(err.message);
    markAsFailed(url, filename, folder || 'undefined', err.message);
  }
  return Promise.resolve();
};

module.exports = {
  downloadFile,
};
