const fs = require('fs');

const filesDone = require('./files_done.json') || {};
const filesFailed = require('./files_failed.json') || {};

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
  fs.writeFileSync('files_failed.json', JSON.stringify(filesFailed));
}

const markAsComplete = (url, filename) => {
  filesDone[url] = filename;
  fs.writeFileSync('files_done.json', JSON.stringify(filesDone));
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