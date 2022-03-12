const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl-exec');

const {
  markAsFailed,
  markAsComplete,
} = require('./statusManager');

const youtubeDlDownload = async (url, folder, filename) => {
  console.log(`Downloading (youtube-dl) ${url} ${folder}/${filename}`);
  return youtubedl(url, {
    output: `out/${folder}/${filename}.%(ext)s`,
    playlistEnd: 1,
    addMetadata: true,
    format: 'best',
  }).then((output) => {
    console.log('Finished downloading', output);
    markAsComplete(url, filename);
  }).catch((err) => {
    console.log(err);
    console.log(`[ERROR] Failed to download ${url}`);
    markAsFailed(url, filename);
  });
};

const galleryDlDownloader = async (url, folder, filename) => {
  try {
    console.log(`Downloading (gallery-dl) ${url} ${folder}/${filename}`);
    const { stdout } = await exec(
      `gallery-dl ${url} -D out/${folder} -f '${filename}{num\!S}.{extension}'`,
    );
    console.log(stdout);
    markAsComplete(url, filename);
  } catch (err) {
    console.log(err.stderr);
    if ((err.stderr || '').includes('No suitable extractor')) {
      return youtubeDlDownload(url, folder, filename);
    }
    markAsFailed(url, filename, err.stderr);
  }
};

module.exports = {
  youtubeDlDownload,
  galleryDlDownloader,
};
