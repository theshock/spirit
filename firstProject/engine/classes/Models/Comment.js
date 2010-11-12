
exports['Models.Comment'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Orm.Model'),

		belongsTo : { 'author' : 'User' }

	});
};