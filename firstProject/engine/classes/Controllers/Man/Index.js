exports['Controllers.Man.Index'] = function(spirit) {
	return new Class({
		Extends : spirit.load('Controller'),
		
		indexAction : function () {
			this.exit('(Man.Index) index action');
		},
		testAction : function () {
			this.exit('(Man.Index) test action');
		}
	});
}