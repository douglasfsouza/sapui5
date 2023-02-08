sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox'
], function(Controller, MessageBox) {
    'use strict';
    return Controller.extend("hello.App.Controller.Hello",{
        onInit: function(){
            MessageBox.alert("Init");
        },
        onPress:function(oEvent){
            MessageBox.alert("Hello world");
        },
        onLer:function(oEvent){
            var btn = this.byId("input");
            MessageBox.alert(btn.getValue());
        },
        onMoedasPress(oEvent){
            if (!this.moedasDialog){
                this.moedasDialog = this.loadFragment({
                    name:"hello.fragment.Moedas"
                });
            }
            
            this.moedasDialog.then(function(oDialog){
                oDialog.open();
            });
        }
    })
    
});