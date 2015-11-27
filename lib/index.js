//External Dependencies
var fs = require('fs');
var logger = require('lugg')('hooker')
var Promise = require('bluebird')
var _ = require('lodash')
var path = require('path')

//INTERNAL
var encryption = require('./encryption.js')
var runnable = require('./runnable.js')

//DEFAULTS
var CURRENT_WORKING_DIRECTORY = process.env['PWD'] || './';
var DEFAULT_SECRET = 'ChangeMe!!';

//LIBRARY
function Hooker(options) {
	var self = this;

	var _path = options.path 
			|| process.env['HOOK3R_PATH'] 
			|| path.join(CURRENT_WORKING_DIRECTORY, './hooks');

	self.path = function() {
		return _path;
	} 

	var _secret = options.secret 
				|| process.env['HOOK3R_SECRET']
				|| DEFAULT_SECRET;

	self.secret = function() {
		return _secret;
	} 

	//Allows to modify on demand.
	//Maybe if in production then make it static
	self.descriptor = function() {
		var descriptorPath = path.join(self.path(), './hooks.json');
		logger.debug("Obtaining descriptor... %s",  descriptorPath);
		return JSON.parse(fs.readFileSync(descriptorPath, 'utf8'));
	}

	self.runnable = function(fileName) {
		console.log("#################" + fileName)
		var scriptOptions = self.descriptor()[fileName]
		if (!scriptOptions) 
			throw new Error('File name not present in descriptor', fileName);
		
		scriptOptions["fileName"] = fileName;
		scriptOptions["path"] = self.path();
		return scriptOptions;
	}

	logger.info('Path selected: %s', self.path());
	if (self.secret() == DEFAULT_SECRET) {
		logger.warn('Please update your private key. Running on with \'%s\'', DEFAULT_SECRET)
	}
	
	//to trigger the descriptor validation
	self.descriptor();
}



/**
*
* Returns a promise
*/
Hooker.prototype.runFile = function(scriptName, data) {
	var self = this;

	var _runnable = self.runnable(scriptName)

	var self = this;
	//Not using require to load the descriptor as that would cache it and later modifications wouldn't work
	
	logger.debug('Calling %s with %s', scriptName, data);
	return Promise.try(function() {
		//logger.debug(_runnable);
		return runnable.run.call(_runnable, data);
	});
	
};


Hooker.prototype.runHash = function(hash, data) {
	var self = this;

	return Promise.try(function() {
		var fileName = encryption.fileNameFromHash(hash, self.secret());
		return self.runFile(fileName, data);
	})
	.catch(function(err) {
		if (err + ''.match(/DecipherFinal/)) {
			throw new Error("Could not decipher hash.");
		}

		throw err;
	})		
};

/**
*
* Returns a middleware
*/
Hooker.prototype.middleware = function() {
	var self = this;
	return function(req, res, next) {
		var hash = req.params.hash;
		var data = req.body;
		
		self.runHash(hash, data)
			.then(function() {
				res.send(200)
			})
			.catch(function(err) {
				logger.error(err.message);
				res.send(new BadRequestError(msg))
			});
	}
	
}	

/**
* In order to execute a script, we need to encrypt the name of the 
*/
Hooker.prototype.createUrlHash = function(cwd) {
	var self = this;
	var fileName = cwd || process.cwd();
  	return encryption.hashFromFileName(fileName, self.secret());
}

/**
* Return all available scripts names with their correspondant hash
*/
Hooker.prototype.availableScripts = function() {
	var self = this;
	var fileNames = _.keys(this.descriptor());
	return _.reduce(fileNames, function(o, v) {
	    o[v] = self.createUrlHash(v);
	    return o;
	}, {});
}


exports = module.exports = Hooker;



