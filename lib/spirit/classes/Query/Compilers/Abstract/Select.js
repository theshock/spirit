
exports['Query.Compilers.Abstract.Select'] = function (spirit) {
	return new Class({
		compileSelect : function () {
			return 'SELECT ' +
				this.compileSelectFields() +
				this.compileSelectFrom()  +
				this.compileJoins() +
				this.compileWhere() +
				this.compileGroup() +
				this.compileOrder() +
				this.compileLimit();

		},
		compileSelectFields : function () {
			return this.driver.data.select.map(function (item) {
				return this.wrapWithGraves(item);
			}.bind(this)).join(', ');
		},
		compileSelectFrom : function () {
			if (!this.driver.data.table) {
				console.log('Select.from is not setted in Query.Builder');
				throw 'Spirit.Query.Builder.Exception';
			}
			return '\nFROM ' + this.tableAs(this.driver.data.table);
		}
	})
};