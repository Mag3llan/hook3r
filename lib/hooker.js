//External Dependencies
var child_process = require('child_process')
var fs = require('fs')
var logger = require('lugg')('hooker');
var Promise = require('bluebird');
var _ = require('lodash')
var path = require('path')

//Internal Dependencies
var encryption = require('./encryption.js')

//Configuration
var CURRENT_WORKING_DIRECTORY = process.env['PWD'];
var DEFAULT_HOOKS_PATH = path.join(CURRENT_WORKING_DIRECTORY, './hooks')

function scriptName(hash) {


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
	console.log(script_name);
	return script_name;
}

function executeScript(script_name, params) {

	var hooker = require(path.join(CURRENT_WORKING_DIRECTORY, './hooker.json'));
	var HOOKS_PATH = _.get(hooker, 'hooks_path', DEFAULT_HOOKS_PATH);
	var script_path = path.join(HOOKS_PATH, script_name)
	logger.debug('Script path: %s', script_path)

	return new Promise(function(resolve, reject) {
		fs.exists(script_path, function(exists) {

			if (!exists) {
				logger.debug('Script not found on %s', script_path)
				reject(new Error('Script not found'))
			}


			var env = _.object(_.map(hooker[script_name].paths, function(env_name, valuePath) {
				return [env_name, _.get(params, valuePath)];
			}));

			logger.debug('Environment variables: %s', env)

			var options = {
				env: _.merge(env, hooker[script_name].env)
			};

			child_process.exec('/usr/bin/env sh ' + script_path, options, function(err, stdout, stderr) {
				logger.debug(stdout);
				if (err) {
					logger.error(err)
					reject(err)
				};

				logger.info('Script [%s] sucessfully executed...', script_name)
			});

			resolve();

		});
	});

}

module.exports.handler = function(req, res, next) {

	var script_name = scriptName(req.params.hash)

	if (_.isError(scriptName)) {
		logger.error(scriptName)
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