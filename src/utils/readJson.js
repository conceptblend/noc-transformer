const fs = require("fs");

const readJson = (path, cb) => {
  fs.readFile(require.resolve(path), (err, data) => {
    if (err) cb(err);
    else cb(null, JSON.parse(data));
  });
};

module.exports = readJson;