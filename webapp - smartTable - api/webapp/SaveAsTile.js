sap.ui.define([
	"sap/ui/core/XMLComposite",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/ui/model/Filter',
    "sap/m/MessageBox",
    "./library",
	"sap/ui/core/syncStyleClass",
], function (XMLComposite, JSONModel, ODataModel, Filter, MessageBox, library, syncStyleClass) {
	"use strict";

    const MODEL_NAME = "s4v34st1le";

    return XMLComposite.extend("webapp.SaveAsTile", {
        _isDataLoaded: false,
        _dialog: null,
        
		metadata: {
			properties: {
                mode: {type: "webapp.SaveAsTileMode", defaultValue: "Create"},
                entitySet: {type: "string", defaultValue: ""}, 
                key: {type: "string", defaultValue: ""},
                userName: {type: "string", defaultValue: ""},
                component: {type: "string", defaultValue: ""},
                componentTarget: {type: "string", defaultValue: ""},
                filterVariant: {type: "string", defaultValue: ""},
                tableVariant: {type: "string", defaultValue: ""}
            },
			events: {
				created : {
					parameters : {
						tile : {type : "object"}
					}
				},
				changed : {
					parameters : {
						tile : {type : "object"}
					}
				}
			}
        },

        constructor: function(sId, mSettings) {
            XMLComposite.apply(this, arguments);
        },

        open: function() {
            var entitySet = "MenuNavigationItems";
            var key = this.getProperty("key");

            if (key) {
                var url = `/${entitySet}(${key})`;
                this.getModel().read(url, {
                    success: this._openDialog.bind(this),
                    error: this.onOpenError.bind(this)
                });    
            }
            else
            {
                this._openDialog();
            }
        },

        _openDialog: function(oData) {
            var result = null;

            if (oData) {
                result = oData.results && oData.results.length > 0 ? oData.results[0] : null;
            }

            var record = {
                Code: oData ? result.Code : "*new*",
                U_GROUPNAME: result ? result.U_GROUPNAME : "",
                U_TITLE: result ? result.U_TITLE : "",
                U_SUBTITLE: result ? result.U_SUBTITLE : "",
                U_FOOTER: result ? result.U_FOOTER : "",

                U_USERNAME: result ? result.U_USERNAME : this.getProperty("userName"),
                U_ENTITYSET: result ? result.U_ENTITYSET : this.getProperty("entitySet"),
                U_COMPONENT: result ? result.U_COMPONENT : this.getProperty("component"),
                U_TARGET: result ? result.U_TARGET : this.getProperty("componentTarget"),
                U_TABLEVARIANT: result ? result.U_TABLEVARIANT : this.getProperty("tableVariant"),
                U_FILTERVARIANT: result ? result.U_FILTERVARIANT : this.getProperty("filterVariant"),
                U_SHARED: result ? result.U_SHARED : "N"
            };

            var oModel = new JSONModel(record);

            this.setModel(oModel, MODEL_NAME);

            if (!this._dialog) {
                this._dialog = this.byId("stdialog");

                var that = this;

                this._dialog.attachAfterOpen(null, function() {
                    var oInput = that.byId("st_title");
    
                    var eSelect = {
                        onfocusin: function() {
                            this.selectText(0, 100);
                            this.removeEventDelegate(eSelect);
                        }.bind(oInput)
                    };
    
                    oInput.addEventDelegate(eSelect);
    
                    oInput.focus();
                }, this);
            }

            this._dialog.open();
        },

        onOpenError: function(oError) {
            var message = "";

            if (oError.responseText)
            {
                var response = oError.responseText;

                if (String(response).startsWith("{")) {
                    response = JSON.parse(oError.responseText);
                }
                
                if (response.error) {
                    message = response.error.message.value;
                }
                else if(response.Message)
                {
                    message = response.Message;
                }
                else 
                {
                    message = response;
                }
            }
            else
            {
                message = "Erro inesperado.\r\nProcure o administrador do sistema."
            }

            MessageBox.show(message, {
                title: "Salvar bloco",
                icon: MessageBox.Icon.ERROR,
                actions: [ MessageBox.Action.OK ],
                emphasizedAction: MessageBox.Action.OK
            });
        },

        onSave: function (oEvent) {
            var oModel = this.getModel(MODEL_NAME);
            var oDataModel = this.getModel();

            var url     = "";
            var payLoad = oModel.getData();
            var method  = null; 
            var key     = payLoad.Code;

            this.setBusy(true);

            // Correção do valor U_SHARED, trocando por S/N
            var oShared = this.byId("st_shared");
            payLoad.U_SHARED = oShared.getState() ? 'S' : 'N';
            //    

            if (key === "*new*") {
                url = `/MenuNavigationItems()`;
                method = oDataModel.create.bind(oDataModel);
            }
            else
            {
                var url = `/MenuNavigationItems('${key}')`;
                method = oDataModel.update.bind(oDataModel);
            }

            method(url, payLoad, {
                success: this.onSaveSuccess.bind(this),
                error: this.onSaveError.bind(this, payLoad)
            });
        },

        onClose: function (oEvent) {
            this._dialog.close();
        },

        onSaveSuccess: function (oData) {
            this.setBusy(false);

            MessageBox.information(`Bloco: '${oData.U_TITLE}' foi gravado com sucesso.\r\n\r\nRecarregue a página inicial para executá-lo.`, {
                title: "Blocos",
                actions: MessageBox.Action.OK,
                emphasizedAction: MessageBox.Action.OK,        
                initialFocus: MessageBox.Action.OK, 
                onClose: function (oAction) {
                    this.onClose();
                }.bind(this)
            });
        },

        onSaveError: function (oData, oError) {
            this.setBusy(false);
            
            var message = "";
            if (oError.responseText)
            {
                var response = oError.responseText;

                if (String(response).startsWith("{")) {
                    response = JSON.parse(oError.responseText);
                }
                
                if (response.error) {
                    message = response.error.message.value;
                }
                else if(response.Message)
                {
                    message = response.Message;
                }
                else 
                {
                    message = response;
                }
            }
            else
            {
                message = "Erro inesperado.\r\nProcure o administrador do sistema."
            }

            MessageBox.information(`Ocorreu um erro ao gravar o bloco '${oData.U_TITLE}'\r\n\r\n${message}`, {
                title: "Blocos",
                actions: MessageBox.Action.OK,
                emphasizedAction: MessageBox.Action.OK,        
                initialFocus: MessageBox.Action.OK, 
                onClose: function (oAction) {
                    this.onClose();
                }.bind(this)
            });
        },

        removeTile: async function (key, callback) {
            var entitySet = "MenuNavigationItems";
            var url = `/${entitySet}(${key})`;
            var oDataModel = this.getModel();
            var that = this;

            oDataModel.read(url, {
                success: function(oData) {
                    var record = oData.results && oData.results.length > 0 ? oData.results[0] : undefined;

                    if (!record) {
                        MessageBox.error("Bloco não encontrado", { title: "Excluir bloco"});
                    }
                    else
                    {
                        MessageBox.confirm(`Confirma a exclusão do bloco selecionado\r\n\r\n"${record.U_TITLE}"`, {
                            title: "Excluir bloco",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],                 
                            emphasizedAction: MessageBox.Action.NO,        
                            initialFocus: MessageBox.Action.NO,
                            onClose: function(button) {
                                if (button === MessageBox.Action.YES) {
                                    var url = `/${entitySet}('${key}')`;

                                    oDataModel.remove(url, {
                                        success: that.onRemoveSuccess.bind(that, record, callback),
                                        error: that.onRemoveError.bind(that, record, callback)
                                    });
                                }
                            }
                        });
                    }
                }.bind(this),
                error: this.onOpenError.bind(this)
            });    
        },

        onRemoveSuccess: function (oData, callback) {
            this.setBusy(false);

            MessageBox.information(`Bloco: '${oData.U_TITLE}' foi removido com sucesso.\r\n\r\nRecarregue a página inicial.`, {
                title: "Blocos",
                actions: MessageBox.Action.OK,
                emphasizedAction: MessageBox.Action.OK,        
                initialFocus: MessageBox.Action.OK, 
                onClose: function() {
                    callback && callback(true);
                }
            });
        },

        onRemoveError: function (oData, callback, oError) {
            this.setBusy(false);
            
            var message = "";
            if (oError.responseText)
            {
                var response = oError.responseText;

                if (String(response).startsWith("{")) {
                    response = JSON.parse(oError.responseText);
                }
                
                if (response.error) {
                    message = response.error.message.value;
                }
                else if(response.Message)
                {
                    message = response.Message;
                }
                else 
                {
                    message = response;
                }
            }
            else
            {
                message = "Erro inesperado.\r\nProcure o administrador do sistema."
            }

            MessageBox.information(`Ocorreu um erro ao remover o bloco '${oData.U_TITLE}'\r\n\r\n${message}`, {
                title: "Blocos",
                actions: MessageBox.Action.OK,
                emphasizedAction: MessageBox.Action.OK,        
                initialFocus: MessageBox.Action.OK, 
                onClose: function (oAction) {
                    callback && callback(false);
                }.bind(this)
            });
        },

	});

});