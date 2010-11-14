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

// spirit.listen("127.0.0.1:8124");

spirit.db = spirit.factory(
	'Orm.Database', {
		username : 'Shock',
		password : '',
		database : 'nodejs'
	});

spirit.db
	.model('Category')
	.includes('lastTopic')
	.includes('lastTopic.lastComment')
	.includes('lastTopic.lastComment.author')
	.includes('lastTopic.firstComment')
	.includes('lastTopic.firstComment.author')
	.find(function (err, categories) {
		categories.each(function (cat) {
			console.log([
				cat.title,
				cat.topic.title,
				cat.topic.lastComment.id,
				cat.topic.lastComment.author.name,
				cat.topic.firstComment.id,
				cat.topic.firstComment.author.name
			]);
		});
	});