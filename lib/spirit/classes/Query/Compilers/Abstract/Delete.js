
exports['Query.Compilers.Abstract.Delete'] = function (spirit) {
	return new Class({
		compileDelete : function () {
			var data = this.driver.data;
			return 'DELETE FROM '   +
				this.tableAs(data.table) +
				this.compileJoins() +
				this.compileWhere() +
				this.compileGroup() +
				this.compileOrder() +
				this.compileLimit();
		},
	})
};