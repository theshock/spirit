exports['Router'] = function (spirit) {
	var RouterHelper = spirit.load('Router.Helper');

	return new Class({
		init : function () {
			var path = this.spirit.requirePath + 'Controllers';
			this.routerHelper = new RouterHelper(this);
			this.routerHelper.requireAll(path);
		},
		hit : function (request, response) {
			var contrData = this.routerHelper.route(request);
			var contr = contrData.contr;
			contr.spirit   = this.spirit;
			contr.request  = request;
			contr.response = response;

			if (typeof contr.before == 'function') contr.before();
			contr[contrData.method](contrData.args);
			if (typeof contr.after  == 'function') contr.after();
		},
		addRoutes : function () {
			var re = this.routerHelper.regexp;
			re.addRoutes.apply(re, arguments);
		}
	});
};