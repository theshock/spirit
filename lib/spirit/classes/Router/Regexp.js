exports['Router.Regexp'] = function (spirit) {
	return new Class({
		initialize : function (routerHelper) {
			this.routerHelper = routerHelper;
		},

		route : function (url) {
			for (var i = 0; i < this.routes.length; i++) {
				var route  = this.routes[i];
				route.regexp.lastIndex = 0;
				var result = route.regexp.exec(url);
				if (result) {
					return {
						contr  : this.routerHelper.createController(route.contr.name),
						method : route.contr.method,
						args   : this.regexpRouteArgs(result, route.argsMap)
					};
				}
			}
			return false;
		},

		routes : [],
		addRoute : function (route, controller, argsMap) {
			this.routes.push({
				regexp  : this.regexpRoute(route),
				contr   : this.regexpContr(controller),
				argsMap : argsMap || []
			});
			return this;
		},

		addRoutes : function () {
			for (var i = 0; i < arguments.length; i++) {
				var route = arguments[i];
				if (route.route) {
					this.addRoute(
						route.route,
						route.contr || route.controller,
						route.argsMap
					);
				} else {
					this.addRoute.apply(this, route);
				}
			}
			return this;
		},

		regexpContr : function (string) {
			var parts = string.split(':');
			var method = parts.length > 0 ? parts[1] + 'Action' : 'indexAction';
			var contr  = 'Controllers.' + parts[0];
			if (typeof this.routerHelper.createController(contr)[method] != 'function') {
				console.log('Error: No method «' + method + '» in controller «' + contr + '»');
				throw 'Spirit.Router.NoMethod.Exception';
			}
			return {
				name   : contr,
				method : method
			};
		},


		regexpRoute : function (route) {
			var re = new RegExp();
			re.compile(this.prepareRegexp(route), 'ig');
			return re;
		},
		replaces : {
			A : '([a-z]+)',
			D : '([0-9]+)',
			H : '([0-9a-f]+)',
			W : '([0-9a-z]+)',
		},
		prepareRegexp : function (route) {
			return route
				.escapeRegExp()
				.replace(/>$/, '$')
				.replace(/^</, '^')
				.replace(/:([ADHW])/g, function ($0, $1) {
					return this.replaces[$1];
				}.bind(this));
		},

		regexpRouteArgs : function (result, argsMap) {
			var map  = argsMap && argsMap.length;
			var args = map ? {} : [];
			// removing first elem (full url), index & input properties
			for (var i = 1; i < result.length; i++) {
				if (map) {
					if (argsMap[i - 1]) {
						args[argsMap[i - 1]] = result[i];
					}
				} else {
					args.push(result[i]);
				}
			}
			return args;
		},
	});
};