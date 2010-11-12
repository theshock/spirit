var libPath = __dirname + '/../../lib';

require(libPath + '/MooTools').apply(GLOBAL);

var spirit = require(libPath + '/spirit/spirit')
	.createSpirit(__dirname, libPath);

spirit.createRouter()
	.addRoutes(
		{ route   : "</article-:D/page-:D>"
		, contr   : 'Man.Route:articleWithPage'
		, argsMap : ['id', 'page']
		},
		{ route   : "</article-:D>"
		, contr   : 'Man.Route:article'
		, argsMap : ['id']
		},
		{ route   : "</~:W>"
		, contr   : 'Man.Route:user'
		},
		{ route   : "</hash-:H>"
		, contr   : 'Man.Route:hash'
		},
		{ route   : "</compare/(:P)/(:P)>"
		, contr   : 'Man.Route:compare'
		}
	);

spirit.listen("127.0.0.1:8124");

var db = spirit.factory('Query.Database');
var q  = db
	.query()
	.select('*');

[
	['table.field'],
	['table.field', null],
	['table.field', '!', null],
	['('],
	['table.field', 142],
	['table.field', 'string'],
	['or'],
	['table.field', '>=', 18],
	['('],
	['table.field', '%.%', 'tester'],
	['table.field', 'like', 'tester'],
	['table.field', 'not', '%.%', 'tester'],
	[')'],
	['table.field', 'not', 'like', 'tes"ter'],
	['and'],
	['table.field', [1,2,3]],
	['table.field', 'not', [1,2,3]],
	['table.field', /(.*)/],
	['table.field', 'not', /(.*)/]
].each(function (c) {
	q.where(c);
});

console.log(q.getQuery());