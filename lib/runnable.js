var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var jsonQuery = require('json-query');
var child_process = require('child_process');
var logger = require('lugg')('runnable');

//PRIVATE
function checkFileExists(scriptPath) {
	return new Promise(function(resolve, reject) {
		fs.exists(scriptPath, function(exists) {
			if (!exists) {
				logger.debug('Script not found on %s', scriptPath)
				reject(new Error('Script not found'))
			}
		});

		resolve(scriptPath);
	});
}

function evalQueries(jsonQueries, hookData) {

	return _.object(_.map(jsonQueries, function(envName, query) {
		//Evaluate jsonquery
		var queryValue = jsonQuery(query, {
			data: hookData,
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
	var execPromise = new Promise(function(resolve, reject) {
		child_process.exec('/usr/bin/env sh ' + scriptPath, options, function(err, stdout, stderr) {
			logger.debug(stdout);
			console.log(stdout)
			if (err) {
				logger.error(err)
				reject(err)
			};

			logger.info('Script [%s] sucessfully executed...', scriptPath)
			resolve();
		});
	});

	return execPromise;
}

var scriptPath = function() {
	return path.join(this.path, this.fileName);
}


exports = module.exports = {
		run: function(data) {
			console.log(this);
			var buildOptions = _.partial(envOptions, this.path, this.queries, this.staticEnvs, data)
			
			var runWithOptions = _.partial(promisifiedExec, this.fileName)

			return checkFileExists(this.fileName)
				.then(buildOptions)
				.then(runWithOptions)
		}
}