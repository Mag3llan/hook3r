var fs = require('fs');
var lugg = require('lugg');
var chai = require('chai');

chai.should();
lugg.init();

var Hooker = require('../lib/hooker');

describe('Hooker', function() {
	var secret = 'ChangeMe!!';
	var fileName = "test.sh";
	var fileNameHash = "pyUPMeDcQ9k=";
	var fileNameHashEncoded = "pyUPMeDcQ9k%3D"; //URL Encoded

	var hooker = new Hooker({
		path: "./test/resources",
		secret: secret
	});

	var data = {
		"name": "test-name",
		"docker_url": "quay.io/mag3llan/test-name",
		"updated_tags": {
			"develop.255": "fc031c925349c6581721ac9f528229a293a0f1f6f9181d8e19f6355209d6f209"
		}
	}
	var fileCreatedName = "./test/resources/" + data["name"]; //test-name

	describe('Run file', function() {		

		it('should create a file with the name from quayExample (test-name)', function(done) {			

			hooker.runFile(fileName, data)
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

	});

	describe("Run hash", function() {

		it('should create a file with the name from quayExample (test-name)', function(done) {			
			
			hooker.runHash(fileNameHash, data)
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

	describe('Hashes for files on descriptor', function() {
		var scripts = hooker.availableScripts()

		it('should return a map with all filenames (keys) and hashes (values)', function() {
			scripts.should.have.keys(['test.sh', 'never-run.sh'])
		});

		it('should generate a valid hash', function() {
			var testShHash = 'SxxtE5jlYHY%3D'
			scripts["test.sh"].should.be.eql(fileNameHashEncoded)
		})

	})

});