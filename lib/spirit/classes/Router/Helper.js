var fs   = require('fs');

exports['Router.Helper'] = function (spirit) {
	var RouterPlain  = spirit.load('Router.Plain');
	var RouterRegexp = spirit.load('Router.Regexp');

	return new Class({
		router : null,
		initialize : function (router) {
			this.router = router;
			this.plain  = new RouterPlain(this);
			this.regexp = new RouterRegexp(this);
		},


		route : function (request) {
			var url = request.url;
			return this.regexp.route(url) || this.plain.route(url);
		},
		addRoutes : function () {
			var re = this.regexp;
			re.addRoutes.apply(re, arguments);
		},

		// Requiring controllers
		controllers : {},

		requireAll : function (path) {
			var files = fs.readdirSync(path);
			for (var i = 0; i < files.length; i++) {
				var file = path + '/' + files[i];
				var stat = fs.statSync(file);

				if (stat.isFile()) {
					this.addController(file);
				} else if (stat.isDirectory()) {
					this.requireAll(file);
				}
			}
			this.checkAllIndexActions();
		},
		removeExt : function (file) {
			return file.replace(/\.js$/, '');
		},
		checkAllIndexActions : function () {
			for (var name in this.controllers) {
				var c = this.createController(name);
				if (typeof c.indexAction != 'function') {
					console.log('Error: No indexAction in controller «' + name + '»');
					throw 'Spirit.Router.NoIndexMethod.Exception';
				}
			}
		},
		addController : function (file) {
			var name = this.router.spirit
				.getClassName(file);
			this.controllers[name] = true;
		},

		createController : function (name) {
			if (this.controllers[name]) {
				var contr = this.router.spirit.load(name);
				return new contr;
			} else {
				return false;
			}
		}
	});
};