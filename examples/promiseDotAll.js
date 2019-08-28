// Run this file with `node examples/promiseDotAll.js`

var Promise = require('bluebird');
var asyncLib = require('../lib/asyncLib.js');

Promise.all([
  asyncLib.getValueA(),
  asyncLib.getValueB(),
  asyncLib.getValueC(),
  asyncLib.getValueD()
])
.then(asyncLib.logResolvedValues)
.then(asyncLib.filterValuesFromCollection)
.then(asyncLib.doMoreAsyncWorkWithFilteredValues)
// `bind` sets correct context when using console.log as a callback
.catch(console.log.bind(console));