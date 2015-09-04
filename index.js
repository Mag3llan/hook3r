var lugg = require('lugg');

module.exports = function(options) {
	if (!options)
		lugg.init({
			level: 'debug'
		});
	else 
		lugg.init(options);



	return require('./lib/hooker');
}