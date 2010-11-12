
exports['Query.Compilers.Abstract.General'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Query.Compilers.Abstract.Where'),
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
			var parts = field.split('.');
			if (parts.length == 2) {
				parts[0] = this.prefixTable(parts[0]);
			}
			return parts.map(function (item) {
				return item == '*' ? item : '`' + item + '`';
			}).join('.');
		},
		wrapQuotes : function (value) {
			return value.expr ? value.expr :
				!isNaN(+value) ? Number(+value) :
				'"' + this.escape('' + value) + '"';
		},
		compile : function () {
			return this.compileWhere();
		}
	})
};