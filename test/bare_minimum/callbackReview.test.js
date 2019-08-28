var nock = require('nock');
var expect = require('chai').expect;

describe('Callback review', function() {
  var callbackReview = require('../../exercises/bare_minimum/callbackReview.js');

  describe('pluckFirstLineFromFile', function() {
    var pluckFirstLineFromFile = callbackReview.pluckFirstLineFromFile;

    it('should accept a callback as its last argument', function(done) {
      pluckFirstLineFromFile(__dirname + '/../files/file_to_read.txt', function() {
        // If this asserion gets called, the callback was invoked correctly
        // Otherwise, this test will timeout after 2000ms
        expect(true).to.equal(true);
        done();
      });
    });

    it('should invoke the callback with an error as the first argument', function(done) {
      pluckFirstLineFromFile(__dirname + '/../files/nonexistent_file.txt', function(err, firstLine) {
        expect(err.code).to.equal('ENOENT');
        expect(firstLine).to.not.exist;
        done();
      });
    });

    it('should invoke the callback with the first line as the second argument', function(done) {
      pluckFirstLineFromFile(__dirname + '/../files/file_to_read.txt', function(err, firstLine) {
        expect(firstLine).to.equal('This is a file to read');
        expect(err).to.not.exist;
        done();
      });
    });

  });

  describe('getStatusCode', function() {
    var getStatusCode = callbackReview.getStatusCode;

    // Nock is a super cool library that makes it easy to test
    // functions that send HTTP requests. Nock intercepts all outgoing
    // requests and allows us to send back any response we want instead.
    // Since no actual requests is ever sent, our tests run faster
    // and we preserve our API rate limits.
    var google = nock('https://google.com');
    var someNonExistantWebsite = nock('https::///thisIsNoUrl.comedy');

    it('should accept a callback as its last argument', function(done) {
      google.get('/').reply(200);

      getStatusCode('https://google.com', function() {
        // If this asserion gets called, the callback was invoked correctly
        // Otherwise, this test will timeout after 2000ms
        expect(true).to.equal(true);
        done();
      });
    });

    it('should invoke the callback with an error as the first argument', function(done) {
      someNonExistantWebsite.get('/').reply(404);

      getStatusCode('https::///thisIsNoUrl.comedy', function(err, statusCode) {
        expect(err.message).to.contain('Invalid URI');
        expect(statusCode).to.not.exist;
        done();
      });
    });

    it('should invoke the callback with the status code as the second argument', function(done) {
      google.get('/').reply(200);

      getStatusCode('https://google.com', function(err, statusCode) {
        expect(statusCode).to.equal(200);
        expect(err).to.not.exist;
        done();
      });
    });

    // Restore HTTP requests to their normal unmocked behavior
    after(function() {
      nock.cleanAll();
    });

  });

});