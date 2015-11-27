var lugg = require('lugg');
var chai = require('chai');

chai.should();
lugg.init();

describe("Encryption", function() {
	var encryption = require('../lib/encryption');
	var secret = 'ChangeMe!!';
	var fileName = "test.sh";
	var fileNameHash = "pyUPMeDcQ9k=";
	var fileNameHashEncoded = "pyUPMeDcQ9k%3D"; //URL Encoded

	describe("Hash from file name", function() {

		it("should throw exception when empty file name", function() {
			var emptyFileName = '';
			(function() {
				encryption.hashFromFileName(emptyFileName, secret)
			}).should.throw(Error);
		});

		it("should return a valid hash when non empty file name", function() {
			encryption.hashFromFileName(fileName, secret)
				.should.be.equal(fileNameHashEncoded)
		});	

	});

	describe("File name from hash", function() {

		it("should throw exception when empty hash", function() {
			var emptyHash = '';
			(function() {
				encryption.fileNameFromHash(emptyHash, secret)
			}).should.throw(Error);
		});

		it('should return the test file name', function() {
			encryption.fileNameFromHash(fileNameHash, secret)
					.should.be.equal(fileName)
		})

	});

})