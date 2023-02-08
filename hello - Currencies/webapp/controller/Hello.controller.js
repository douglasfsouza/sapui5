sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox',
    'sap/ui/model/json/JSONModel'
], function(Controller, MessageBox,JSONModel) {
    'use strict';
    return Controller.extend("hello.App.Controller.Hello",{
        onInit: function(){
            var oModel = new JSONModel('Countries.json');
            this.getView().setModel(oModel);
           // MessageBox.alert("Init");
        },
        onPress:function(oEvent){
            MessageBox.alert("Hello world");
        },
        onLer:function(oEvent){
            var btn = this.byId("input");
            MessageBox.alert(btn.getValue());
        },        

        onMoedasPress1: function(oEvent){
            if  (!this._moedasDialog){
                this._moedasDialog = this.loadFragment({
                    name: "hello.fragment.Moedas"
                });
            }

            this._moedasDialog.then(function(oDialog){
                oDialog.open();
            });
        },

        onMoedasPress: function(oEvent){
            debugger;
            if (!this._moedasDialog){
                this._moedasDialog = this.loadFragment({
                    name: "hello.fragment.Moedas"
                });
            }

            this._moedasDialog.then(function(oDialog){
                oDialog.open();
            });
        },
        
        onMoedasBackPress: function(oEvent){
            this._moedasDialog && this._moedasDialog.then(function(oDialog){
                oDialog.close();
                oDialog.destroy();
                delete this._moedasDialog;
            }.bind(this));
        }
    })
    
});