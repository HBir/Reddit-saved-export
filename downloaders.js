const util = require('util');
const exec = util.promisify(require('child_process').exec);

const {
  markAsFailed,
  markAsComplete,
} = require('./statusManager')

const galleryDlDownloader = async (url, folder, filename) => {
  try {
    console.log(`Downloading (gallery-dl) ${url} ${folder}/${filename}`);
    const { stdout } = await exec(
      `gallery-dl ${url} -D out/${folder} -f '${filename}{num\\!S}.{extension}'`
    )
    console.log(stdout);
    markAsComplete(url, filename);
  } catch(err) {
    console.log(err);
    markAsFailed(url, filename);
  }
}

const youtubeDlDownload = async (url, folder, filename) => {
  try {
    console.log(`Downloading (youtube-dl) ${url} ${folder}/${filename}`);
    const res = await youtubedl(url, {
      output: `out/${folder}/${filename}.%(ext)s`,
      playlistEnd: 1,
      addMetadata: true,
      format: 'best',
    })
    console.log("Finished downloading", output);
    markAsComplete(url, filename);
  } catch (err) {
    console.log(err);
    console.log(`[ERROR] Failed to download ${url}`);
    markAsFailed(url, filename)
  }
}



module.exports = {
  youtubeDlDownload,
  galleryDlDownloader
}