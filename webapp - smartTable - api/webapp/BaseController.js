/*!
 * ${copyright}
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/message/Message",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/MessageBox",
    'sap/m/MessageItem',
    'sap/m/MessagePopover',
    'sap/m/MessageView',
    "sap/m/PDFViewer"
], function (Controller, Message, JSONModel, Button, Dialog, MessageBox, MessageItem, MessagePopover, MessageView, PDFViewer) {
    "use strict";

    return Controller.extend("webapp.BaseController", {
        _messageDialog: null,
        _messageManager: null,
        _notificationPopover: null,
        _notificationOpen: false,

        onInit: function () {
            //this._messageManager = sap.ui.getCore().getMessageManager();
            //this.getView().setModel(this._messageManager.getMessageModel(), "notifications");
            var oDataModel = this.getView().getModel();

            if (!oDataModel) {
                var oParent = this.getOwnerComponent();

                var oModel = oParent.initializeModel();

                oModel.metadataLoaded(true).then(() => {
                    if (oModel.getMetaModel()) {
                        oParent.setModel(oModel);
                        this.DataModelLoaded();
                    }
                });
            }
            else {
                this.DataModelLoaded();
            }
        },

        DataModelLoaded: function () {
            // override
        },

        ShowMessageView: function (title, messages, onClose) {
            if (!this._messageDialog) {
                this._messageDialog = this._createDialog();
            }

            var model = new JSONModel({
                title: title,
                messages: messages
            });

            this._messageDialog.setBeginButton(new Button({
                press: function () {
                    this.getParent().close();
                    onClose && onClose();
                },
                text: "Fechar"
            }));

            this._messageDialog.setModel(model, "messageDialog");
            this._messageDialog.open();
        },

        ShowInfo: function (title, message, buttons) {
            MessageBox.information(message, {
                title: title
            });
        },

        ShowError: function (title, message, buttons) {
            MessageBox.error(message, {
                title: title
            });
        },

        ShowAlert: function (title, message, buttons) {
            MessageBox.alert(message, {
                title: title
            });
        },

        EnableNotificationsTo(oDialog) {
            if (!this._messageManager) {
                this._messageManager = sap.ui.getCore().getMessageManager();
                this.getView().setModel(this._messageManager.getMessageModel(), "notifications");
            }
            this._messageManager.registerObject(oDialog, true);
        },

        DisableNotificationsFrom(oDialog) {
            this._messageManager && this._messageManager.unregisterObject(oDialog);
        },

        ClearNotifications() {
            this._messageManager && this._messageManager.removeAllMessages();
        },

        ShowNotificationsFor(oControl) {
            if (!this._notificationPopover) {
                this._notificationPopover = this._createNotificationDialog();
                this.getView().addDependent(this._notificationPopover);
            }
            this._notificationPopover.openBy(oControl);
        },

        ToggleNotificationsFor(oControl) {
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