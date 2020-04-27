const fs = require("fs");
const readJson = require("./utils/readJson");

// Reduce all "Element Description English" for the same "Class title" where the "Element Type Label English" contains 'example'
// ---
/**
  Filter the data to only items where "Element Type Label English" contains 'example'
  Then, for each unique "Class title"
    Combine all entries into one where the "Element Description English" values are joined by ";"
  Return the new array
*/

const nocElementMap = {
  typeLabel: "Element Type Label English",
  classTitle: "Class Title",
  level: "Level",
  code: "Code",
  description: "Element Description English"
};

const nocFilterByElementTypeLabel = entry => {
  // Expects the  NOC Element structure
  return entry[nocElementMap.typeLabel].match(/example/gi);
};

const nocExtractUniqueTitles = list => {
  var uniqueTitles = [],
      uniqueClasses = [];

  list.forEach(element => {
    var title = element[nocElementMap.classTitle];

    if (!uniqueTitles.includes(title)) {
      uniqueTitles.push(title);
      uniqueClasses.push({
        nocTitle: title,
        nocLevel: element[nocElementMap.level],
        nocCode: element[nocElementMap.code]
      });
    }
  });
  return uniqueClasses;
};


/**
 * 
 * Here's where we do it all!
 * 
 */
const buildReducedDataset = (srcPath, destPath) => {
  readJson(srcPath, (err, data) => {
    if (err) throw err;

    var list = data.data;
    var outputList = [];

    console.log(list.length + ' total entries');

    /**
     * Filter the list down to just entries with examples
     */
    list = list.filter(nocFilterByElementTypeLabel);
    console.log(list.length + ' entries with examples');

    /**
     * Extract the unique Class Titles
     */
    var uniqueClassesByTitle = nocExtractUniqueTitles(list);
    console.log(uniqueClassesByTitle.length + ' unique classes');

    /** 
     * Combine all entries into one where the "Element Description English" values are joined by ";"
     * And make the examples available individually
     */
    uniqueClassesByTitle.forEach(nocClass => {
      var combinedExamples = list
        .filter(entry => entry[nocElementMap.classTitle] === nocClass.nocTitle)
        .reduce((accumulator, curr) => {
          return `${accumulator};${curr[nocElementMap.description].trim()}`;
        }, '');

      outputList.push({
        ...nocClass,
        combinedExamples,
        examples: combinedExamples.split(';').slice(1) // cut off the first empty item
      });
    });

    /**
     * Create a better JSON output format for the list
     */
    const outputFormat = { data: outputList };

    /**
     * Write the transformed data to file
     */
    fs.writeFile(destPath, JSON.stringify(outputFormat), 'utf8', (err) => {
      if (err) throw err;

      console.log("File saved");
    });
  });
};

/**
 * This is an alternate that preserves the unique elements for simplified searching
 */
const convertDataset = (srcPath, destPath) => {
  readJson(srcPath, (err, data) => {
    if (err) throw err;

    var list = data.data;
    var outputList = [];

    console.log(list.length + ' total entries');

    /**
     * Filter the list down to just entries with examples
     */
    list = list.filter(nocFilterByElementTypeLabel);
    console.log(list.length + ' entries with examples');

    /**
     * Extract the unique Class Titles
     */
    var uniqueClassesByTitle = nocExtractUniqueTitles(list);
    console.log(uniqueClassesByTitle.length + ' unique classes');

    /** 
     * Remap all of the entries into
     */

    outputList = list.map(element => {
      return {
        nocTitle: element[nocElementMap.classTitle],
        nocLevel: element[nocElementMap.level],
        nocCode: element[nocElementMap.code],
        combinedExamples: element[nocElementMap.description].trim(), // mapping to this value is a hack to make the existing search work
      }
    });

    /**
     * Create a better JSON output format for the list
     */
    const outputFormat = { data: outputList };

    /**
     * Write the transformed data to file
     */
    fs.writeFile(destPath, JSON.stringify(outputFormat), 'utf8', (err) => {
      if (err) throw err;

      console.log("File saved");
    });
  });
};

 /** END */
const configs = {
  naics: {
    source: './naics-raw.json',
    //dest: './naics-reduced-ext.json',
    dest: './naics-converted.json',
  },
  noc: {
    source: './noc-raw.json',
    //dest: './noc-reduced-ext.json',
    dest: './noc-converted.json',
  }
}

/**
 * Choose which configuration you want to run with!
 *  - config.naics
 *  - config.noc
 */
const config = configs.noc;

const srcPath = require.resolve(config.source, { paths: [process.cwd()] });
//const destPath = require.resolve(config.dest, { paths: [process.cwd()] });

//buildReducedDataset(srcPath, config.dest);
convertDataset(srcPath, config.dest);