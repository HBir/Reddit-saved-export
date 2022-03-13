const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl-exec');

const {
  markAsFailed,
  markAsComplete,
} = require('./dl-status-cache');

const youtubeDlDownload = async (url, folder, filename) => {
  console.log(`Downloading (youtube-dl) ${url} ${folder}/${filename}`);
  const options = {
    output: `out/${folder}/${filename}.%(ext)s`,
    playlistEnd: 1,
    addMetadata: true,
    format: 'best',
  };

  return youtubedl(url, options).then((output) => {
    console.log('Finished downloading', output);
    markAsComplete(url, filename);
  }).catch((err) => {
    console.log(`[ERROR] Failed to download ${url}`);
    console.log(err);
    markAsFailed(url, filename, err.stderr);
  });
};

const galleryDlDownloader = async (url, folder, filename) => {
  try {
    console.log(`Downloading (gallery-dl) ${url} ${folder}/${filename}`);
    const { stdout } = await exec(
      `gallery-dl ${url} -D out/${folder} -f '${filename}{num!S}.{extension}'`,
    );
    console.log(stdout);
    markAsComplete(url, filename);
  } catch (err) {
    console.log(`[ERROR] Failed to download ${url}`);
    console.log(err.stderr);
    if ((err.stderr || '').includes('No suitable extractor')) {
      return youtubeDlDownload(url, folder, filename);
    }
    markAsFailed(url, filename, err.stderr);
  }
  return Promise.resolve();
};

module.exports = {
  youtubeDlDownload,
  galleryDlDownloader,
};
