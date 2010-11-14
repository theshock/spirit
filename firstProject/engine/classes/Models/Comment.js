
exports['Models.Comment'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Orm.Model'),
	}).extend({
		belongsTo : {
			'author' : 'User',
			'topic'  : 'Topic'
		}
	});
};