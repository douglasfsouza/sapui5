sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass",
	"./SmartGridTable"	 
], function (Controller,
	MessageBox,
	JSONModel,
	Fragment,
	syncStyleClass,
	SmartGridTable
	) {
	"use strict";

	return SmartGridTable.extend("webapp.SmartTablex", {
		_selectedRows: null,
		_selectedReferencesRows: null,
		_CombinedInvoicesNewDialog: null,
		_selectedCombinedSalesRows: null,
		_selectedCombinedSalesItemRows: null,

		onInit: function () {
			SmartGridTable.prototype.onInit.apply(this, arguments);

			this.setState(
				{
					showaccept: false
				}
			);

			var oModel = new JSONModel([]);
			this.getView().setModel(oModel, "Itens");

			var oModel = new JSONModel([]);
			this.getView().setModel(oModel, "Resumo");


			this.setEntitySet("SalesReturnsList");

			this.getTable().setHeader("Notas");

			var toolbar = this.getTable().getCustomToolbar();

			var modelConfig = this.getOwnerComponent().getMainComponent().getModel("apiconfig");
			var config = modelConfig.getData();
			this._currentUser = config.User;

			var oRouter = this.getOwnerComponent().getRouter();

			var oTarget = oRouter.getTarget("detail");
			if (oTarget) {
				oTarget.attachDisplay(this.attachDisplay, this);
			}
			toolbar.addContent(new sap.m.Button({ text: "Incluir", press: this._onNotifyPress.bind(this) }));
			toolbar.addContent(new sap.m.Button({ text: "Alterar", press: this._onUpdatePress.bind(this) }));
			toolbar.addContent(new sap.m.Button({ text: "Visualizar", press: this._onWarnPress.bind(this) }));
			toolbar.addContent(new sap.m.Button({ text: "Lançar", press: this._onInvoicePress.bind(this) }));
			toolbar.addContent(new sap.m.Button({ text: "Reprocessar", press: this._doInvoiceReprocess.bind(this) }));
			toolbar.addContent(new sap.m.Button({ text: "Cancelar", press: this.doCancelConfirmNotify.bind(this) }));
		},

		_onAddNotifyPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getTargets().display("salesadd",
				{
					fromTarget: "list",
					editMode: "insert",

				});
		},


		doCombinedSalesItemNew: function () {
			var oModel = this.getView().getModel();

			var proposal = {};
			proposal = {
				Code: this._selectedCombinedSalesItemRows[0].TicketCode,
				TicketLineCode: this._selectedCombinedSalesItemRows[0].TicketLineCode
			};

			var oResumo = this.getView().getModel("Resumo").getData();
			proposal.Lines = JSON.stringify(oResumo);

			this._CombinedInvoicesNewDialog.setBusy(true);

			var url = `/TransCombinedSalesItemNewService`;

			oModel.create(url, proposal, {
				success: this._OnSaveSuccess.bind(this, "Notificar", this._CombinedInvoicesNewDialog, null, "Cupom incluído"),
				error: this._OnSaveError.bind(this, "Notificar", this._CombinedInvoicesNewDialog, null)
			});


		},

		_onNotifyPress: function () {

			var oView = this.getView();
			var that = this;


			var model = this.getView().getModel();
			var ctx = model.createEntry("/TransCombinedInvoicesNewService()", {
				properties: {
					Obs: ""
				}

			});

			// create dialog lazily
			if (!this._CombinedInvoicesNewDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "webapp.fragments.TransAddSalesReturn",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					syncStyleClass("sapUiSizeCompact", oView, oDialog);

					// activate automatic message generation for complete view
					that.EnableNotificationsTo(oDialog);
					that.ClearNotifications();

					that._CombinedInvoicesNewDialog = oDialog;
					that._CombinedInvoicesNewDialog.open();
				});
			}
			else {
				this._CombinedInvoicesNewDialog.open();

			}

		},



		doInvoiceNotify: function () {
			var oModel = this.getView().getModel();
			this.getView().setBusy(true);


			var proposal = {};
			proposal.TicketCode = this._selectedRows[0].U_TICKETCODE;
			proposal.CombineInvoiceId = this._selectedRows[0].Code;
			proposal.CardCode = this._selectedRows[0].U_DOCCARDCODE;
			proposal.Status = "L";

			oModel.create(`/FactoringPOSSalesReturnInvoiceGenerate`, proposal, {
				success: this._OnSaveSuccess.bind(this, "Lançar", null, null, "Cupom(ns) Lançado(s)"),
				error: this._OnSaveError.bind(this, "Lançar", null, null)
			});

		},


		_doInvoiceReprocess: function () {
			var oModel = this.getView().getModel();
			this.getView().setBusy(true);


			var proposal = {};
			proposal.TicketCode = this._selectedRows[0].U_TICKETCODE;
			proposal.CombineInvoiceId = this._selectedRows[0].Code;
			proposal.CardCode = this._selectedRows[0].U_DOCCARDCODE;
			proposal.DocEntry = this._selectedRows[0].U_DOCENTRY;
			proposal.Status = "R";


			var oItem = [];

			this._selectedRows.forEach(row => {
				var oRecord = {
				};
				oRecord.Code = row.Code;
				oRecord.ItemCode = row.U_CODITEM;
				oRecord.TicketCode = row.U_TICKETCODE;
				oRecord.TicketLineCode = row.U_TICKETLINECODE;
				oRecord.AmountReturned = row.U_RETURNEDQTY;
				oItem.push(oRecord);
			});

			proposal.Lines = JSON.stringify(oItem);

			oModel.create(`/FactoringPOSSalesReturnInvoiceGenerate`, proposal, {
				success: this._OnSaveSuccess.bind(this, "Lançar", null, null, "Nota(s) fiscal(is) lançadas com sucesso"),
				error: this._OnSaveError.bind(this, "Lançar", null, null)
			});

		},

		SalesReturnsNew_OnSave: function (oEvent) {
			var oModel = this.getView().getModel();
			this.doCombinedInvoicesNew();
		},

		doCombinedInvoicesNew: function () {

			var rows = this._selectedCombinedSalesRows;

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getTargets().display("salesadd",
				{
					fromTarget: "List",
					editMode: "insert",
					data: rows,
				});

		},



		doCombinedSalesItemNewLancar: function () {
			var oModel = this.getView().getModel();



			var proposal = {};
			proposal = {
				TicketCode: this._selectedCombinedSalesRows[0].TicketCode

			};

			proposal.Status = "L";

			var oResumo = this.getView().getModel("Resumo").getData();
			proposal.Lines = JSON.stringify(oResumo);

			this._CombinedInvoicesNewDialog.setBusy(true);

			var url = `/FactoringPOSSalesReturnInvoiceGenerate`;

			oModel.create(url, proposal, {
				success: this._OnSaveSuccess.bind(this, "Notificar", this._CombinedInvoicesNewDialog, null, "Cupom incluído"),
				error: this._OnSaveError.bind(this, "Notificar", this._CombinedInvoicesNewDialog, null)
			});


		},



		_onUpdatePress: function () {

			var oView = this.getView();
			var that = this;
			var nl = null;

			if (!this._selectedRows || this._selectedRows.length === 0) {
				MessageBox.warning("Selecione pelo menos 1 título para alterar.", {
					title: "Informação"
				});
				return false;
			}


			this._selectedRows.forEach(element => {
				if (element.U_POSTED != "I") {
					nl = true;
				}
			});


			if (nl == true) {
				MessageBox.warning("poderão ser alterados apenas cupons com status criado.", {
					title: "Informação"
				});
				return false;
			}



			var model = this.getView().getModel();
			var ctx = model.createEntry("/TransCombinedSalesItemUpdateService()", {
				properties: {
					U_VSCARDCODE_Descr: null,

				}

			});

			// create dialog lazily
			if (!this._updateDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "webapp.fragments.TransUpdateCombinedSalesItem",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					syncStyleClass("sapUiSizeCompact", oView, oDialog);

					// activate automatic message generation for complete view
					that.EnableNotificationsTo(oDialog);
					that.ClearNotifications();

					that.getView().byId("TransUpdateCombinedSalesitemEdit").bindElement(ctx.getPath());

					that._updateDialog = oDialog;
					that._updateDialog.open();
				});
			}
			else {
				this.getView().byId("TransUpdateCombinedSalesitemEdit").bindElement(ctx.getPath());
				this._updateDialog.open();

			}

		},



		UpdateSalesItem_OnSave: function (oEvent) {
			var oModel = this.getView().getModel();

			if (!oModel.hasPendingChanges()) {
				MessageBox.information("Preencha o campo que deseja alterar e então pressione 'Confirmar' novamente.", {
					title: "Alteração",
					actions: MessageBox.Action.OK,
					emphasizedAction: MessageBox.Action.OK,
					initialFocus: MessageBox.Action.OK
				});
			}
			else {

				this.doUpdateNotify();

			}
		},

		doUpdateNotify: function () {
			var oModel = this.getView().getModel();

			var oData = this.getView().byId("TransUpdateCombinedSalesitemEdit").getBindingContext().getObject();
			delete oData.__metadata;

			var lines = [];

			var oItem = [];


			this._selectedRows.forEach(row => {
				var oRecord = {
				};
				oRecord.TicketCode = row.U_TICKETCODE;
				oRecord.U_TicketCodeLine = row.U_TICKETLINECODE;
				oItem.push(oRecord);
			});

			oData.Lines = JSON.stringify(oItem);

			this._updateDialog.setBusy(true);


			oModel.create(`/TransCombinedSalesItemUpdateService`, oData, {
				success: this._OnSaveSuccess.bind(this, "Notificar", this._updateDialog, null, "Cupom alterado."),
				error: this._OnSaveError.bind(this, "Notificar", this._updateDialog, null)
			});


		},
		

		_onMessagePopoverPress: function (oEvent) {
			this.ToggleNotificationsFor(oEvent.getSource());
		},
		

		_OnExecutionError: function (title, dialog, createdEntry, oError) {
			if (dialog) {
				dialog.setBusy(false);
			}
			else {
				this._oParent.setBusy(false);
			}

			var responseText = JSON.parse(oError.responseText);

			var messageList = [];

			if (responseText && responseText.error) {
				var error = responseText.error;

				var details = [];

				if (error.innererror) {
					details = error.innererror.details.map(m => m.message);
				};

				var messageItem = {
					type: "Error",
					title: error.message.value,
					description: details.join("\r\n")
				};

				messageList.push(messageItem);
			}

			if (!messageList) {
				messageList = [
					{
						type: "Error",
						description: "Falha ao executar operação"
					}
				];
			}

			this._OnClose(null);
			this.ShowMessageView(title, messageList, function () {
				if (this._options.onclose) {
					this._options.onclose({
						success: false
					});
				}
			});
		},

		_OnSaveError: function (title, dialog, createdEntry, oError) {
			if (dialog != null) {
				dialog.setBusy(false);
			}
			else {
				this.getView().setBusy(false);
			}

			var responseText = JSON.parse(oError.responseText);

			var messageList = [];

			if (responseText && responseText.error) {
				var error = responseText.error;

				var details = [];

				if (error.innererror) {
					details = error.innererror.details.map(m => m.message);
				};

				var messageItem = {
					type: "Error",
					title: error.message.value,
					description: details.join("\r\n")
				};

				messageList.push(messageItem);
			}

			if (!messageList) {
				messageList = [
					{
						type: "Error",
						description: "Falha ao executar operação"
					}
				];
			}

			if (dialog != null) {
				this._OnClose(dialog, createdEntry);
			}

			var that = this;

			this.ShowMessageView(title, messageList, function () {
				that.getTable().rebindTable(true);
			});
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

					var aColumns = oTable.getColumns();

					for (var i = aColumns.length - 1; i >= 0; i--) {
						var c = aColumns[i];
						oTpc.doAutoResizeColumn(i);
					}

				}, 200);
			}
		},

		onRowSelection: function (oEvent) {
			SmartGridTable.prototype.onRowSelection.apply(this, arguments);

			var table = oEvent.getSource();
			var indexes = table.getSelectedIndices();
			var selectedRows = [];

			indexes.forEach((index) => {
				var context = table.getContextByIndex(index);
				var row = context.getObject(context.getPath());
				selectedRows.push(row);
			});
			this._selectedRows = selectedRows;
		},

		

		activestep: function (oEvent) {

			var tableItens = this.byId("tableItens");
			tableItens.setBusy(true);

			this.bindTables();

		},


		activeresumostep: function (oEvent) {


			this.bindResumo();

		},


		bindResumo: function () {


			var omodel = this.getView().getModel("Resumo");
			var oResumo = [];
			this._selectedCombinedSalesItemRows.forEach(element => {

				var oRecord = {
				};
				oRecord.DocTotal = element.DocTotal;
				oRecord.TicketCode = element.TicketCode;
				oRecord.TicketLineCode = element.TicketLineCode;
				oRecord.ItemCode = element.ItemCode;
				oRecord.ItemName = element.ItemName;
				oRecord.Quantity = element.Quantity;
				oRecord.Qtd = element.Qtd;
				oRecord.Price = element.Price;
				oRecord.LineTotal = element.LineTotal;
				oRecord.TotalDev = element.TotalDev;
				oResumo.push(oRecord);
			});
			omodel.setData(oResumo);
			this.getView().setModel(omodel, "Resumo");

			var oModel = new JSONModel(oResumo);

			var tableResumo = this.byId("tableItensSelected");
			tableResumo.setModel(oModel);
			tableResumo.bindRows("/");

			tableResumo.setBusy(false);

			this.setState({ showaccept: true });

		},


		setState: function (newState) {
			var currentState = this.getState();

			var keys = Object.keys(newState);
			keys.forEach(k => {
				currentState[k] = newState[k]
			});

			var modelState = new JSONModel(currentState);

			this.getView().setModel(modelState, "state");
		},


		getState: function () {
			var modelState = this.getView().getModel("state");
			var currentState = {};
			if (modelState) {
				currentState = modelState.getData();
			}
			return currentState;
		},

		bindTables: function () {
			var model = this.getView().getModel();

			var uri = '/CombinedInvoicesSalesItem';
			var fields = "";
			var filter = "$filter=TicketCode eq '" + this._selectedCombinedSalesRows[0].TicketCode + "' and NFEKey eq '" + this._selectedCombinedSalesRows[0].NFEKey + "'";

			model.read(uri, {
				urlParameters: [fields, filter],
				success: (oData) => {
					var omodel = this.getView().getModel("Itens");
					var oItems = [];
					oData.results.forEach(element => {

						var oRecord = {
						};
						oRecord.Code = element.Code;
						oRecord.DocTotal = element.DocTotal;
						oRecord.TicketCode = element.TicketCode;
						oRecord.TicketLineCode = element.U_TicketCodeLine;
						oRecord.ItemCode = element.ItemCode;
						oRecord.ItemName = element.ItemName;
						oRecord.Quantity = element.Quantity;
						oRecord.Qtd = element.Quantity;
						oRecord.Price = element.Price;
						oRecord.LineTotal = element.LineTotal;
						oRecord.TotalDev = element.LineTotal;
						oItems.push(oRecord);
					});
					omodel.setData(oItems);
					this.getView().setModel(omodel, "Itens");

					var oModel = new JSONModel(oItems);

					var tableItens = this.byId("tableItens");
					tableItens.setModel(oModel);
					tableItens.bindRows("/");

					tableItens.setBusy(false);

					var cupom = this.byId("tex1");
					cupom.setText(oItems.length);
				}
			});

		},

		_OnValueChange: function (oEvent) {
			//          var oData = this.getView().getElementBinding().getBoundContext().getObject();

			var oItens = this.getView().getModel("Itens");
			var item = oItens.getData();

			var input = oEvent.getSource();
			var _newline = input.getBindingContext().getObject();

			var oNewItens = [];

			//		var total = oData.Qtd;

			var value = (_newline.Price * _newline.Qtd) * 100 / 100;

			item.forEach(element => {

				var oRecord = {
				};

				oRecord.TicketCode = element.TicketCode;
				oRecord.TicketLineCode = element.TicketLineCode;
				oRecord.Code = element.Code;
				oRecord.ItemCode = element.ItemCode;
				oRecord.ItemName = element.ItemName;
				oRecord.Quantity = element.Quantity;
				oRecord.Price = element.Price;
				oRecord.LineTotal = element.LineTotal;
				oRecord.Qtd = element.Qtd;

				if (element.Code == _newline.Code) {
					oRecord.TotalDev = value;
					if (_newline.Qtd > oRecord.Quantity) {
						oRecord.Qtd = oRecord.Quantity;
						oRecord.TotalDev = (oRecord.Price * _newline.Quantity) * 100 / 100;
					}
				} else {
					oRecord.TotalDev = element.TotalDev;
					oRecord.Qtd = oRecord.Qtd;
				}

				oNewItens.push(oRecord);
				this._changebranch = true;
			});
			oItens.setData(oNewItens);
			this.getView().setModel(oItens, "Itens");

			var oModel = new JSONModel(oNewItens);
			var tableItens = this.byId("tableItens");
			tableItens.setModel(oModel);
			tableItens.bindRows("/");

			var i = 0;
			var selectedrows = this._selectedCombinedSalesItemRows;
			tableItens.clearSelection();
			oNewItens.forEach(element => {
				selectedrows.forEach(row => {
					if (element.Code == row.Code) {
						tableItens.addSelectionInterval(i, i);
					}
				});
				i = i + 1;
			});
		},
		attachDisplay: function (oEvent) {
			var parms = oEvent.getParameter("data");

			var oModel = new JSONModel([]);
			this.getView().setModel(oModel, "Notas");


			// veio de retorno de alguma tela chamada
			if (parms.type == "Confirm") {
				this.getTable().rebindTable(true);
			}
		},

		initialized: function (oEvents) {
			SmartGridTable.prototype.initialized.apply(this, arguments);
		},

		getViewInfo: function () {
			return {
				mainRouteName: "list",
				variantProviderName: "webapp.CombinedInvoicesList"
			}
		},

		//overriden
		getUserName: function () {
			return this._currentUser.userName;
		},

		onRowActionPress: function (oEvent) {
			var context = oEvent.getSource()
				.getBindingContext();

			var currentRow = context.getObject(context.getPath());

			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.getTargets().display("detail",
				{
					fromTarget: "CombinedInvoicesList",
					editMode: "none",
					recordKey: currentRow.Code
				});
		},

		onSaveSuccess: function (oData) {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getTargets().display("contractEdit",
				{
					fromTarget: "CombinedInvoicesList",
					editMode: "insert",
					recordKey: {}
				});
		},

		onSaveError: function (oError) {
			this.getView().setBusy(false);

			var response = JSON.parse(oError.responseText);

			var message = "";

			if (response.Message) {
				message = `Falha ao gravar o registro\r\n${oError.message}\r\n${response.Message}`
			}
			else (response.error)
			{
				message = `Falha ao gravar o registro\r\n${oError.message}\r\n${response.error.message.value}`
			}

			MessageBox.error(message, {
				title: "Evento",
			});
		},


		Update_OnClose: function (oEvent) {
			this._OnClose(this._updateDialog, null);
		},

		_OnClose: function (dialog, createdEntry) {
			if (createdEntry) {
				var oModel = this.getView().getModel();
				oModel.deleteCreatedEntry(createdEntry);
			}

			this.ClearNotifications();
			this.DisableNotificationsFrom(dialog);

			if (dialog) {
				dialog.setBusy(false);
				dialog.close();
			}
		}

	});
});