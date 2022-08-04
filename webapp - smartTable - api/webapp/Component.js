sap.ui.define([
	'sap/ui/core/UIComponent' 
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("webapp.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {			
			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});

});
