const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const schema = require('./options.json');

module.exports = function(content, map, meta) {
	const options = loaderUtils.getOptions(this) || null;

	let filePath = this.resourcePath;
	let fileName = filePath.slice(filePath.lastIndexOf('/'));

	if (!options) {
		this.emitFile(fileName, content);
		return content;
	}

	validateOptions(schema, options, 'JSON loader');

	let contentObj = JSON.parse(content);

	for (key in contentObj) {
		let val = contentObj[key];
		if ((options.invertBool)&&(typeof val === 'boolean')) {
			contentObj[key] = !val;
		}
		if ((options.toUppercase)&&(typeof val === 'string')) {
			contentObj[key] = val.toUpperCase();
		}
	}

	let result = JSON.stringify(contentObj);

	this.emitFile(fileName, result);
	return result;
};