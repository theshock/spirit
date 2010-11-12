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



spirit.db = spirit.factory(
	'Orm.Database', {
		username : 'Shock',
		password : '',
		database : 'nodejs'
	});

spirit.db
	.model('comment')
	.includes('author')
	.findAll(function (comments) {
		comments.each(function (comm) {
			console.log(comm.get('id') + '»' + comm.get('author').get('name'));
		});
	});