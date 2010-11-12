
exports['Query.Database'] = function (spirit) {
	return new Class({
		conn   : null,
		engine : 'mysql',
		prefix : '',
		initialize : function (config) {
			config = this.defaultConfig(config);
			
			this.engine = config.engine;
			this.prefix = config.prefix;
			this.connect(config);
		},
		defaultConfig : function (config) {
			return Object.merge({
				prefix   : '',
				engine   : 'mysql',
				hostname : 'localhost',
				password : ''
			}, config);
		},
		connect : function (cfg) {
			var conn = this.conn = spirit.loadLib('mysql-libmysqlclient').createConnectionSync();
			conn.connectSync(cfg.hostname, cfg.username, cfg.password, cfg.database);
			if (!conn.connectedSync()) {
				console.log("Connection error " + conn.connectErrno + ": " + conn.connectError);
				throw 'Spirit.Database.Connect.Exception';
			}
		},
		query : function () {
			return spirit.factory('Query.Builder').setDatabase(this);
		}
	});
};