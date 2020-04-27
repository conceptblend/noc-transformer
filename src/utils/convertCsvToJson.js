const fs = require("fs");
const Papa = require("papaparse");

const configs = {
  naics: {
    source: './resources/naics-scian-2017-element-v3-eng.csv',
    dest: './naics-raw.json',
  },
  noc: {
    source: './resources/noc-cnp-2016-element-v3-eng.csv',
    dest: './noc-raw.json',
  }
}

const options = {
  delimiter: "", // auto-detect
  newline: "", // auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: true,
  dynamicTyping: false,
  preview: 0,
  encoding: "UTF-8",
  worker: false,
  comments: false,
  complete: (results, file) => {
    console.log(`Parse successful: ${file.path}`);
    csv.close();
    fs.writeFile(config.dest, JSON.stringify(results), 'utf8', (err) => {
      if (err) throw err;
  
      console.log(`File saved: ${config.dest}`);
    });
  },
  error: (err, file) => { console.log(err) },
  download: false,
  skipEmptyLines: false,
  delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP]
};

/**
 * Choose which configuration you want to run with!
 *  - config.naics
 *  - config.noc
 */
const config = configs.naics;
const csv = fs.createReadStream(config.source)
Papa.parse(csv, options);
