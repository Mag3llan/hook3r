var restify = require('restify');
var logger = require('restify-logger');
var _ = require('lodash');
var path = require('path');
var crypto = require('crypto');
var assert = require('assert');
var fs = require('fs');
var child_process = require('child_process');

var app = restify.createServer({
  name: 'hooker',
  version: '1.0.0'
});

// You can use the skip parameter to skip some requests
app.use(logger('custom', {
  skip: function (req) {
    return process.env.NODE_ENV === "test" || req.method === "OPTIONS" || req.url === "/status";
  }
}));

app.use(restify.bodyParser());

var current_dir = process.env['PWD'];

var base_dir = _.get(hooker, 'hooks_dir', current_dir || './hooks');
var decryptionKey = _.get(hooker, 'hooks_secret', process.env.HOOKS_DIR || 'VamosPumas');
var hooker = require(path.join(base_dir, './hooker.json'));

console.log(hooker);

app.post('/:hash', function(req, res, next) {
  if (!req.params.hash) {
    console.warn('Missing hash, request not authorized', req.params.hash)
    return res.send(401);
  }

  var script_name = null;
  try {

    script_name = decrypt(req.params.hash, decryptionKey);

  } catch (err) {

    if (err + ''.match(/DecipherFinal/)) {
      console.warn('could not decipher', req.params.hash)
      return res.send(401);
    } else {
      return next(err)
    }

  }

  var script_path = path.join(base_dir + '/hooks/', script_name);

  fs.exists(script_path, function(exists) {
    if (!exists) {
      console.warn('Script does not exist!', script_path);
      return res.send(404);
    }

    var env = _.object(_.map(hooker[script_name].paths, function(env_name, valuePath) {
        return [env_name, _.get(req.body, valuePath)];
    }));


    var options = {
      env: _.merge(env, hooker[script_name].env)
    };

    console.log(options);

    child_process.exec('source ' + script_path, options, function(err, stdout, stderr) {
      if (err) {
        //console.warn(stderr);
        console.log(err);
        return next(err);
      };
        
      console.log(stdout);
      console.log('Script %s completed...', script_name);
    });

    res.send(200);

  });

});

module.exports = app;


var ALGORITHM = 'cast5-cbc'
var FORMAT = 'base64'

var encrypt = module.exports.encrypt = function(id, password) {
  assert.ok(id)
  assert.ok(password)
  var projectCipher = crypto.createCipher(ALGORITHM, password)
  var final = projectCipher.update(id, 'utf8', FORMAT)
  final += projectCipher.final(FORMAT)
  return final
}

var decrypt = module.exports.decrypt = function(encrypted, password) {
  assert.ok(encrypted)
  assert.ok(password)
  var projectDecipher = crypto.createDecipher(ALGORITHM, password)
  var final = projectDecipher.update(encrypted, FORMAT, 'utf8')
  final += projectDecipher.final('utf8')
  return final
}

module.exports.hashCwd = function(cwd) {
  return encodeURIComponent(encrypt(cwd || process.cwd(),  decryptionKey))
}


