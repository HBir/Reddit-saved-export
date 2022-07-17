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

const setMetadataOptions = (metadata) =>
  Object.entries(metadata).map((key) => `-o 'extractor.keywords.${key[0]}=${key[1]}'`).join(' ');

const galleryDlDownloader = async (url, folder, filename, metadata, out) => {
  log(`Downloading (gallery-dl) ${url} ${folder}/${filename}`);
  log(metadata);
  try {
    console.log(setMetadataOptions(metadata));
    const { stdout } = await exec(
      `gallery-dl ${url} -D ${out}/${folder} -f '${filename}{num!S}.{extension}' \
      --write-metadata \
      -o 'extractor.url-metadata=gdl_file_url' \
      ${setMetadataOptions(metadata)}`,
    );
    log(stdout);
  } catch (err) {
    throw new Error(err);
  }

  markAsComplete(url, filename, folder);
};

const downloadFile = async (url, folder, filename, metadata, out) => {
  try {
    await galleryDlDownloader(url, folder, filename, metadata, out);
  } catch (err) {
    log(`[ERROR] (gallery-dl) Failed to download ${url}`);
    // if ((err.message || '').includes('No suitable extractor')) {
    //   return youtubeDlDownload(url, folder, filename, out);
    // }
    log(err.message);
    markAsFailed(url, filename, folder || 'undefined', err.message);
  }
  return Promise.resolve();
};

module.exports = {
  downloadFile,
};
