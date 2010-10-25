exports['Controllers.Users'] = function (spirit) {
	return new Class({
		Extends : spirit.load('Controller'),
		
		indexAction : function () {
			this.exit('(Users) index action');
		},
		loginAction : function () {
			this.exit('(Users) login action');
		},
		registerAction : function () {
			this.exit('(Users) register action');
		},
		logoutAction : function () {
			this.exit('(Users) logout action');
		}
	});
}