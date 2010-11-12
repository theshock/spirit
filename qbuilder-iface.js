

var builder = new QueryBuilder;

builder
	.select('*', { expr : 'count(test)'} )
	.from({ table : 'Topics', as : 'Topic' })
	.join({ type: 'left',
		table : 'Posts', as : 'Post',
		on    : ['Topic.firstPostId', 'FirstPost.id']
	})
	.join({ type: 'left',
		table : 'User', as : 'FirstAuthor',
		on    : ['FirstPost.authorId', 'FirstAuthor.id']
	})
	.join({ type: 'left',
		table : 'Posts', as : 'Post',
		on    : ['Topic.lastPostId', 'LastPost.id']
	})
	.join({ type: 'left',
		table : 'User', as : 'LastAuthor',
		on    : ['LastPost.authorId', 'LastAuthor.id']
	})
	.where('LastPost.text', '%.%', '21345')
	.where('LastPost.text', '%.', '21345')
	.order('LastAuthor.id', builder.DESC)
	.group('Test.test')
	.limit({ page : 6, offset : 25 });

builder.insert('Posts')
	.fields('id', 'content', 'authorId')
	.values(null, 'one', 25)
	.values(null, 'two',  4)
	.set({
		'id' : null,
		'content' : 'one',
		'authorId' : 25
	})

builder.update('Posts')
	.set({
		'id' : null,
		'content' : 'one',
		'authorId' : 25
	})
	.where(condition);

whereExamples
	.where(field) // field is not null
	.where(field, null ) // field is null
	.where(field, value) // field = value
	// like
	.where(field, 'like', value) // field like value
	.where(field, '.'   , value) // field like value
	.where(field, '.%'  , value) // field like value%
	.where(field, '%.'  , value) // field like %value
	.where(field, '%.%' , value) // field like %value%

	.where(field, 'not like', value) // field not like valueґ
	.where(field, 'not .'   , value) // field not like value
	.where(field, 'not .%'  , value) // field not like value%
	.where(field, 'not %.'  , value) // field not like %value
	.where(field, 'not %.%' , value) // field not like %value%
	// other
	.where(field,        [1,2,"x"]) // field in (1,2,3)
	.where(field, 'not', [1,2,"x"]) // field not in (1,2,3)
	.where(field,        /.*/) // field regexp /*/
	.where(field, 'not', /.*/) // field not regexp /*/
	.where(field, oper, value) // field oper value
	;