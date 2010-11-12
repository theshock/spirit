
exports['Router.Regexp'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Router.Regexp', true),
		prepareRegexp : function (route) {
			return this.parent(route)
				.replace(/:P/g, '([0-9a-z._\\/-]+)');
		}
	});
};