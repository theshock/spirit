exports['Controllers.Man.Route'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Controller'),

		indexAction : function () {
			this.exit('(Man.Route) index action');
		},
		testAction : function () {
			this.exit('(Man.Route) test action');
		},
		articleWithPageAction : function (args) {
			this.exit('(Man.Route) article #' + args.id + ', page #' + args.page);
		},
		articleAction : function (args) {
			this.exit('(Man.Route) article #' + args.id);
		},
		hashAction : function (args) {
			this.exit('(Man.Route) hash: ' + args[0]);
		},
		userAction : function (args) {
			this.exit('(Man.Route) user: ' + args[0]);
		},
		compareAction : function (args) {
			this.exit('Compare "' + args[0] + '" and "' + args[1] + '"');
		}
	});
};