let quiet = false;

const log = (...args) => {
  if (!quiet) {
    console.log(...args);
  }
};

const logRes = (...args) => {
  console.log(...args);
};

const setLoggingMode = (mode) => {
  quiet = mode;
};

module.exports = {
  log,
  logRes,
  setLoggingMode,
};
