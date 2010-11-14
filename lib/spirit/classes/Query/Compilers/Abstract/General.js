
exports['Query.Compilers.Abstract.General'] = function (spirit) {
	return new Class({
		Implements : [
			spirit.load('Query.Compilers.Abstract.Delete'),
			spirit.load('Query.Compilers.Abstract.Save'),
			spirit.load('Query.Compilers.Abstract.Select'),
			spirit.load('Query.Compilers.Abstract.Where')
		],
		initialize : function (driver) {
			this.driver  = driver;
			this.builder = driver.builder;
		},
		escape : function (value) {
			return this.builder.conn.escapeSync(value);
		},
		prefixTable : function (tableName) {
			var p = this.builder.database.prefix;
			return (p ? p + '_' : p) + tableName;
		},
		wrapWithGraves : function (field) {
			if (field.expr) return field.expr;
			
			var parts = field.split('.');
			if (parts.length == 2) {
				parts[0] = this.prefixTable(parts[0]);
			}
			return parts.map(function (item) {
				return item == '*' ? item : '`' + item + '`';
			}).join('.');
		},
		wrapWithQuotes : function (value) {
			return value === null ? 'null' :
				value.field ? this.wrapWithGraves(value.field) :
				value.expr ? value.expr :
				!isNaN(+value) ? Number(+value) :
				'"' + this.escape('' + value) + '"';
		},
		compile : function () {
			switch (this.driver.type.toUpperCase()) {
				case 'SELECT':return this.compileSelect();
				case 'DELETE':return this.compileDelete();
				case 'INSERT':
				case 'UPDATE':
				case 'SAVE':
					return this.compileSave();
			}
			console.log('Unknown query type in Query.Compilers.Abstract.General');
			throw 'Spirit.Query.Builder.Exception';
		},
		tableAs : function (object) {
			if (object.table instanceof spirit.load('Query.Builder')) {
				return object.table.getQuery();
			}
			if (typeof object == 'string') return this.wrapWithGraves(object);

			var r = '`' + this.prefixTable(object.table) + '` AS '
			      + '`' + (object.as || object.table) + '`';
			return r;
		},

		compileJoins : function () {
			var joins = this.driver.data.joins;
			var result = '';
			for (var i = 0; i < joins.length; i++) {
				var j = joins[i];
				
				var where =
					j.using ? '\n  USING ' + this.wrapWithGraves(j.using) + '\n' :
					j.on    ? '\n  ON '    + this.parseWhereArgument(j.on) : (
						'\n  ON ' + this.wrapWithGraves(j.equals[0]) +
						' = ' + this.wrapWithGraves(j.equals[1])
					);

				result += '\n' + j.type.toUpperCase() + ' JOIN '
					+ this.tableAs(j) + ' ' + where;
				
				this.whereLastIsValue = false;
			}
			return result;
		},
		compileGroup : function () {
			var group = this.driver.data.group;
			if (!group) return '';
			return '\nGROUP BY ' + this.wrapWithGraves(group);
		},
		compileOrder : function () {
			var order  = this.driver.data.order;
			var result = '';
			for (var i = 0; i < order.length; i++) {
				result += '\nORDER BY ' +
					this.wrapWithGraves(order[i][0]) +
					(order[i][1] ? ' DESC' : ' ASC');
			}
			return result;
		},
		compileLimit : function () {
			var limit = this.driver.data.limit;
			if (!limit) return '';
			
			if (typeof limit == 'number') {
				limit = {from : 0, offset : limit};
			}
			if (limit.page) limit.from   = (limit.page - 1) * limit.offset;
			if (limit.to  ) limit.offset =  limit.to - limit.from;
			return '\nLIMIT ' + limit.from + ', ' + limit.offset;
		}
	})
};