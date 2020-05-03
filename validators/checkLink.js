const validator = require('validator');

module.exports.checkLink = (picLink) => validator.isURL(picLink);
