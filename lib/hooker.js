//External Dependencies
var child_process = require('child_process')
var fs = require('fs')
var logger = require('lugg')('hooker')
var Promise = require('bluebird')
var _ = require('lodash')
var path = require('path')
var jsonQuery = require('json-query')

//Internal Dependencies
var encryption = require('./encryption.js')

//Configuration
var CURRENT_WORKING_DIRECTORY = process.env['PWD'];
var DEFAULT_HOOKS_PATH = path.join(CURRENT_WORKING_DIRECTORY, './hooks')

function decryptScriptName(hash) {
	// If no hash then request is not authorised
	if (!hash) {
		logger.info('Missing hash, request not authorized', hash)
		return new Error('Script name hash not available')
	}

	// Try to find te
	var script_name = null;
	try {

		script_name = encryption.decrypt(hash);

	} catch (err) {
		logger.error(err);
		if (err + ''.match(/DecipherFinal/)) {
			return new Error('Could not decipher')
		}

		return err
	}

	logger.debug('Script name found: %s', script_name)
	return script_name;
}

//Returns a promise
function checkFileExists(script_path) {
	return new Promise(function(resolve, reject) {
		fs.exists(script_path, function(exists) {
			if (!exists) {
				logger.debug('Script not found on %s', script_path)
				reject(new Error('Script not found'))
			}
		});

		resolve(script_path);
	});
}

function parseQueries(jsonQueries, hookData) {
	return _.object(_.map(jsonQueries, function(envName, query) {
		//Evaluate jsonquery
		
		logger.debug(query)
		var queryValue = jsonQuery(query, {
			data: hookData,
			locals: _ //Using lodash to process json
		});



		return [envName, queryValue.value];
	}));
}

function executeScript(script_name, hookData) {

	var hooker = require(path.join(CURRENT_WORKING_DIRECTORY, './hooks.json'));
	var HOOKS_PATH = _.get(hooker, 'hooks_path', DEFAULT_HOOKS_PATH);
	var script_path = path.join(HOOKS_PATH, script_name)
	logger.debug('Script path: %s', script_path)

	return checkFileExists(script_path)
			.then(function() {
				//Evaluate json queries
				var env = parseQueries(hooker[script_name].queries, hookData)

				//Add static environment variables from descriptor
				var options = {
					env: _.merge(env, hooker[script_name].env)
				};

				return options;
			}).then(function(options) {
				child_process.exec('/usr/bin/env sh ' + script_path, options, function(err, stdout, stderr) {
					logger.debug(stdout);
					if (err) {
						logger.error(err)
						reject(err)
					};

					logger.info('Script [%s] sucessfully executed...', script_name)
				});
			});

}

module.exports.handler = function(req, res, next) {

	var script_name = decryptScriptName(req.params.hash)

	if (_.isError(script_name)) {
		logger.error(script_name)
		next(err);
	}

	executeScript(script_name, req.body)
		.then(function() {
			res.send(200);
		})
		.catch(function(err) {
			logger.error(err);
			next(err);
		});
}

module.exports.hasher = function(cwd) {
  return encodeURIComponent(encryption.encrypt(cwd || process.cwd()));
}