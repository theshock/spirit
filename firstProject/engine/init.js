var libPath = __dirname + '/../lib';

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
		}
	);

spirit.listen("127.0.0.1:8124");

