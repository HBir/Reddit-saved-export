const fs = require('fs').promises;
const { dirname } = require('path');
const { log } = require('./logger');

const filesDone = require('../resources/files_done.json');
const filesFailed = require('../resources/files_failed.json');

const projectPath = dirname(require.main.filename);

// HACK: Not so nice, and can probably be solved a better way.
// Works as long as it is only run from `npm start`
let amountSkipped = 0;
let amountFailed = 0;

const isAlreadyProcessed = (url) => {
  if (filesDone[url]) {
    amountSkipped += 1;
    return true;
  }
  if (filesFailed[url]) {
    amountFailed += 1;
    return true;
  }
  return false;
};

const markAsFailed = (url, filename, type, reason) => {
  filesFailed[url] = {
    filename, reason, type, timestamp: new Date().toLocaleString('se'),
  };
  return fs.writeFile(`${projectPath}/resources/files_failed.json`, JSON.stringify(filesFailed, null, 2));
};

const markAsComplete = (url, filename, type) => {
  filesDone[url] = { filename, type, timestamp: new Date().toLocaleString('se') };
  return fs.writeFile(`${projectPath}/resources/files_done.json`, JSON.stringify(filesDone, null, 2));
};

const logAmountSkipped = () => {
  log(`Skipped ${amountSkipped} (done) ${amountFailed} (failed) already processed files.`);
};

module.exports = {
  markAsFailed,
  markAsComplete,
  isAlreadyProcessed,
  logAmountSkipped,
};
