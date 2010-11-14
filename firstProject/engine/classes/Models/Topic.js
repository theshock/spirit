
exports['Models.Topic'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Orm.Model'),
	}).extend({
		belongsTo : {
			'firstComment' : 'Comment',
			'lastComment' : 'Comment',
			'category' : 'Category'
		}
	});
};