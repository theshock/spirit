
exports['Query.Compilers.Abstract.Where'] = function (spirit) {
	return new Class({
		whereMode : 'AND',
		whereLastIsValue : false,
		compileWhere : function () {
			var where = this.driver.data.where;
			return where.length == 0 ? '' :
				'\nWHERE (\n    ' + this.parseWhere(where) + ')';
		},
		parseWhere : function (conds) {
			var brackets = 0;
			var where = '';
			for (var i = 0; i < conds.length; i++) {
				brackets += {')':-1, '(':1}[conds[i]] || 0;
				if (conds[i] == ')' && brackets <= 0)  {
					console.log('To many closed brackets in Query.Compilers.Abstract.Where[compileWhere]');
					throw 'Spirit.Query.Compile.Exception';
				}
				where += this.parseWhereArgument(conds[i]);
			}
			while (brackets--) where += ')';
			this.whereLastIsValue = false;
			return where;
		},
		parseWhereArgument : function (c) {
			if (c === 'and' || c === 'or') {
				this.whereMode = c.toUpperCase();
				return '';
			}
			var and = (c != ')' && this.whereLastIsValue) ?
				' ' + this.whereMode : '';
				
			if (c == '(' || c == ')') {
				this.whereLastIsValue = (c == ')');
				return and + ' ' + c + '\n';
			}
			this.whereLastIsValue = true;
			return and + ' ' + this.parseWhereCondition(c) + '\n';
		},
		parseWhereCondition : function (c) {
			var field = this.wrapWithGraves(c.shift());
			if (!c.length) {
				return field + ' IS NOT NULL';
			}

			var not = this.checkOpposite(c);
			var value = c[0];

			if (c.length == 1) {
				return 0 ||
					this.tryWhereNull  (field, value, not) ||
					this.tryWhereArray (field, value, not) ||
					this.tryWhereRegexp(field, value, not) ||
					this.tryWhereOperator(field, '=', value);
			}
			var oper = value;
			   value = c[1];
			return this.tryWhereLike(field, oper, value, not)
			    || this.tryWhereOperator(field, oper, value);
		},
		isOpposite : function (value) {
			return value == 'not' || value == '!';
		},
		checkOpposite : function (cond) {
			if (cond.length && this.isOpposite(cond[0])) {
				cond.shift();
				return ' not';
			}
			return '';
		},
		tryWhereNull : function (field, value, not) {
			if (value === null) { // .where(field, null)
				return field + ' IS' + not + ' NULL';
			}
			return null;
		},
		tryWhereArray : function (field, value, not) {
			if (value instanceof Array) {  // .where(field, [1,2,3])
				return field + not + ' IN (' + value.map(function (item) {
					return this.wrapWithQuotes(item);
				}.bind(this)).join(', ') + ')';
			}
			return null;
		},
		tryWhereRegexp : function (field, value, not) {
			if (value instanceof RegExp) {  // .where(field, /123/)
				var regexp = value.toString();
				regexp = regexp.substr(1, regexp.length - 2);
				return field + not + ' REGEXP ' + this.wrapWithQuotes(regexp);
			}
			return null;
		},
		tryWhereLike : function (field, oper, value, not) {
			if (['LIKE', '.', '.%', '%.', '%.%'].contains(oper)) { // .where(field, '%.%', 123)
				var like = (oper == 'LIKE') ? this.wrapWithQuotes(value) :
					this.wrapWithQuotes(oper.replace('.', value));
				return field + not + ' LIKE ' + like;
			}
			return null;
		},
		tryWhereOperator : function (field, oper, value) {
			return field + ' ' + oper + ' ' + this.wrapWithQuotes(value);
		}

	})
};