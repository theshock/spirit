exports['Controller'] = function (spirit) {
	return new Class({
		exit : function (msg) {
			this.response.writeHead(200, {'Content-Type': 'text/plain'});
			this.response.end(msg);
		}
	});
};