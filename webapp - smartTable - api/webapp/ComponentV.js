sap.ui.define([
	"./BaseComponent"
], function (BaseComponent) {
	"use strict";

	return BaseComponent.extend("webapp.component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			// call the base component's init function
			BaseComponent.prototype.init.apply(this, arguments);

			// inicializa model
			var oModel = this.initializeModel();
			var that = this;

			oModel.metadataLoaded(true).then(() => {
				if (oModel.getMetaModel()) {
					that.setModel(oModel);
				}
			});

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		getComponentName: function () {
			return "webapp";
		},

		getAnnotations: function () {
			return [
					sap.ui.require.toUrl("webapp/annotations/simpleEnumerations.xml"),
					sap.ui.require.toUrl("webapp/annotations/salesReturnsList.xml"),
					sap.ui.require.toUrl("webapp/annotations/combinedInvoicesList.xml"),
					sap.ui.require.toUrl("webapp/annotations/combinedInvoicesSales.xml"),
					sap.ui.require.toUrl("webapp/annotations/combinedInvoicesSalesItem.xml")
			]
		},


		annotationsFailed: function (oEvents) {
			var errors = oEvents.getParameters().result;

			errors.forEach(e => {
				console.log("Erro Annotations dgs:")
				console.log(e);
			});
		}
	});
});

