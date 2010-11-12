
exports['Query.Compilers.Abstract.Where'] = function (spirit) {
	return new Class({
		whereMode : 'and',
		compileWhere : function () {
			var conds = this.driver.data.where;
			var brackets = 0;
			var where = '';
			var lastIsValue = false;
			for (var i = 0; i < conds.length; i++) {
				var c = conds[i];
				if (c === 'and' || c === 'or') {
					this.whereMode = c.toLowerCase();
					continue;
				}
				if (c != ')' && lastIsValue) {
					where += ' ' + this.whereMode;
				}
				if (c == '(' || c == ')') {
					if (c == ')' && brackets <= 0)  {
						console.log('To many closed brackets in Query.Compilers.Abstract.General[parseWhere]');
						throw 'Spirit.Query.Compile.Exception';
					}
					lastIsValue = c == ')';
					where += ' ' + c + '\n';
					brackets += c == ')' ? -1 : 1;
					continue;
				}
				lastIsValue =  true;
				where += ' ' + this.parseWhereCondition(c) + '\n';
			}
			while (brackets--) where += ')';
			return where;
		},
		parseWhereCondition : function (c) {
			var field = this.wrapWithGraves(c.shift());
			if (!c.length) {
				return field + ' is not null';
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
				return field + ' is' + not + ' null';
			}
			return null;
		},
		tryWhereArray : function (field, value, not) {
			if (value instanceof Array) {  // .where(field, [1,2,3])
				return field + not + ' in (' + value.map(function (item) {
					return this.wrapQuotes(item);
				}.bind(this)).join(', ') + ')';
			}
			return null;
		},
		tryWhereRegexp : function (field, value, not) {
			if (value instanceof RegExp) {  // .where(field, /123/)
				var regexp = value.toString();
				regexp = regexp.substr(1, regexp.length - 2);
				return field + not + ' regexp ' + this.wrapQuotes(regexp);
			}
			return null;
		},
		tryWhereLike : function (field, oper, value, not) {
			if (['like', '.', '.%', '%.', '%.%'].contains(oper)) { // .where(field, '%.%', 123)
				var like = (oper == 'like') ? this.wrapQuotes(value) :
					this.wrapQuotes(oper.replace('.', value));
				return field + not + ' like ' + like;
			}
			return null;
		},
		tryWhereOperator : function (field, oper, value) {
			return field + ' ' + oper + ' ' + this.wrapQuotes(value);
		}

	})
};