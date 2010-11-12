
exports['Query.Builder'] = function (spirit) {
	return new Class({
		database : null,
		conn     : null,
		driver   : null,
		setDatabase : function (database) {
			this.database  = database;
			this.conn = database.conn;

			this.driver = spirit.factory(
				this.getDriverName(), this
			);
			return this;
		},

		run : function (cfg, fn) {
			if (arguments.length == 1) {
				fn  = cfg;
				cfg = null;
			}
			var query = this.getQuery();
			console.log('\n--------------------\nQuery.Builder runs query:\n\n' + query + '\n--------------------\n');
			this.conn.query(query, function (err, res) {
				if (err) {
					fn(err, null);
				} else {
					var fetchFn = function (err, rows) {
						fn(err, rows);
						res.freeSync();
					};
					cfg ? res.fetchAll(cfg, fetchFn) : res.fetchAll(fetchFn);
				}
			});
			return this;
		},

		DESC : true,
		ASC  : false,

		insert : function (intoTable) {
			return this.callDriver('insert', arguments);
		},
		update : function (table) {
			return this.callDriver('update', arguments);
		},
		remove : function (fromTable) {
			return this.callDriver('remove', arguments);
		},
		save : function (inTable) {
			return this.callDriver('save', arguments);
		},
		updateIf : function (field) {
			return this.callDriver('updateIf', arguments);
		},
		fields : function (fields) {
			return this.callDriver('fields', arguments);
		},
		values : function (values) {
			return this.callDriver('values', arguments);
		},
		set : function (set) {
			return this.callDriver('set', arguments);
		},
		select : function (fields) {
			return this.callDriver('select', arguments);
		},
		from : function (table) {
			return this.callDriver('from', arguments);
		},
		join : function (join) {
			return this.callDriver('join', arguments);
		},
		leftJoin : function (join) {
			return this.callDriver('leftJoin', arguments);
		},
		rightJoin : function (join) {
			return this.callDriver('rightJoin', arguments);
		},
		where : function () {
			return this.callDriver('where', arguments);
		},
		order : function (by, desc) {
			return this.callDriver('order', arguments);
		},
		group : function (by) {
			return this.callDriver('group', arguments);
		},
		limit : function (limit) {
			return this.callDriver('limit', arguments);
		},
		getQuery : function () {
			return this.driver.getQuery();
		},

		// private
		getDatabaseName : function () {
			return this.database.engine.ucfirst();
		},
		getDriverName : function () {
			return 'Query.Drivers.' + this.getDatabaseName();
		},
		callDriver : function (method, args) {
			this.driver[method].apply(this.driver, args);
			return this;
		}
	});
};