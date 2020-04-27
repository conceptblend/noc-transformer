const lunr = require("lunr");
const rawData = require("../../noc-reduced-ext.json");
const data = rawData.data.map((entry, index) => {
  return {
    ...entry,
    id: index
  };
});

console.log(`${data.length} records loaded`);

const idx = lunr(function() {
  this.field("nocTitle");
  this.field("combinedExamples");
  this.ref("id");

  data.forEach(entry => this.add(entry));
});

let results = idx.search("des");

console.log(`${results.length} results`)
console.log(results.map(entry => data[entry.ref].nocTitle))
