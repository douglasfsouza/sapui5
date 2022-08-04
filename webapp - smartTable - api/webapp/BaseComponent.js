// Copyright 2021 flovogt/ui5con20-ui5-routing
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//   https://github.com/flovogt/ui5con20-ui5-routing
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/base/util/deepClone",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, deepClone, ODataModel, JSONModel) {
	"use strict";

	return UIComponent.extend("webapp.BaseComponent", {
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			var oRouter = this.getRouter();
			oRouter.getViews().attachCreated(this._processEventMappingOnTargetCreated, this);
			oRouter.attachRoutePatternMatched(this.RoutePatternMatched.bind(this));
			oRouter.initialize();
		},
		/**
		 * This function is attached to the 'created' event from the target cache of a router.
		 *
		 * Once a component target is created, this function is called. Within this function,
		 * the 'eventMappings' property which is defined in the subclass component is processed.
		 * To each of the events defined within a target under 'eventMappings', a handler is
		 * attached. The handler calls the 'navTo' method on the current router by providing
		 * the route information and the information for the component targets within this route.
		 *
		 * With this mechanism, a nested component can fire specific events to inform the parent
		 * component that:
		 * <ul>
		 * <li>A navigation needs to be done with the router in the parent component.</li>
		 * <li>The event needs to be forwarded along the parent chain with the same parameter</li>
		 * </ul>
		 *
		 * @private
		 * @param {object} oEvent The event object which is provided by the 'created' event from
		 *   router's target cache
		 */
		_processEventMappingOnTargetCreated: function (oEvent) {
			// inicializa model
			/*
			var oModel = this.getModel();

			if (!oModel) {
				oModel = this.initializeModel();

				var that = this;

				oModel.metadataLoaded(true).then(() => {
					if (oModel.getMetaModel()) {
						that.setModel(oModel);
					}
				});
			}
			*/
			if (!this.eventMappings) {
				return;
			}

			var sType = oEvent.getParameter("type");
			var oObject = oEvent.getParameter("object");
			var oOptions = oEvent.getParameter("options");
			var that = this;
			var aEvents;

			function processComponentTargetInfo(oComponentTargetInfo, oEvent) {
				Object.keys(oComponentTargetInfo).forEach(function (sTargetName) {
					var oInfo = oComponentTargetInfo[sTargetName];

					if (oInfo.parameters) {
						Object.keys(oInfo.parameters).forEach(function (sName) {
							var sParamName = oInfo.parameters[sName];
							var sEventValue = oEvent.getParameter(sParamName);

							// expand the parameter mapping with the parameter value from
							// the event
							oInfo.parameters[sName] = sEventValue;
						});
					}

					if (oInfo.componentTargetInfo) {
						processComponentTargetInfo(oInfo.componentTargetInfo, oEvent);
					}
				});
			}

			if (sType === "Component") {
				aEvents = this.eventMappings[oOptions.usage];
				if (Array.isArray(aEvents)) {
					aEvents.forEach(function (oEventMapping) {
						oObject.attachEvent(oEventMapping.name, function (oEvent) {
							var oComponentTargetInfo;
							if (oEventMapping.route) { // route information defined, call 'navTo'
								if (oEventMapping.componentTargetInfo) {
									// if there's information for component target defined, replace the
									// event parameter mapping with the value from the event object
									oComponentTargetInfo = deepClone(oEventMapping.componentTargetInfo);
									processComponentTargetInfo(oComponentTargetInfo, oEvent);
								}

								that.getRouter().navTo(oEventMapping.route, {}, oComponentTargetInfo);
							} else if (oEventMapping.forward) { // event should be forwarded with the same parameters
								that.fireEvent(oEventMapping.forward, oEvent.getParameters());
							}
						});
					});
				}
			}
		},

		getMenuItems: function () {
			return [
				{ key: "menu_1", title: "MENU 01" },
				{ key: "menu_2", title: "MENU 02" },
				{ key: "menu_3", title: "MENU 03" },
				{ key: "menu_4", title: "MENU 04" }
			];
		},

		/**
		 * Apenas para manter compatibilidade com a versão anterior
		 */
		getMainComponent: function () {
			/*
			Name of main component is defined in componentData of componentUsages
			in main component manifest. For example ...

			"componentUsages": {
				"myreuse": {
					"name": "reuse.component1",
					"componentData": {
						"parentComponentName": "mydemo.Component"
					}
				}

			*/
			let oElement = this.oContainer
			while (oElement && !this._mainComponent) {
				oElement = oElement.getParent();
				if (this.oComponentData && this.oComponentData.parentComponentName) {
					if (oElement.getMetadata().getName() === this.oComponentData.parentComponentName) {
						this._mainComponent = oElement;
					}
				}
			}
			return this._mainComponent ? this._mainComponent : this;
		},

		getMainRouter: function () {
			return this.getMainComponent().getRouter()
		},

		loadedFromApp: function () {
			if (this.oComponentData && this.oComponentData.parentComponentName) {
				return true;
			}
			else {
				return false;
			}
		},

		RoutePatternMatched: function (oEvent) {
			var modelConfig = this.getMainComponent().getModel("apiconfig");

			if (modelConfig) {
				var config = modelConfig.getData();

				var tokenName = config.tokenName;
				var token = localStorage.getItem(tokenName);

				var oModel = this.getModel();
				oModel && oModel.setHeaders({
					"varsis_token": token,
				});
			}
		},

		getComponentName: function () {
			throw "NotImplemented";
		},

		getAnnotations: function () {
			return [];
		},

		initializeModel: function () {
			var modelConfig = this.getMainComponent().getModel("apiconfig");

			if (!modelConfig) {
				return new ODataModel({ "serviceUrl": "http://localhost" });
			}

			var config = modelConfig.getData();

			var serviceURL = config.urlOData;
			var tokenName = config.tokenName;
			var token = localStorage.getItem(tokenName);

			var annotations = this.getAnnotations();

			if (annotations) {
				var oModel = new ODataModel({
					"serviceUrl": serviceURL,
					"synchronizationMode": "None",
					"annotationURI": annotations,
					"defaultBindingMode": "TwoWay",
					"defaultCountMode": "Request",
					"disableHeadRequestForToken": true,
					"headers": {
						"varsis_token": token,
					},
					"useBatch": true,
					"loadAnnotationsJoined": true,
					"withCredentials": true
				});

				oModel.attachBatchRequestCompleted(null, this.BatchRequestCompleted, this);
			}

			return oModel;
		},

		BatchRequestCompleted: function (oEvent) {
			var modelConfig = this.getMainComponent().getModel("apiconfig");
			var config = modelConfig.getData();

			var tokenName = config.tokenName;
			var tokenExpirationName = `${tokenName}_expiration`;

			var now = new Date(Date.now())
			var expiration = new Date(now.getTime() + (30 * 60000));
			window.localStorage.setItem(tokenExpirationName, expiration);
		}


	});
});