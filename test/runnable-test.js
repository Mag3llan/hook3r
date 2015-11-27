var fs = require('fs');
var path = require('path');
var chai = require('chai');
var lugg = require('lugg');

chai.should();
lugg.init();



describe("Runnable", function() {
	var runnable = require('../lib/runnable');
	var existingScriptPath = 'test.sh';
	var jsonQueries = {}



	var staticEnvs = {
		"PWD": path.join(process.env["PWD"], "test/resources/")
	}
	
	var data = {
		"name": "test-name",
		"docker_url": "quay.io/mag3llan/test-name"
	}

	var expectedFileCreatedName = "test-name";

	describe("Run existing file", function() {
		it("should run", function(done) {
			var _runnable = {
				path: "./test/resources/",
				fileName: "test.sh",
				staticEnvs: {
					"STATIC_ENV": "VALID"
				},
				queries: {
					"docker_url": "URL",
					"name": "REPOSITORY_NAME"
				}
			}

			var expectedFilePath = path.join(_runnable.path, expectedFileCreatedName)
			console.log(expectedFilePath);
			runnable.run.call(_runnable, data)
				.then(function() {
					fs.exists(expectedFilePath, function(exists) {
					    exists.should.be.true;
					    done();
					});
				})
				.catch(function(err) {
					done(err);
				});
		});

	})

});