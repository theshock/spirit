
exports['Orm.Database'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Query.Database'),
		model   : function (name, id) {
			return spirit
				.factory('Models.' + (name.ucfirst()), id)
				.setDatabase(this)
				.setModelName(name);
		}
	});
};