var nock = require('nock');
var expect = require('chai').expect;
var Promise = require('bluebird');

describe('Promisification', function() {
  var promisificaion = require('../../exercises/bare_minimum/promisification.js');

  describe('getGitHubProfileAsync', function() {
    var getGitHubProfileAsync = promisificaion.getGitHubProfileAsync;

    // Nock is a super cool library that makes it easy to test
    // functions that send HTTP requests. Nock intercepts all outgoing
    // requests and allows us to send back any response we want instead.
    // Since no actual requests is ever sent, our tests run faster
    // and we preserve our API rate limits.
    var githubAPI = nock('https://api.github.com');

    it('should return a promise', function() {
      githubAPI.get('/users/someRealUser').reply(200);

      // Must return a Bluebird promise. ES6 promise won't work here
      expect(getGitHubProfileAsync('someRealUser')).to.be.an.instanceOf(Promise);
    });

    it('should make a GitHub profile available in the `then` block', function(done) {
      githubAPI.get('/users/someRealUser').reply(200, {
        id: 12345,
        login: 'someRealUser',
        repoCount: 25,
        stargazers: 100
      });

      getGitHubProfileAsync('someRealUser')
        .then(function(profile) {
          expect(profile.id).to.equal(12345);
          done();
        })
        .catch(done);
    });

    it('should make any errors available in the `catch` block', function(done) {
      githubAPI.get('/users/someNonExistingUser').reply(200, {
        message: 'Not Found'
      });

      getGitHubProfileAsync('someNonExistingUser')
        .catch(function(err) {
          expect(err.message).to.contain('Failed to get GitHub profile');
          done();
        });
    });

    // Restore HTTP requests to their normal unmocked behavior
    after(function() {
      nock.cleanAll();
    });

  });

  describe('generateRandomTokenAsync', function() {
    var generateRandomTokenAsync = promisificaion.generateRandomTokenAsync;

    it('should return a promise', function() {
      // Must return a Bluebird promise. ES6 promise won't work here
      expect(generateRandomTokenAsync()).to.be.an.instanceOf(Promise);
    });

    it('should make a random token available in the `then` block', function(done) {
      generateRandomTokenAsync()
        .then(function(token) {
          // each byte is two hexidecimal characters
          expect(token).to.have.length(40);
          done();
        })
        .catch(done);
    });

  });

  describe('readFileAndMakeItFunnyAsync', function() {
    var readFileAndMakeItFunnyAsync = promisificaion.readFileAndMakeItFunnyAsync;

    it('should return a promise', function() {
      // Must return a Bluebird promise. ES6 promise won't work here
      expect(readFileAndMakeItFunnyAsync(__dirname + '/../files/file_to_read.txt')).to.be.an.instanceOf(Promise);
    });

    it('should make a funny file available in the `then` block', function(done) {
      readFileAndMakeItFunnyAsync(__dirname + '/../files/file_to_read.txt')
        .then(function(funnyFile) {
          funnyFile.split('\n').forEach(function(line) {
            expect(line).to.contain('lol');
          });
          done();
        })
        .catch(done);
    });

    it('should make any errors available in the `catch` block', function(done) {
      readFileAndMakeItFunnyAsync(__dirname + '/../files/nonexistent_file.txt')
        .catch(function(err) {
          expect(err.code).to.equal('ENOENT');
          done();
        });
    });

  });

});
