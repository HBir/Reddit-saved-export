const fs = require('fs');

const filesDone = require('../resources/files_done.json');
const filesFailed = require('../resources/files_failed.json');

let amountSkipped = 0;
let amountFailed = 0;

const isAlreadyProcessed = (url) => {
  if (filesDone[url])  {
    amountSkipped += 1;
    return true;
  }
  if (filesFailed[url]) {
    amountFailed += 1;
    return true;
  }
  return false;
};

const markAsFailed = (url, filename, reason) => {
  filesFailed[url] = {filename, reason};
  fs.writeFileSync('./resources/files_failed.json', JSON.stringify(filesFailed, null, 2));
}

const markAsComplete = (url, filename) => {
  filesDone[url] = filename;
  fs.writeFileSync('./resources/files_done.json', JSON.stringify(filesDone, null, 2));
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