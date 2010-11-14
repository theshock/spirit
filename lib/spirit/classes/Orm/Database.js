
exports['Orm.Database'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Query.Database'),
		model   : function (name, id) {
			return spirit
				.factory('Orm.Finder')
				.setDatabase(this)
				.setModelName(name);
		}
	});
};