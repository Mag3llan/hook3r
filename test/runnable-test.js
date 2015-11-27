var fs = require('fs');
var path = require('path');
var chai = require('chai');
var lugg = require('lugg');

chai.should();
lugg.init();



describe("Runnable", function() {
	var runnable = require('../lib/runnable');

	var _runnable = {
				path: "./test/resources/",
				fileName: "test.sh",
				staticEnvs: {
					"STATIC_ENV": "VALID"
				},
				queries: {
					"docker_url": "URL",
					"name": "REPOSITORY_NAME",
					"updated_tags:keys():first()": "NEW_TAG",
					"updated_tags:keys():first():words(?, '.'):first()": "ENVIRONMENT",
					"array_test:first()": "FIRST_FROM_ARRAY"
				}
			}

	var data = {
		"name": "test-name",
		"docker_url": "quay.io/mag3llan/test-name",
		"updated_tags": {
			"develop.255": "fc031c925349c6581721ac9f528229a293a0f1f6f9181d8e19f6355209d6f209",
			"develop.256": "fc031c925349c6581721ac9f528229a293a0f1f6f9181d8e19f6355209d6f209"
		},
		"array_test": ["first", "second", "last"]
	}

	var fileCreatedName = "./test/resources/" + data["name"]; //test-name

	describe("Run existing file", function() {
		it("should run", function(done) {
			
			runnable.run.call(_runnable, data)
				.then(function() {
					fs.exists(fileCreatedName, function(exists) {
					    exists.should.be.true;
					    done();
					});
				})
				.catch(function(err) {
					done(err);
				});
		});

		afterEach(function() {
			fs.unlink(fileCreatedName);
		});

	})

});