var fs = require('fs');
var expect = require('chai').expect;
var Promise = require('bluebird');

// NOTE: These tests don't use mocks of any kind
// If test speed or API rate limits become an issue,
// refactor the tests to use mocks, following previous
// `nock` utilizing tests

describe('Collections', function() {
  var collections = require('../../exercises/advanced/collections.js');

  describe('combineFirstLineOfManyFiles', function() {
    var combine = collections.combineFirstLineOfManyFiles;

    var fileToWriteTo = __dirname + '/../files/file_to_write_to.txt';

    var filesToRead = [
      __dirname + '/../files/file_to_read.txt',
      __dirname + '/../files/file_two_read.txt',
      __dirname + '/../files/file_three_read.txt'
    ];

    beforeEach(function() {
      // Make sure our test file is clean before we try writing to it
      fs.writeFileSync(fileToWriteTo, '');
    });

    it('should return a promise', function() {
      // Must return a Bluebird promise. ES6 promise won't work here
      expect(combine(filesToRead, fileToWriteTo)).to.be.an.instanceOf(Promise);
    });

    it('should write the first lines of each file to the output file', function(done) {
      combine(filesToRead, fileToWriteTo)
        .then(function() {
          // If a promise is returned,
          // The file should be successfully written
          // before this block is run
          fs.readFile(fileToWriteTo, function(err, content) {
            var newFile = content.toString();
            expect(newFile).to.equal([
              'This is a file to read',
              'Yet another file',
              'A file of three'
            ].join('\n'));
            done();
          });
        })
        .catch(done);
    });

    afterEach(function() {
      // Clean up anything written to our test file
      fs.writeFileSync(fileToWriteTo, '');
    });

  });

});
