sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/MessageView",
	"sap/ui/core/message/Message",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass"
	
], function(
	Controller,
	MessageToast,
	MessageBox,
	MessagePopover,
	MessageItem,
	MessageView,
	Message,
	JSONModel,
	Fragment,
	syncStyleClass
) {
	"use strict";

	return Controller.extend("dgs.dsp.controller.DspList", {
		_addNewEditDialog: null,
		_createEntry: null,
		/**
		 * @override
		 */
		onInit: function() {
			//Controller.prototype.onInit.apply(this, arguments);
			//this.getView().bindElement("/StatusList('A')");
			this.getView().bindElement("/Expenses('Id1234')");
			 
			var oView = this.getView();
			var oModel = oView.getModel();

			this.initState();		 

			//var oState = this.getState();x'
			//var canDelete = oState.getProperty("/canDelete");
			var {canDelete} = this.getState();

			//para funcionar o ListItem:
			// var serviceUrl = "http://localhost:32497/v1/";

			
			// var oServiceModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			
			// oServiceModel.read("/StatusList",{
			// 	success: (oData) => {
			// 		MessageToast.show("success. Status: " + oData.results[0].Description) ;
			// 	},
			// 	error: (oError) =>{
			// 		alert("erro ao carregar os dados. Error: " + oError.Message);
			// 	} 
			// });
		},

		initState: function(){
			this.setState({
				selectedRows: [],
				canDelete: false,
				canUpdate: false
			});

		},

		setState: function(value){
			var oView = this.getView();
			var localModel = new JSONModel(value);
			oView.setModel(localModel,"local");
		},

		getState: function(){
			//return this.getView().getModel("local");

			var modelState = this.getView().getModel("local");

			var currentState = {};
            if (modelState)
            {
                currentState = modelState.getData();
            }
            return currentState;

		},
		onInListPressed: function(oEvent){
			MessageToast.show("lista");
		},

		onDetailPressed: function(oEvent){
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("mydetail",{});
		},
		onBusyStateChanged: function(oEvent){
			oEvent.preventDefault();

            var bBusy = oEvent.getParameter("busy");

            if (!bBusy) {
                var oTable = oEvent.getSource();
                var oTpc = null;

                var bBusy = oEvent.getParameter("busy");

                if (!bBusy) {
                    oTable.setShowOverlay(false);
                }

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
            }
		},
		onAddPressed: function(oEvent){
			 
			var date = new Date();			

			var model = this.getView().getModel();
			this._createEntry = model.createEntry("/Expenses()", {
			    properties : {	
					Code: null,
					Date: date,	
					Description: null,
					Type: "C",
					TypeDescription: "Crédito",
					Value: 0					
				}
			});

			this.doOpenDialog();			
		},

		doOpenDialog: function(){
			var oView = this.getView();
			var that = this;

			// create dialog lazily
			if (!this._addNewEditDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "dgs.dsp.fragment.AddNewEdit",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);

					syncStyleClass("sapUiSizeCompact", oView, oDialog);

					// activate automatic message generation for complete view
					that.EnableNotificationsTo(oDialog);
					that.ClearNotifications();

					that.getView().byId("SFAddNewEdit").bindElement(that._createEntry.getPath());
		
					that._addNewEditDialog = oDialog;
					that._addNewEditDialog.open();
				});
			}
			else
			{
				this.getView().byId("SFAddNewEdit").bindElement(this._createEntry.getPath());
				this._addNewEditDialog.open();
			}
		},

		_dateFormat: function(date){
			if (date){
				return date.toLocaleDateString().replaceAll("/","-");
			}			
		},

		onFilterBarExtension: function(oEvent){
			var oFilter = this.getView().byId("smartFilterBar");
			var ano = new Date().getFullYear();
			var mes = new Date().getMonth()+1;
			var description = this.monthDescription(mes);
			var oDefaultFilter = {
				"Year" : ano,
				"MonthDescription": description
			};
			oFilter.setFilterData(oDefaultFilter);			
		},

		monthDescription: function(mes){
			switch(mes){
				case 1:
					return "January";
					break;
				case 2:
					return "February";
					break;
				case 3:
					return "March";
					break;
				case 4:
					return "April";
					break;
				case 5:
					return "May";
					break;
				case 6:
					return "Jule";
					break;
				case 7:
					return "July";
					break;
				case 8:
					return "August";
					break;
				case 9:
					return "September";
					break;
				case 10:
					return "October";
					break;
				case 11:
					return "November";
					break;
				case 12:
					return "December"
					break;
			}
		},

		onRowSelectionChange: function(oEvent){
			var table = oEvent.getSource();
			var indexes = table.getSelectedIndices();

			var rows = indexes.map(i => {
				return table.getContextByIndex(i);
			});

			this.setState({
				selectedRows: rows,
				canDelete: rows.length === 1,
				canUpdate: rows.length === 1
			});
		},

		onDeletePressed: function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel();
			var that = this;

			var oState = this.getState();
			var {selectedRows} = oState;

			var id = selectedRows[0].getProperty("Code");

			oView.setBusy(true);

			oModel.remove(`/Expenses('${id}')`, {
				success: (response) =>{
					MessageBox.success("Excluido", {
						title: "Sucesso",
						onClose: function(){
							oView.setBusy(false);
							this.rebind();
						}.bind(this)
					})
				},
				error: (oError) => {
					oView.setBusy(false);
					that.ErrorHandling("Excluir", oError);					
				}
			})
		},

		onUpdatePressed: function(oEvent){
			var oState = this.getState();
			var {selectedRows} = oState;

			var model = this.getView().getModel();
			this._createEntry = model.createEntry("/Expenses()", {
			    properties : {	
					Code: selectedRows[0].getProperty("Code"),
					Date: selectedRows[0].getProperty("Date"),	
					Description: selectedRows[0].getProperty("Description"),
					Type: selectedRows[0].getProperty("Type"),
					TypeDescription: selectedRows[0].getProperty("TypeDescription"),
					Value: selectedRows[0].getProperty("Value")					
				}
			});

			this.doOpenDialog();
		},

		onAddNewEditClose: function(oEvent){
			if (this._createEntry)
			{
				var oModel = this.getView().getModel();
				oModel.deleteCreatedEntry(this._createEntry);
				oModel.resetChanges(null, /*bAll*/true, /*bDeleteCreatedEntities*/true);
			}

			this.ClearNotifications();
			this.DisableNotificationsFrom(this._addNewEditDialog);
			this._addNewEditDialog.setBusy(false);
			this._addNewEditDialog.close();
            this.rebind(); 

		},

		rebind: function(){
			var table =  this.getView().byId("STExpenses");
            table.rebindTable(true);  
			this.initState();
		},

		_onMessagePopoverPress: function(oEvent){
			this.ToggleNotificationsFor(oEvent.getSource());
		},

		EnableNotificationsTo: function(oDialog) {
            if (!this._messageManager) {
                this._messageManager = sap.ui.getCore().getMessageManager();
                this.getView().setModel(this._messageManager.getMessageModel(), "notifications");
            }
            this._messageManager.registerObject(oDialog, true);
        },

        DisableNotificationsFrom: function(oDialog) {
            this._messageManager && this._messageManager.unregisterObject(oDialog);
        },

        ClearNotifications: function() {
            this._messageManager && this._messageManager.removeAllMessages();
        },

        ShowNotificationsFor: function(oControl) {
            if (!this._notificationPopover) {
                this._notificationPopover = this._createNotificationDialog();
                this.getView().addDependent(this._notificationPopover);
            }
            this._notificationPopover.openBy(oControl);
        },

        ToggleNotificationsFor: function(oControl) {
            if (!this._notificationPopover) {
                this._notificationPopover = this._createNotificationDialog();
                this.getView().addDependent(this._notificationPopover);
            }
            if (this._notificationOpen) {
                this._notificationPopover.close();
            }
            else {
                this._notificationPopover.openBy(oControl);
            }

            this._notificationOpen = !this._notificationOpen;
        },

		SetFieldSate: function (field, state) {
            var message = new Message({
                id: field.getId(),
                type: state.type,
                message: state.text,
                target: "/Dummy",
                processor: state.context.getModel()
            });

            if (field.getValueState() !== state.type) {
                field.setValueState(state.type);
            }

            if (field.getValueStateText() !== state.text) {
                field.setValueStateText(state.text);
            }

            var model = sap.ui.getCore().getMessageManager().getMessageModel().getData();

            var messageToRemove = model.find(m => m.id === message.id);

            if (messageToRemove) {
                sap.ui.getCore().getMessageManager().removeMessages(messageToRemove);
            }

            if (state.type !== sap.ui.core.MessageType.None) {
                sap.ui.getCore().getMessageManager().addMessages(message);
            }
        },

		validateAll: function(oEvent){

			var oView = this.getView();
			var oData = oView.byId("SFAddNewEdit").getBindingContext().getObject();
			 
			var fldValue = this.byId("fldValue");
			var fldDate = this.byId("fldDate");
			var fldDescription = this.byId("fldDescription");

			this.ClearNotifications();

            // valor
			if (fldValue.getValueState() !== "None" || !oData["Value"]) {
				this.SetFieldSate(fldValue, {type: "Error", text: "Valor inválido", context: fldValue.getBindingContext() });
			}
			else {
				this.SetFieldSate(fldValue, {type: "None", text: "", context: fldValue.getBindingContext() });
			}

			if (fldDate.getValueState() !== "None" || !oData["Date"]) {
				this.SetFieldSate(fldDate, {type: "Error", text: "Data inválida", context: fldDate.getBindingContext() });
			}
			else {
				this.SetFieldSate(fldDate, {type: "None", text: "", context: fldDate.getBindingContext() });
			}

			if (fldDescription.getValueState() !== "None" || !oData["Description"]) {
				this.SetFieldSate(fldDescription, {type: "Error", text: "Descrição inválida", context: fldDescription.getBindingContext() });
			}
			else {
				this.SetFieldSate(fldDescription, {type: "None", text: "", context: fldDescription.getBindingContext() });
			}
             
            var notifications = this.getView().getModel("notifications").getData();

            var invalid = notifications ? notifications.find(m => m.type === "Error") : null;

			return !invalid;
		},

		_createDialog: function () {
            var oMessageTemplate = new MessageItem({
                type: '{messageDialog>type}',
                title: '{= ${messageDialog>title} || ${messageDialog>description}}',
                description: '{messageDialog>description}',
                subtitle: '{messageDialog>subtitle}',
                counter: '{messageDialog>counter}'
            });

            var oView = new MessageView({
                showDetailsPageHeader: true,
                items: {
                    path: "messageDialog>/messages",
                    template: oMessageTemplate
                }
            });

            var oMessageDialog = new Dialog({
                resizable: true,
                content: oView,
                title: "{messageDialog>/title}",
                contentHeight: "50%",
                contentWidth: "50%",
                verticalScrolling: false
            });

            return oMessageDialog;
        },

        _createNotificationDialog: function () {
            var oView = this.getView();

            var oMessageTemplate = new MessageItem({
                type: '{notifications>type}',
                title: '{notifications>message}',
                subtitle: '{notifications>additionalText}',
                description: '{notifications>description}'
            });

            var oMessagePopover = new MessagePopover({
                items: {
                    path: "notifications>/",
                    template: oMessageTemplate
                }
            });

            return oMessagePopover;
        },

        ErrorHandling: function (title, oError) {
            var message = "";

            if (oError.responseText) {
                var response = oError.responseText;

                if (String(response).startsWith("{")) {
                    response = JSON.parse(oError.responseText);
                }

                if (response.error) {
                    message = response.error.message.value;

                    if (response.error.innererror && response.error.innererror.details) {
                        var details = response.error.innererror.details;
                        var messageDetail = details.map(m => {
                            return m.message;
                        });

                        message = `${message}\r\n\r\n\t${messageDetail.join("\r\n")}`;
                    }
                }
                else if (response.Message) {
                    message = response.Message;
                }
                else {
                    message = response;
                }
            }
            else if (oError.error) {
                message = oError.error.message.value;

                if (oError.error.innererror && oError.error.innererror.details) {
                    var details = oError.error.innererror.details;
                    var messageDetail = details.map(m => {
                        return m.message;
                    });

                    message = `${message}\r\n\r\n\t${messageDetail.join("\r\n")}`;
                }
            }
            else if (oError) {
                message = oError;
            }
            else {
                message = "Erro inesperado.\r\nProcure o administrador do sistema."
            }

            MessageBox.show(message, {
                title: title,
                icon: MessageBox.Icon.ERROR,
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK
            });
        },

		onAddNewEditAccept: function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel();

			if (!this.validateAll(null)){
				MessageBox.alert("Verifique os erros apresentados!!",{
					title: "Gravar",
					icon: MessageBox.Icon.WARNING
				});
				return;
			}			 

			if (oModel.hasPendingChanges){
				this.doSave();
			}
			else{
				MessageBox.alert("Não há informações novas!!",{
					title: "Gravar",
					icon: MessageBox.Icon.WARNING
				});
				return;
			}			
		},

		doSave: function(){
			var oView = this.getView();
			var oModel = oView.getModel();			

			oView.setBusy(true);

			var id = this._createEntry.getProperty("Code");
			if (id === null) id="";

			var url="";
			 
			if (this._createEntry.getProperty("Code")){
				url = `/Expenses('${id}')`;
			}
			else{
				url = "/Expenses";
			}		 

			var payload = {
				"Code": id,
				"Description": this._createEntry.getProperty("Description"),
				"Type": this._createEntry.getProperty("Type"),
				"Date": this._createEntry.getProperty("Date"),
				"Value": this._createEntry.getProperty("Value")
			};

			if (this._createEntry.getProperty("Code")){
				oModel.update(url,payload,{
					success: (response) => {
							oView.setBusy(false);
							MessageBox.success("Dados atualizados",{
								title: "Sucesso",
								onClose: function(){
									this.rebind(); 
									this.onAddNewEditClose(null);
								}.bind(this)
							})
						},
						error: (oError)=> {
							oView.setBusy(false);
							this.ErrorHandling("Salvar", oError);
						}
				});   

			}
			else{
				oModel.create(url,payload,{
					success: (response) => {
							oView.setBusy(false);
							MessageBox.success("Dados atualizados",{
								title: "Sucesso",
								onClose: function(){
									this.rebind(); 
									this.onAddNewEditClose(null);
								}.bind(this)
							})
						},
						error: (oError)=> {
							oView.setBusy(false);
							this.ErrorHandling("Salvar", oError);
						}
				});    
			}

			// var oData = this.getView().byId("STExpenses");
			// delete oData.__metadata;

			// oModel.submitChanges({
			// 	success: (response) => {
			// 		oView.setBusy(false);
			// 		MessageBox.success("Dados atualizados",{
			// 			title: "Sucesso",
			// 			onClose: function(){
			// 				this.rebind(); 
			// 				this.onAddNewEditClose(null);
			// 			}.bind(this)
			// 		})
			// 	},
			// 	error: (oError)=> {
			// 		oView.setBusy(false);
			// 		this.ErrorHandling("Salvar", oError);
			// 	}
			// });
		}
		
		//end
	});
});