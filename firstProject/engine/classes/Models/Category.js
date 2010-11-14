
exports['Models.Category'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Orm.Model'),
	}).extend({
		hasOne : { 'topic' : 'Topic' }
	});
};