var _ = require("lodash");
var path = require("path");
var Promise = require("bluebird");
var fs = require("fs");
var jsonQuery = require('json-query');
var child_process = require('child_process');
var logger = require('lugg')('runnable');

//PRIVATE
function checkFileExists(scriptPath) {
	return new Promise(function(resolve, reject) {
		logger.debug(scriptPath);
		fs.exists(scriptPath, function(exists) {
			if (!exists) {
				logger.debug('Script not found on %s', scriptPath)
				reject(new Error('Script not found'))
			}
		});

		resolve(scriptPath);
	});
}

function evalQueries(jsonQueries, data) {

	return _.object(_.map(jsonQueries, function(envName, query) {
		//Evaluate jsonquery
		var queryValue = jsonQuery(query, {
			data: data,
			locals: _ //Using lodash to process json
		});

		return [envName, queryValue.value];
	}));
}

/**
* Options are the values that are going to be passed as environment variables
* to the script;
* Static envs should work as a filter.
* 
*/
function envOptions(path, queries, staticEnv, data) {
	//Evaluate json queries
	var env = evalQueries(queries, data)
	_.merge(env, staticEnv); //static from descriptor
	_.merge(env, _.omit(process.env, function(value, varName) {
		if (_.includes(varName, 'npm_'))
			return true;

		return false;
	})); //process environment variables, omitting npm variables

	return {
		env: env,
		cwd: path
	};
}

/**
* Security notice: 
* 	Script Path should never be a user input directly. 
* 	Options should never be user input directly.
*/
function promisifiedExec(scriptPath, options) {
	//TODO: Sanitiza script path for ../
	return new Promise(function(resolve, reject) {
		logger.debug(options);
		child_process.exec('/usr/bin/env sh ' + scriptPath, options, function(err, stdout, stderr) {
			logger.debug(stdout);
			if (err) {
				reject(err)
			};

			resolve();
		});
	});
}

var scriptPath = function() {
	return path.join(this.path, this.fileName);
}


exports = module.exports = {
		run: function(data) {
			var self = this;
			
			return Promise.try(function() {
				var options = _.partial(envOptions, self.path, self.queries, self.staticEnvs, data)
				var runWithOptions = _.partial(promisifiedExec, self.fileName)

				return checkFileExists(scriptPath.call(self))
					.then(options)
					.then(runWithOptions);
			});
			
		}
}