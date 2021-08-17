sap.ui.define([
    'sap/m/Button',
    'sap/m/MessageToast',
    'sap/m/Text',
    'sap/ui/core/mvc/XMLView',
], function(Button, MessageToast,Text,XMLView) {
    'use strict';

    /*

    new Button({
        text: "Ready...",
        press: function() {
            MessageToast.show("Hello World!");

        } 

    }).placeAt("content");
    */
   /*
   new Text({
       text: "Hello World"
}).placeAt("content");
*/
XMLView.create({
    viewName : "udemy/View/DgSetModel"
    }).then(function(oView){
        oView.placeAt("content")
    })
    
});