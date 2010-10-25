exports['Controllers.Admin.Articles'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Controller'),
		
		indexAction : function () {
			this.exit('(Admin.Articles) index action');
		},
		addAction   : function () {
			this.exit('(Admin.Articles) add action');
		},
		editAction  : function () {
			this.exit('(Admin.Articles) edit action');
		}
	});
};