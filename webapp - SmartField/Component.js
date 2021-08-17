sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("doug.smartControls.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector(sap.ui.require.toUrl("doug/smartControls/lrep/component-test-changes.json"));
			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});

});
