
// Function.extend({ });

String.extend({
	uncountable : [
		'access', 'advice', 'art',
		'baggage', 'dances', 'equipment',
		'fish', 'fuel', 'furniture',
		'heat', 'honey', 'homework',
		'impatience', 'information',
		'knowledge', 'luggage',
		'money', 'music', 'news',
		'patience', 'progress', 'pollution',
		'research', 'rice',
		'sand', 'series', 'sheep',
		'sms', 'species', 'staff',
		'toothpaste', 'traffic',
		'understanding',
		'water', 'weather', 'work',
	],

	irregular : {
		child   : 'children',
		clothes : 'clothing',
		man     : 'men',
		movie   : 'movies',
		person  : 'people',
		woman   : 'women',
		mouse   : 'mice',
		goose   : 'geese',
		ox      : 'oxen',
		leaf    : 'leaves',
		course  : 'courses',
		size    : 'sizes',
		was     : 'were',
		is      : 'are',
		verse   : 'verses',
	}
});

var inflectorCache = {};

String.implement({
	htmlEscape: function () {
		return this.replace(/[<'&">]/g, function (symb) {
			return {
				'&'  : '&amp;',
				'\'' : '&#039;',
				'\"' : '&quot;',
				'<'  : '&lt;',
				'>'  : '&gt;'
			}[symb];
		});
	},
	ucfirst : function () {
		return this.charAt(0).toUpperCase() + this.substr(1)
	},
	lcfirst : function () {
		return this.charAt(0).toLowerCase() + this.substr(1)
	},
	cutTail : function (length) {
		return this.substr(0, this.length - (length || 1));
	},
	tail : function (length) {
		return this.substr(this.length - (length || 1));
	},
	isUncountable : function () {
		return String.uncountable.contains(this.toLowerCase());
	},
	isIrregular : function () {
		var str = this.toLowerCase(), ir = String.irregular;
		return str in ir || Object.contains(ir, str);
	},
	singular : function () {
		var irr;
		var cache = inflectorCache;
		var str   = this.trim().toLowerCase();
		var key   = 'singular.' + str;

		if (key in cache) return cache[key];

		if ( str.isUncountable() ) {
			// is uncountable, do nothing
		} else if ( str.isIrregular() ) {
			str = Object.keyOf(String.irregular, str) || str;
		} else if ( str.test(/us$/) ) {
			// Already singular, do nothing
		} else if ( str.test(/[sxz]es$/) || str.test(/[^aeioudgkprt]hes$/) ) {
			// Remove "es"
			str = str.cutTail(2);
		} else if ( str.test(/[^aeiou]ies$/) ) {
			// Replace "ies" with "y"
			str = str.cutTail(3) + 'y';
		} else if ( str.tail() == 's' && str.tail(2) != 'ss' ) {
			// Remove singular "s"
			str = str.cutTail();
		}
		return (cache[key] = str);
	},
	plural : function () {
		var cache = inflectorCache;
		var str   = this.trim().toLowerCase();
		var key   = 'plural.' + str;


		if (key in cache) return cache[key];

		if ( str.isUncountable() ) {
			// is uncountable, do nothing
		} else if ( str.isIrregular() ) {
			str = String.irregular[str] || str;
		} else if ( str.test(/[sxz]$/) || str.test(/[^aeioudgkprt]h$/) ) {
			str += 'es';
		} else if ( str.test(/[^aeiou]y$/) ) {
			// Change "y" to "ies"
			str = str.cutTail() + 'ies';
		} else {
			str += 's';
		}

		// Set the cache and return
		return (cache[key] = str);
	},

	camelCase: function(){
		return this.replace(/[_-]\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	underscore: function(){
		return this.lcfirst().replace(/[A-Z]/g, function(match){
			return ('_' + match.charAt(1).toLowerCase());
		});
	}
});

Array.implement({
	collect : function (index) {
		var l = this.length,
		    result = [];
		for (var i = 0; i < l; i++) if (i in this) {
			result.push(this[i][index]);
		}
		return result;
	}
});

Object.extend({
	path : function (object, path, def, delimeter) {
		if (path in object) return object[path];
		
		var keys = path.split(delimeter || '.');

		do {
			var key = keys.shift();

			if (key && key in object) {
				object = object[key];
				if (!keys.length) {
					return object;
				}
			}
		} while (keys.length);

		return def;
	}
})


