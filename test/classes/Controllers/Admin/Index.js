exports['Controllers.Admin.Index'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Controller'),

		indexAction : function () {
			this.exit('(Admin.Index) index action');
		}
	});
}