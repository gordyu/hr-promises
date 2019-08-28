/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);
var request = require('request');
var promisificaion = require('../../exercises/bare_minimum/promisification.js');

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return fs
    .readFileAsync(readFilePath)
    .then(file => {
      return file.toString().split('\n')[0];
    })
    .then(user => {
      return promisificaion.getGitHubProfileAsync(user);
    })
    .then(res => {
      return fs.writeFileAsync(writeFilePath, JSON.stringify(res));
    });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
