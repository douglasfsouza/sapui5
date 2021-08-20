sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/library',
    'sap/ui/core/Locale',
    'sap/ui/core/LocaleData',
    'sap/ui/model/type/Currency'
], function(Controller, mobileLibrary,Locale,LocaleData,Currency) {
    'use strict';

    return Controller.extend("doug.ui.Controller.App",{
        formatMail: function(sFirstName, sLastName){
            return mobileLibrary.URLHelper.normalizeEmail(
            sFirstName + "." + sLastName + "@gmail.com", "Hi Doug","You are coding in SAPUI5!!!");
            
        },
        formatStockValue: function(sValue, sLevel,sCurrency){
            var oBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage();
            var oLocale = new Locale(oBrowserLocale);
            var oLocaleData = new LocaleData(oLocale);
            var oCurrency = new Currency(oLocaleData.mData.currencyFormat);
            return oCurrency.formatValue([sValue * sLevel,sCurrency],"string");
        },
        formatPrice: function(sValue, sCurrency){
            var oBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage();
            var oLocale = new Locale(oBrowserLocale);
            var oLocaleData = new LocaleData(oLocale);
            var oCurrency = new Currency(oLocaleData.mData.currencyFormat);
            return oCurrency.formatValue([sValue, sCurrency],"string");
        },
        
        onSelectedItem: function(oEvent){
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext('products')
            var sPath = oContext.getPath();
            var oDetail = this.byId('productDetail');
            oDetail.bindElement({path: sPath, model: 'products'});
        }
    });
    
});