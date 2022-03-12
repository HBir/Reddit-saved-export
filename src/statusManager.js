const fs = require('fs');

const filesDone = require('../resources/files_done.json');
const filesFailed = require('../resources/files_failed.json');

let amountSkipped = 0;
let amountFailed = 0;

const isAlreadyProcessed = (url) => {
  if (filesDone[url])  {
    // console.log(`File already processed, skipping: ${url}`);
    amountSkipped += 1;
    return true;
  }
  if (filesFailed[url]) {
    // console.log(`File already processed but failed, skipping: ${url}`);
    amountFailed += 1;
    return true;
  }
  return false;
};

const markAsFailed = (url, filename) => {
  filesFailed[url] = filename;
  fs.writeFileSync('files_failed.json', JSON.stringify(filesFailed, null, 2));
}

const markAsComplete = (url, filename) => {
  filesDone[url] = filename;
  fs.writeFileSync('files_done.json', JSON.stringify(filesDone, null, 2));
};

const printAmountSkipped = () => {
  console.log(`Skipped ${amountSkipped} (done) ${amountFailed} (failed) already processed files.`);
}

module.exports = {
  markAsFailed,
  markAsComplete,
  isAlreadyProcessed,
  printAmountSkipped
}