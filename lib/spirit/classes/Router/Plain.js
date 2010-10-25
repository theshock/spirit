var url  = require('url');

exports['Router.Plain'] = function (spirit) {
	return new Class({
		initialize : function (routerHelper) {
			this.routerHelper = routerHelper;
		},

		route : function (url) {
			var parts = this.getControllerName(url);

			var controller = this.routerHelper.createController(parts.name);
			var method = 'indexAction';
			if (parts.args.length) {
				var action = parts.args[0].lcfirst();
				if (typeof controller[action + 'Action'] == 'function') {
					method = action + 'Action';
					parts.args.shift();
				}
			}

			return {
				contr  : controller,
				method : method,
				args   : parts.args
			};
		},

		getControllerName : function (url) {
			var controllers = this.routerHelper.controllers;
			var path = this.splitUrl(url);
			var name, args = [];
			do {
				if (!path.length) {
					name = 'Controllers.Index';
					break;
				}

				name = 'Controllers.' + path.join('.') + '.Index';
				if (controllers[name]) break;

				name = 'Controllers.' + path.join('.');
				if (controllers[name]) break;

				args.unshift(path.pop());
			} while (true);

			return {
				name : name,
				args : args
			};
		},

		splitUrl : function (urlForSplit) {
			return url
				.parse(urlForSplit, true)
				.pathname.split('/')
				.filter(function (item) {
					return !!item;
				})
				.map(function (item) {
					return item.ucfirst();
				});
		},
	});
};