
exports['Orm.Finder'] = function (spirit) {
	return new Class({
		Extends   : spirit.load('Query.Builder'),

		modelName : null,
		setModelName : function (modelName) {
			this.modelName = modelName;
			return this;
		},

		model : function (modelName) {
			return spirit.load('Models.' + (modelName || this.modelName));
		},

		modelFactory : function (modelName) {
			var model = this.model(modelName);
			return new model;
		},

		table : function (modelName) {
			return (modelName || this.modelName).lcfirst().plural();
		},

		pathToTable : function (path) {
			return path.replace(/\./g, '_');
		},

		prepareTableJoin : function (first, second) {
			return [
				this.pathToTable( first[0]) + '.' + ( first[1].lcfirst()),
				this.pathToTable(second[0]) + '.' + (second[1].lcfirst())
			];
		},

		gatherResultRow : function (row) {
			var model = this.modelFactory();
			Object.merge(model, row[this.modelName.lcfirst()]);

			var keys = Object.keys(row).sort();
			for (var i = 0, l = keys.length; i < l; i++) {
				var path = keys[i].split('_').slice(1);
				if (path.length) {
					var include  = this.getInclude(path.join('.'));
					var subModel = this.modelFactory(include.to);
					Object.merge(subModel, row[keys[i]]);

					var parent = path.length < 2 ? model :
						Object.path(model, path.slice(0, -1).join('.'));
					if (!parent) {
						console.log('Parent for «' + path.join('.') + '» not found in Orm.Finder');
						throw 'Spirit.Orm.Finder.NoParent.Exception';
					}
					parent[include.lastIndex] = subModel;
				}
			}
			return model;
		},

		find : function (fn) {
			var q = this.select('*')
				.from({ table : this.table(), as : this.modelName.lcfirst() });

			for (var i = 0, l = this.includesList.length; i < l; i++) {
				var include = this.includesList[i];
				var has = include.type == 'has';
				q.leftJoin({
					table  : this.table(include.to),
					as     : this.pathToTable(include.toPath),
					equals : this.prepareTableJoin(
						[include.toPath  , has ? include.from + 'Id' : 'id'],
						[include.fromPath, has ? 'id' : include.lastIndex + 'Id']
					)
				});
			}

			this.run({ structured : true }, function (err, rows) {
				if (err) fn(err, null);

				var result = [];
				for (var i = 0, l = rows.length; i < l; i++) if (i in rows) {
					result.push(this.gatherResultRow(rows[i]));
				}

				fn(null, result);
			}.bind(this))

			return this;
		},

		includesList : [],
		includes : function (model) {
			this.includesList.push(
				this.getInclude(model)
			);
			return this;
		},

		getRelation : function (from, to) {
			var model   = this.model(from);
			if (!model) {
				throw 'Spirit.ORM.NoModel.Exception';
			}

			var belongs = (model.belongsTo || {})[to];
			if (!belongs) {
				var has = (model.hasOne || {})[to];
			}
			return belongs || has ? {
				from : from,
				to   : belongs || has,
				type : belongs ? 'belongs' : 'has'
			} : null;
		},

		getInclude : function (modelPath) {
			var parts = modelPath.split('.');
			var modelName = this.modelName;

			for (var i = 0, l = parts.length; i < l; i++) if (i in parts) {
				var last   = (i + 1 == l);
				var relation = this.getRelation(modelName, parts[i]);

				if (relation) {
					if (last) {
						parts.unshift(this.modelName.lcfirst());
						relation.toPath    = parts.join('.');
						relation.lastIndex = parts.pop();
						relation.fromPath  = parts.join('.');
						return relation;
					} else modelName = relation.to;
				}
			}
			console.log('Cant includes «' + modelPath + '» in Orm.Finder');
			throw 'Spirit.Orm.Finder.NoInclude.Exception';
		},
	});
};