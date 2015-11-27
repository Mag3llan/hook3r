var crypto = require('crypto')
var logger = require('lugg')('encryption')
var _ = require('lodash')

var ALGORITHM = 'cast5-cbc'
var FORMAT = 'base64'


function encrypt(insecureValue, secret) {
  var projectCipher = crypto.createCipher(ALGORITHM, secret)
  var final = projectCipher.update(insecureValue, 'utf8', FORMAT)
  final += projectCipher.final(FORMAT)
  return final
}

 function decrypt(secureValue, secret) {
  var projectDecipher = crypto.createDecipher(ALGORITHM, secret)
  var final = projectDecipher.update(secureValue, FORMAT, 'utf8')
  final += projectDecipher.final('utf8')
  return final
}


module.exports.fileNameFromHash = function(hash, secret) {
  // If no hash then request is not authorised
  if (_.isEmpty(hash)) {
    throw new Error('Script name hash not available');
  }

  return decrypt(hash, secret);
}

module.exports.hashFromFileName = function(fileName, secret) {
  if (_.isEmpty(fileName)) {
    throw new Error('Missing file name');
  }

  var securedValue = encrypt(fileName, secret);
  return encodeURIComponent(securedValue);
}


