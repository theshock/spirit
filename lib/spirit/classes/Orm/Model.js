
exports['Orm.Model'] = function (spirit) {
	return new Class({
		Extends   : spirit.load('Query.Builder'),

		belongsTo : {},
		hasOne    : {},
		hasMany   : {},

		_modelName : null,
		setModelName : function (modelName) {
			this._modelName = modelName;
			return this;
		},

		getModelName : function () {
			return this._modelName;
		},

		getTableName : function () {
			return this.getModelName() + 's';
		},

		_values : {},
		setValues : function (values) {
			this._values = values;
			return this;
		},
		get : function (index) {
			return this._values[index];
		},

		findAll : function (fn) {
			//console.log(
			this
				.select('*')
				.from({table:this.getTableName(), as: this.getModelName()})
				//.getQuery())
				.run({ structured : true }, function (err, rows) {
					if (err) throw err;

					var selfs = [];
					var model = this.getModelName();
					for (var i = 0; i < rows.length; i++) {
						var self = this.database.model(model);
						var values = rows[i][model];
						for (var m in rows[i]) {
							if (m != model) {
								values[m] = this.database.model(
									this.belongsTo[m]
								).setValues(rows[i][m]);
							}
						}
						self.setValues(values);
						selfs.push(self);
					}
					fn(selfs);
				}.bind(this));
			return this;
		},

		includes : function (model) {
			var table = this.belongsTo[model];
			if (table) {
				table = (table + 's').lcfirst();
				return this.leftJoin({
					table  :  table, as : model,
					equals : [this.getModelName() + '.author_id', model + '.id']
				});
			} else {
				console.log('Unknown include «' + model + '»');
				throw 'Spirit.Orm.Exception';
			}
		}
	});
};