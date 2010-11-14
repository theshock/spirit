
exports['createSpirit'] = function (projectPath, libPath) {
	return new Spirit(projectPath, libPath);
};

var fs = require('fs');

var loaded = {
	spirit  : {},
	classes : {},
	libs    : {}
};

var load = function (path, className) {
	path += (className.replace(/\./g, '/'));
	try {
		var data = require(path);
	} catch (e) {
		return null;
	}
	return data[className](this);
};

var Spirit = new Class({
	Binds: ['hit', 'load'],
	initialize : function (projectPath, libPath) {
		this.projectPath = projectPath.trim();
		this.libPath     = fs.realpathSync(libPath);
		this.requirePath = this.projectPath + '/classes/';
		this.spiritRequirePath = this.libPath + '/spirit/classes/';
		require(this.libPath + '/spirit/utils.js');
	},
	createRouter : function () {
		var Router = this.load('Router');
		var router = new Router();
		router.spirit = this;
		this.router = router;
		router.init();
		return router;
	},
	factory : function (className, arg) {
		var cl = this.load(className);
		return arguments.length == 2 ? new cl(arg) : new cl();
	},
	load : function (className, fromSpirit) {
		var lc = loaded.classes, ls = loaded.spirit, loadedClass;
		if (!fromSpirit) {
			if (lc[className]) {
				return lc[className];
			}
			
			loadedClass = load.call(this, this.requirePath, className);
			lc[className] = loadedClass;
		}
		if ((fromSpirit || !lc[className]) && !ls[className]) {
			loadedClass = load.call(this, this.spiritRequirePath, className);
			ls[className] = loadedClass;
		}
		
		var cl = (!fromSpirit && lc[className]) || ls[className];
		if (!cl) {
			console.log('No class «' + className + '», fromSpirit: ' + (fromSpirit?'on':'off'));
			throw 'Spirit.LoadClass.Exception';
		}
		return cl;
	},
	loadLib : function (libName) {
		var ll = loaded.libs;
		if (!ll[libName]) {
			var path = this.libPath + '/' + libName + '/' + libName;
			var load = require(path);
			ll[libName] = load;
		}
		return ll[libName];
	},
	getClassName : function (path, load) {
		var className = path
			.substr(this.requirePath.length)
			.replace(/\.js$/, '')
			.split('/')
			.map(function (item) {
				return item.ucfirst();
			})
			.join('.');
		return load ? this.load(className) : className;
	},
	hit : function (req, res) {
		this.router.hit(req, res);
	},
	listen : function (port, url) {
		if (arguments.length == 1) {
			var parts = port.split(':');
			port = Number(parts[1]);
			url  = parts[0];
		}
		require('http')
			.createServer(this.hit)
			.listen(port, url);
		if (!url.test(/\:\/\//)) {
			url = 'http://' + url;
		}
		console.log('Spirit running at ' + url + ':' + port + '/');
		return this;
	}
});