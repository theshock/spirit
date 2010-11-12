
exports['Query.Compilers.Mysql'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Query.Compilers.Abstract.General')
	})
};