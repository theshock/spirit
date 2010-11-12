
exports['Query.Drivers.Abstract'] = function (spirit) {
	// private
	var TYPES = {
		SAVE   : 'save',
		SELECT : 'select',
		INSERT : 'insert',
		UPDATE : 'update',
		DELETE : 'delete'
	};

	function set (driver, values) {
		for (var i in values) {
			driver.data[i] = values[i];
		}
		return driver;
	}
	function pick (args) {
		return (args.length == 1 && args[0] instanceof Array) ?
			args[0] : Array.from(args);
	}
	function first (args) {
		return pick(args)[0];
	}

	return new Class({
		builder : null,
		initialize : function (builder) {
			this.builder = builder;
		},

		type : null,
		data : {
			table  : null,
			select : [],
			joins  : [],
			where  : [],
			order  : [],
			limit  : null,
			group  : null,
			set    : {},
			fields : [],
			values : [],
			updateIf : null
		},

		// save
		insert : function (intoTable) {
			this.type = TYPES.INSERT;
			return set(this, { table : pick(arguments)[0] });
		},
		update : function (table) {
			this.limit(1);
			this.type = TYPES.UPDATE;
			return set(this, { table : pick(arguments)[0] });
		},
		remove : function (fromTable) {
			this.limit(1);
			this.type  = TYPES.DELETE;
			return set(this, { table : pick(arguments)[0] });
		},
		save : function (inTable) {
			this.type = TYPES.SAVE;
			return set(this, { table : pick(arguments)[0] });
		},
		updateIf : function (field) {
			return set(this, { updateIf : first(arguments) });
		},
		fields : function (fields) {
			set(this, { fields : pick(arguments) });
			return this;
		},
		values : function (values) {
			this.data.values.push(pick(arguments));
			return this;
		},
		set : function (set) {
			Object.append(this.data.set, first(arguments));
			return this;
		},

		// load
		select : function (fields) {
			this.type = TYPES.SELECT;
			this.data.select.append(pick(arguments));
			return this;
		},
		from : function (table) {
			return set(this, { table : first(arguments) });
		},

		// joins
		join : function (join) {
			if (!join.type) join.type = 'inner';
			this.data.joins.push(join);
			return this;
		},
		leftJoin : function (join) {
			join.type = 'left';
			return this.join(join);
		},
		rightJoin : function (join) {
			join.type = 'right';
			return this.join(join);
		},

		// conditions
		where : function () {
			this.data.where.push(pick(arguments));
			return this;
		},
		order : function (by, desc) {
			this.data.order.push(pick(arguments));
			return this;
		},
		group : function (by) {
			return set(this, { group : first(arguments) });
		},
		limit : function (limit) {
			return set(this, { limit : first(arguments) });
		},

		getQuery : function () {
			if (!this.type) {
				console.log('No type(select/update/insert/remove/save) setted in Query.Drivers.Abstract');
				throw 'Spirit.Query.Builder.Exception';
			}
			var compiler = 'Query.Compilers.' + this.builder.getDatabaseName();
			return spirit.factory(compiler, this).compile();
		}
	});

};