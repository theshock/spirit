
exports['Query.Drivers.Mysql'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Query.Drivers.Abstract')
	});
};