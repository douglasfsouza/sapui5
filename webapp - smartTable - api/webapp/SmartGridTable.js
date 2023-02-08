sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass",
	'./SaveAsTile',
	"./library",
	"sap/m/PDFViewer"
], function (BaseController,
	JSONModel,
	Filter,
	FilterOperator,
	MessageBox,
	MessageToast,
	Fragment,
	syncStyleClass,
	SaveAsTile,
	LocalLibrary,
	PDFViewer) {
	"use strict";

	return BaseController.extend("webapp.SmartGridTable", {
		_smartFilterBar: null,
		_smartVariantManagement: null,
		_smartTable: null,
		_smartChart: null,
		_saveAsTile: null,
		_defaultTableVariant: null,
		_defaultFilterVariant: null,
		_bFilterInitialized: false,
		_showChart: false,
		_ExecuteQuery: false,
		_ClearQuery: false,
		_TableType: null,
		_pdfViewer: null,
		_isVariantChanged: false,

		metadata: {
			events: {
				"pageReloaded": {}
			}
		},

		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);

			// if (this._TableType === null) {
			// 	this._TableType = LocalLibrary.TableType.AnalyticalTable;
			// }

			this._smartVariantManagement = this.getView().byId("__SVM");
			this._smartFilterBar = this.getView().byId("__SFB");
			this._saveAsTile = this.getView().byId("__ST_Save");
			this._smartChart = this.getView().byId("__SCHART");
			this._smartFilterBar.attachInitialized(this.initialized, this);

			// old: dentro da página
			var container = this.byId("chartTableArea");
			var page = this.byId("chartTableArea");
			//var page = this.byId("__MAIN");
			//dgs
			//var page = this.getView().byId("__MAIN");
			// new: dentro de ChartContainer
			var container = this.byId("chartTableArea");

			var fragments = page.getDependents();
			//var tableIndex = this._TableType === LocalLibrary.TableType.Table ? 0 : 1;
			var tableIndex = 1;

			this._smartTable = fragments[tableIndex];

			container.destroyContent();
			container.addContent(this._smartTable);

			var totals = {};
			var oModel = new JSONModel(totals);
			this.getView().setModel(oModel, "totals");

			var info = this.getViewInfo();

			//var route = this.getOwnerComponent().getRouter().getRoute(info.mainRouteName);
			//route.attachMatched(this._RouteMatched, this);

			// var routeFromMenu = this.getOwnerComponent().getRouter().getRoute(`${info.mainRouteName}-fromMenu`);
			// if (routeFromMenu) {
			// 	routeFromMenu.attachMatched(this._RouteMatched, this);
			// }
		},

		onExit: function () {
			var info = this.getViewInfo();
			var route = this.getOwnerComponent().getRouter().getRoute(info.mainRouteName);
			var routeFromMenu = this.getOwnerComponent().getRouter().getRoute(`${info.mainRouteName}-fromMenu`);

			route.detachMatched(this._RouteMatched, this);
			routeFromMenu.detachMatched(this._RouteMatched, this);
		},

		onFilterSearch: function (oEvent) {
			this.getTable().getTable().setThreshold(1000);
			delete this.__selected_all_rows;
			delete this.__count;
		},

		_reloadPage: function () {
			if (this._reloading) {
				return;
			}

			this._reloading = true;
			this.getView().setBusy(true);

			setTimeout(() => {
				this._reloading = false;

				if (this._ExecuteQuery) {
					this._smartVariantManagement.fireSelect({ key: "*standard*" });
					this._smartFilterBar.fireSearch();
				}
				else if (this._ClearQuery) {
					this._smartVariantManagement.fireSelect({ key: "*standard*" });
				}

				this._ExecuteQuery = false;
				this._ClearQuery = false;

				this.getView().setBusy(false);

				if (typeof (this.pageReloaded) === "function") {
					this.pageReloaded()
				}
			}, 500);
		},

		initialized: function (oEvents) {
			var btnFilter = this.getView().byId("__SFB-btnFilters");
			btnFilter.setText("Adaptar filtros");

			var btnGo = this.getView().byId("__SFB-btnGo");
			btnGo.setText("Ir");

			try {
				var componentName = sap.ui.core.Component.getOwnerComponentFor(this.getView()).getComponentName();
				this._saveAsTile.setComponent(componentName);
			} catch (error) {

			}

			if (this._showChart) {
				var viewButtons = new sap.m.SegmentedButton({
					selectedKey: "table",
					selectionChange: this._onViewChange.bind(this)
				});
				this._viewButtons = viewButtons;

				viewButtons.addItem(new sap.m.SegmentedButtonItem({
					icon: "sap-icon://table-view",
					key: "table",
					tooltip: "Tabela"
				}));

				viewButtons.addItem(new sap.m.SegmentedButtonItem({
					icon: "sap-icon://line-chart",
					key: "chart",
					tooltip: "Gráfico"
				}));

				this._smartTable.getCustomToolbar().insertContent(viewButtons, 99);

				var viewButtonsChart = new sap.m.SegmentedButton({
					selectedKey: "chart",
					selectionChange: this._onViewChange.bind(this)
				});
				this._viewButtonsChart = viewButtonsChart;

				viewButtonsChart.addItem(new sap.m.SegmentedButtonItem({
					icon: "sap-icon://table-view",
					key: "table",
					tooltip: "Tabela"
				}));

				viewButtonsChart.addItem(new sap.m.SegmentedButtonItem({
					icon: "sap-icon://line-chart",
					key: "chart",
					tooltip: "Gráfico"
				}));

				this._smartChart.getToolbar().insertContent(viewButtonsChart, 99);
			}

			this.initializeVariant();

			if (this.getDefaultTableVariant() || this.getDefaultFilterVariant()) {
				this._ExecuteQuery = true;
			}

			this._bFilterInitialized = true;

			this._reloadPage();
		},

		_onViewChange: function (oEvent) {
			var oButton = oEvent.getSource();

			if (oButton.getSelectedKey() === "table") {
				var page = this.byId("chartTableArea");
				this.byId("viewNavigator").back();

				this._viewButtons.setSelectedKey("table");
			}
			else {
				var page = this.byId("chartChartArea");
				this.byId("viewNavigator").to(page, "fade");

				this._viewButtonsChart.setSelectedKey("chart");
			}
		},

		_RouteMatched: function (oEvent) {
			var args = oEvent.getParameter("arguments");

			// Veio chamado do menu, com argumentos
			if (args.tileid) {
				var oModel = this.getOwnerComponent().getMainComponent().getModel("__menu__");
				if (oModel) {
					var oData = oModel.getData();
					var tileid = args.tileid.split("-");

					var groupIdx = parseInt(tileid[1]);
					var tileIdx = parseInt(tileid[2]);

					var keys = Object.keys(oData);
					var groupName = keys[groupIdx];

					// a referência do tile é calculada apenas na lista dos 
					// itens de menu que são exibidos no launchpad
					var menuItems = oData[groupName].items.filter(f => f.showInLaunchPad === true);

					var menuItemConfig = menuItems[tileIdx];

					var menuItem = menuItemConfig.datasource.data;

					//this.setDefaultVariantData(menuItem.U_TABLEVARIANT, menuItem.U_FILTERVARIANT);
					this.setDefaultTableVariant(menuItem.U_TABLEVARIANT);
					this.setDefaultFilterVariant(menuItem.U_FILTERVARIANT);

					this._ExecuteQuery = true
				}
			}
			// Veio chamado do menu, sem argumentos
			else {
				if (this.getDefaultFilterVariant() || this.getDefaultTableVariant()) {
					this.setDefaultTableVariant(null);
					this.setDefaultFilterVariant(null);
					this._ExecuteQuery = false;
					this._ClearQuery = true;
				}
			}

			this._reloadPage();
		},

		initializeTile: function () {
			var tile = {
				U_TITLE: "Título",
				U_SUBTITLE: "Subtítulo",
				U_FOOTER: "Rodapé",
				U_GROUP: "Grupo"
			}

			var model = new JSONModel(tile);
			model.setDefaultBindingMode("TwoWay");
			this.getView().setModel(model, "tile");
		},

		setShowChart: function (value) {
			this._showChart = value;
		},

		getShowChart: function () {
			return this._showChart;
		},

		setEntitySet: function (entitySet) {
			this._smartFilterBar.setEntitySet(entitySet);
			this._smartTable.setEntitySet(entitySet);
			this._smartChart.setEntitySet(entitySet);
			this._saveAsTile.setEntitySet(entitySet);
		},

		getDefaultTableVariant: function () {
			return this._defaultTableVariant;
		},

		setDefaultVariantData: function (tableVariant, filterVariant, reload = true) {
			this._defaultTableVariant = tableVariant;
			this._defaultFilterVariant = filterVariant;

			if (this._bFilterInitialized) {
				this._smartVariantManagement.fireSelect({ key: "*standard*" });

				if (reload) {
					this._smartFilterBar.fireSearch();
				}
			}
		},

		setDefaultTableVariant: function (value) {
			this._defaultTableVariant = value;
		},

		getDefaultFilterVariant: function () {
			return this._defaultFilterVariant;
		},

		setDefaultFilterVariant: function (value) {
			this._defaultFilterVariant = value;
		},

		getUserName: function () {
			var modelConfig = this.getOwnerComponent().getMainComponent().getModel("apiconfig");
			var config = modelConfig.getData();
			return config.User;
		},

		/* Exemplo
		getViewInfo
		return {
			mainRouteName: Nome da principal rota definida em manifest.json,
			variantProviderName: nome único para identificação das variantes de tela
		}
		*/
		getViewInfo: function () {
			throw "getViewInfo must be overriden";
		},

		getFilterBar: function () {
			return this._smartFilterBar;
		},

		getVariantManagement: function () {
			return this._smartVariantManagement;
		},

		getTable: function () {
			return this._smartTable;
		},

		getChart: function () {
			return this._smartChart;
		},

		onBusyStateChanged: function (oEvent) {
			var bBusy = oEvent.getParameter("busy");

			if (!bBusy && !this._bColumnOptimizationDone) {
				var oTable = oEvent.getSource();
				var oTpc = null;

				setTimeout(() => {
					if (sap.ui.table.TablePointerExtension) {
						oTpc = new sap.ui.table.TablePointerExtension(oTable);
					} else {
						oTpc = new sap.ui.table.extensions.Pointer(oTable);
					}

					var oModel = this.getView().getModel("totals");
					var totals = oModel.getData();
					var aColumns = oTable.getColumns();

					for (var i = aColumns.length - 1; i >= 0; i--) {
						var c = aColumns[i];

						if (c.getSummed() && c.getMultiLabels().length === 0) {
							var aId = c.getId().split("-");
							var sId = aId[aId.length - 1];

							var lbl = c.getLabel();
							var lb1 = new sap.m.Label({
								text: lbl.getText(),
								textAlign: lbl.getTextAlign()
							});

							var lb3 = new sap.m.ObjectNumber({
								number: `{"path": "totals>/${sId}", \
										"type": "varsis.www.library.types.Currency", \
										"formatOptions": { \
											"hideIfEmpty": true
										}}`,
								textAlign: "Right",
								emphasized: false
							});

							c.addMultiLabel(lb1);
							c.addMultiLabel(lb3);

							totals[sId] = 0.00;
						}

						oTpc.doAutoResizeColumn(i);
					}

					oModel.setData(totals);
					this.getView().setModel(oModel, "totals");

					this.resetTotals();

					if (!this._isVariantChanged) {
						this.setVariantDirty(false);
					}

					if (this.__selected_all_rows) {
						var binding = this.getTable().getTable().getBinding();
						binding._getContextsOrNodes(false, 0, this.__count, this.__count);
						this.getTable().getTable().selectAll();
					}

					//This line can be commented if you want the columns to be adjusted on every scroll
					//this._bColumnOptimizationDone = true;
				}, 200);
			}
		},

		resetTotals: function () {
			var oModel = this.getView().getModel("totals");
			var totals = oModel.getData();

			var keys = Object.keys(totals);
			keys.forEach(k => {
				totals[k] = 0.00;
			});

			oModel.setData(totals);
			this.getView().setModel(oModel, "totals");
		},

		onRowSelection: function (oEvent) {
			oEvent.preventDefault();

			var isAnalytical = (this._TableType === LocalLibrary.TableType.AnalyticalTable);

			var groupedCols = isAnalytical ? this.getTable().getTable().getGroupedColumns() : null;
			var hasGroups = isAnalytical ? (groupedCols && groupedCols.length > 0) : false;
			var allSelected = oEvent.getParameter("selectAll");
			var table = oEvent.getSource();
			var indexes = table.getSelectedIndices();
			var that = this;
			var binding = table.getBinding();

			if (!hasGroups && allSelected && this.__count && this.__count > 10000) {
				table.removeSelectionInterval(0, indexes.length);
				MessageBox.alert(`O número de registros a selecionar excede o máximo permitido (10.000)\r\n\r\nPor favor, revise os critérios de filtro utilizados.`, {
					title: "Selecionar tudo"
				});
			}
			else if (!hasGroups && allSelected && this.__count && this.__count > binding._oRootNode.nodeState.sections[0].length) {
				//else if (!hasGroups && allSelected && this.__count && this.__count > binding.mKeyIndex["/"].length) {
				MessageBox.confirm(`Deseja continuar com a seleção de ${this.__count} registro(s)?\r\n\r\nA consulta pode demorar algum tempo para retornar.`, {
					title: "Selecionar tudo",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					initialFocus: MessageBox.Action.NO,
					onClose: function (button) {
						if (button === MessageBox.Action.YES) {
							table.removeSelectionInterval(0, indexes.length);
							that.__selected_all_rows = true;
							table.setThreshold(that.__count);
							that.getTable().rebindTable(true);
						}
						else {
							that.sumSelectedRows(indexes);

						}
					}
				});
			}
			else {
				this.sumSelectedRows(indexes);
			}
		},

		sumSelectedRows: function (indexes) {
			var table = this.getTable().getTable();
			var oModel = this.getView().getModel("totals");
			var totals = oModel.getData();

			var keys = Object.keys(totals);
			keys.forEach(k => {
				totals[k] = 0.00;
			});

			indexes.forEach((index) => {
				var context = table.getContextByIndex(index);
				var row = context.getObject(context.getPath());
				keys.forEach(k => {
					totals[k] += parseFloat(row[k]);
				});
			});

			oModel.setData(totals);
			this.getView().setModel(oModel, "totals");
		},

		setVariantDirty: function (value = true) {
			this._isVariantChanged = value;

			if (this._pageInitialized) {
				this.getVariantManagement().currentVariantSetModified(value);
			}
			else {
				this._pageInitialized = true;
			}
		},

		onAssignedFiltersChanged: function (oEvent) {
			this.setVariantDirty();
		},

		onGridColumnMove: function (oEvent) {
			this.setVariantDirty();
		},

		onGridColumnResize: function (oEvent) {
			this.setVariantDirty();
		},

		onGridBeforeRebindTable: function (oEvent) {
			this.setVariantDirty();
		},

		initializeVariant: function () {
			var oModel = this.getView().getModel();

			var variantModel = new JSONModel([]);
			this.getView().setModel(variantModel, "v4r14nt");

			var info = this.getViewInfo();

			var that = this;
			oModel.read("/UserVariants", {
				filters: [
					new Filter({
						path: "U_USERNAME",
						operator: FilterOperator.EQ,
						value1: this.getUserName()
					}),

					new Filter({
						path: "U_PAGENAME",
						operator: FilterOperator.EQ,
						value1: info.variantProviderName
					})
				],
				success: function (oData) {
					var variantModel = new JSONModel(oData.results);
					that.getView().setModel(variantModel, "v4r14nt");
				}
			})
		},

		saveVariant: function (oEvent) {
			var name = oEvent.getParameters().name;
			var overwrite = oEvent.getParameters().overwrite;
			var key = oEvent.getParameters().key;

			var tableVariant = this._smartTable.fetchVariant();
			var filterVariant = this._smartFilterBar.fetchVariant();
			var info = this.getViewInfo();

			var oModel = this.getView().getModel();

			var record = {
				Code: key,
				U_USERNAME: this.getUserName(),
				U_PAGENAME: info.variantProviderName,
				U_VARIANTNAME: name,
				U_TABLEVARIANT: JSON.stringify(tableVariant),
				U_FILTERVARIANT: JSON.stringify(filterVariant)
			}

			if (overwrite) {
				var url = `/UserVariants('${key}')`;
				oModel.update(url, record, {
					success: this.onSaveVariantSuccess.bind(this),
					error: this.onSaveVariantError.bind(this)
				});
			}
			else {
				var url = '/UserVariants';
				oModel.create(url, record, {
					success: this.onSaveVariantSuccess.bind(this),
					error: this.onSaveVariantError.bind(this)
				});
			}
		},

		onSaveVariantSuccess: function (oRecord, oResponse) {
			var oModel = this.getView().getModel("v4r14nt");
			var oData = oModel.getData();
			var i = oData.findIndex(m => m.Code === oRecord.Code);

			if (i < 0) {
				oData.push(oRecord);
			}
			else {
				oData[i] = oRecord;
			}

			oModel.setData(oData);

			this.getView().setModel(oModel, "v4r14nt");

			this.getVariantManagement().refreshAggregation("variantItems", i < 0 ? "Add" : "Change");

			MessageToast.show("Visão gravada com sucesso !");
		},

		onSaveVariantError: function (oEvent) {
			MessageToast.show("Erro ao gravar variante");
		},

		selectVariant: function (oEvent) {
			var key = oEvent.getParameters().key;
			var table = this.getTable();
			var filter = this.getFilterBar();

			if (key === "*standard*") {
				var tableVariant = this.getDefaultTableVariant();
				var filterVariant = this.getDefaultFilterVariant();

				tableVariant = tableVariant ? JSON.parse(tableVariant) : null;
				filterVariant = filterVariant ? JSON.parse(filterVariant) : null;

				table.applyVariant(tableVariant);

				if (filterVariant) {
					filter.applyVariant(filterVariant);
				}
				else {
					filter.setCurrentVariantId(key);
				}

				this.getVariantManagement().currentVariantSetModified(false);
			}
			else {
				var model = this.getView().getModel("v4r14nt");
				var variants = model.getData();

				var variant = variants.find(m => m.Code === key);

				if (variant) {
					var tableVariant = variant.U_TABLEVARIANT ? JSON.parse(variant.U_TABLEVARIANT) : null;
					var filterVariant = variant.U_FILTERVARIANT ? JSON.parse(variant.U_FILTERVARIANT) : null;

					table.applyVariant(tableVariant);
					filter.applyVariant(filterVariant);
					this.getVariantManagement().currentVariantSetModified(false);
				}
			}
		},

		manageVariant: function (oEvent) {
			var oModel = this.getView().getModel();
			var deleted = oEvent.getParameters().deleted;
			var renamed = oEvent.getParameters().renamed;
			var executed = oEvent.getParameters().exe;
			var oVariantData = this.getView().getModel("v4r14nt").getData();

			var groupId = "**manage-variant**";
			oModel.setDeferredGroups([groupId]);

			deleted && deleted.forEach(key => {
				var url = `/UserVariants('${key}')`;

				oVariantData = oVariantData.filter(f => f.Code !== key);

				oModel.remove(url, { groupId: groupId });
			});

			renamed && renamed.forEach(r => {
				var url = `/UserVariants('${r.key}')`;
				var payLoad = {
					Code: r.key,
					U_VARIANTNAME: r.name
				};

				var idx = oVariantData.findIndex(f => f.Code === r.key);
				oVariantData[idx].U_VARIANTNAME = r.name;

				oModel.update(url, payLoad, { groupId: groupId });
			});

			/* CAMPO AINDA NÃO IMPLEMENTADO NO BACKEND
			executed && executed.forEach(r => {
				var url = `/UserVariants('${r.key}')`;
				var payLoad = {
					Code = r.key,
					U_AUTOEXECUTE = r.exe ? "S" : "N"
				};
				oModel.update(url, payLoad, {groupId: groupId});
			});
			*/

			oModel.submitChanges({
				groupId: groupId,
				success: oData => {
					this.getView().getModel().setDeferredGroups(["changes"]);
					this.manageVariantSuccess(oData, oVariantData);
				},
				error: function (oError) {
					this.getView().getModel().setDeferredGroups(["changes"]);
					MessageToast.error("Erro ao gravar variante");
				}
			});
		},

		manageVariantSuccess: function (oData, oVariantData) {
			var batchResponses = oData.__batchResponses;
			var messages = [];

			batchResponses && batchResponses.forEach(b => {
				var changeResponses = b.__changeResponses;

				changeResponses && changeResponses.forEach(cr => {
					if (cr.response) {
						var body = JSON.parse(cr.response.body);
						if (body.error) {
							messages.push(`${cr.response.statusCode}-${body.error.message.value}`);
						}
					}
				});
			});

			if (messages.length !== 0) {
				var message = messages.join("\r\n");

				this._smartVariantManagement.setInErrorState(true);

				MessageBox.information(`Erro ao atualizar visão\r\n${message}`, {
					title: "Administrar visões",
					actions: [MessageBox.Action.OK],
					emphasizedAction: MessageBox.Action.OK,
					initialFocus: MessageBox.Action.OK
				});
			}
			else {
				var newModel = new JSONModel(oVariantData);
				this.getView().setModel(newModel, "v4r14nt")
			}
		},

		onActionPress: function (oEvent) {
			var oButton = oEvent.getSource();
			this.byId("actionSheet").openBy(oButton);
		},

		onSaveAsTilePress: function (oEvent) {
			var info = this.getViewInfo();
			var route = this.getOwnerComponent().getRouter().getRoute(info.mainRouteName);
			var targetName = route._oConfig.target[0];

			this._saveAsTile.setModel(this.getView().getModel());
			this._saveAsTile.setTableVariant(JSON.stringify(this._smartTable.fetchVariant()));
			this._saveAsTile.setFilterVariant(JSON.stringify(this._smartFilterBar.fetchVariant()));
			this._saveAsTile.setUserName(this.getUserName());
			this._saveAsTile.setComponent(this.getOwnerComponent().getComponentName());
			this._saveAsTile.setComponentTarget(targetName);
			this._saveAsTile.open();
		},

		setHighlightInfo: function (highLightInfo) {
			/*
			<rowSettingsTemplate>
					<RowSettings highlight="{Status}" highlightText="{StatusText}"/>
			</rowSettingsTemplate>
			*/

			var table = this.getTable().getTable();

			if (table.isA("sap.ui.table.Table")) {
				var rowSettings = new sap.ui.table.RowSettings({
					highlight: highLightInfo.value,
					tooltip: highLightInfo.text ? highLightInfo.text : undefined
				});

				table.setRowSettingsTemplate(rowSettings);
			}
		},

		onRebindTable: function (oEvent) {
			var bindingParams = oEvent.getParameter("bindingParams");
			bindingParams.events["dataReceived"] = this.dataReceivedTable.bind(this);
		},

		dataReceivedTable: function (oEvent) {
			var data = oEvent.getParameter("data");

			if (!data || !data.__batchResponses || !data.__batchResponses.length === 0) {
				return;
			}

			data.__batchResponses.forEach(br => {
				if (!this.__count && br.body.startsWith("{")) {
					var body = JSON.parse(br.body);
					var d = body.d;
					var count = d.__count;

					if (count) {
						this.__count = parseFloat(count);
					}
				}
			});
		},

		showReport: function (title, args) {
			var modelConfig = this.getOwnerComponent().getMainComponent().getModel("apiconfig");
			var config = modelConfig.getData();

			var entityset = args.entitySet;
			var name = args.name;
			var args = btoa(JSON.stringify(args.args));

			var url = `${config.urlOData}/${entityset}/$report?$name=${name}&$filter=${args}`;

			if (this._pdfViewer == null) {
				this._pdfViewer = new PDFViewer();
				this._pdfViewer.setWidth("50%");
				this._pdfViewer.setHeight("50%");

				// Ignora erro de acesso ao IFrame
				this._pdfViewer.attachSourceValidationFailed((oEvent) => {
					oEvent.preventDefault();
					return false;
				});

				this.getView().addDependent(this._pdfViewer);
			}

			this._pdfViewer.setTitle(title);
			this._pdfViewer.setSource(url);
			this._pdfViewer.open();
		}

	});
});