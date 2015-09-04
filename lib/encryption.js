var crypto = require('crypto')
var assert = require('assert')
var _ = require('lodash');
var logger = require('lugg')('encryption');

var ALGORITHM = 'cast5-cbc'
var FORMAT = 'base64'

var default_secret = 'changeme!!'
var HOOKER_SECRET = _.get(process.env, 'HOOKER_SECRET', default_secret)

if (HOOKER_SECRET == default_secret) {
	logger.warn('Please update your private key. Running on with \'%s\'', default_secret)
}

module.exports.encrypt = function(id) {
  assert.ok(id)
  var projectCipher = crypto.createCipher(ALGORITHM, HOOKER_SECRET)
  var final = projectCipher.update(id, 'utf8', FORMAT)
  final += projectCipher.final(FORMAT)
  return final
}

module.exports.decrypt = function(encrypted) {
  assert.ok(encrypted)
  console.log(HOOKER_SECRET)
  var projectDecipher = crypto.createDecipher(ALGORITHM, HOOKER_SECRET)
  var final = projectDecipher.update(encrypted, FORMAT, 'utf8')
  final += projectDecipher.final('utf8')
  return final
}

