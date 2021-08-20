sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/library'
], function(Controller, mobileLibrary) {
    'use strict';

    return Controller.extend("doug.ui.Controller.App",{
        formatMail: function(sFirstName, sLastName){
            return mobileLibrary.URLHelper.normalizeEmail(
            sFirstName + "." + sLastName + "@gmail.com", "Hi Doug","You are coding in SAPUI5!!!");
            
        }
    });
    
});