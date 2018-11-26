const loaderUtils = require('loader-utils');

module.exports = function(content, map, meta) {
	const options = loaderUtils.getOptions(this);
	console.log(content, options);
	return content;
};