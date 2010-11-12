
exports['Query.Database'] = function (spirit) {
	return new Class({
		conn   : null,
		engine : 'mysql',
		prefix : '',
		initialize : function (config) {
			config = Object.merge({
				prefix   : '',
				engine   : 'mysql',
				host     : 'localhost',
				password : ''
			}, config);
			this.engine = config.engine;
			this.prefix = config.prefix;
			this.conn = spirit.loadLib('mysql-libmysqlclient').createConnectionSync();
			this.conn.connectSync(config.host, config.user, config.password, config.database);
		},
		query : function () {
			return spirit.factory('Query.Builder', this);
		}
	});
};