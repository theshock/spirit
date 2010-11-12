
exports['Models.User'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Orm.Model'),

		hasMany : { 'comments' : 'Comment' }

	});
};