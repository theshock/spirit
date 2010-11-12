
exports['Query.Compilers.Abstract.Save'] = function (spirit) {
	return new Class({
		compileUpdate : function () {
			var set = [], data = this.driver.data;
			for (var i in data.set) {
				set.push(this.wrapWithGraves(i) + ' = ' + this.wrapWithQuotes(data.set[i]));
			}
			return 'UPDATE ' + this.tableAs(data.table) +
				' SET \n' + set.join(', ') +
				this.compileJoins() +
				this.compileWhere() +
				this.compileGroup() +
				this.compileOrder() +
				this.compileLimit();
		},
		compileInsert : function () {
			var fields, values, data = this.driver.data;
			
			if (Object.getLength(data.set)) {
				fields =  Object.keys(data.set);
				values = [Object.values(data.set)];
			} else {
				fields = data.fields;
				values = data.values;
			}
			fields = fields.map(function (item) {
				return this.wrapWithGraves(item);
			}.bind(this)).join(', ');

			values = values.map(function (row) {
				return row.map(function (item) {
					return this.wrapWithQuotes(item);
				}.bind(this)).join(',');
			}.bind(this)).join('),\n(');

			return 'INSERT INTO ' + this.tableAs(data.table) +
				' (' + fields + ')' +
				' VALUES \n(' + values + ')';
		},
		compileSave : function () {
			var data = this.driver.data;
			var type = this.driver.type.toUpperCase();
			if (type == 'SAVE') {
				var updateIf = data.updateIf || 'id';
				if (data.set && data.set[updateIf]) {
					this.driver.limit(1)
						.where(updateIf, data.set[updateIf]);
					delete data.set[updateIf];
					type = 'UPDATE';
				} else {
					type = 'INSERT';
				}
			}

			if (type == 'INSERT') return this.compileInsert();
			if (type == 'UPDATE') return this.compileUpdate();
			console.log('Unknown query type in Query.Compilers.Abstract.Save[compileSave]');
			throw 'Spirit.Query.Builder.Exception';
		},
	})
};