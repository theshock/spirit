exports['Controllers.Index'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Controller'),

		indexAction : function () {
			this.exit('(Index) index action');
		}
	});
}