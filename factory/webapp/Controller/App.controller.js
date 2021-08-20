sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/library',
    'sap/ui/core/Locale',
    'sap/ui/core/LocaleData',
    'sap/ui/model/type/Currency',
    'sap/m/ObjectAttribute'
], function(Controller, mobileLibrary,Locale,LocaleData,Currency,ObjectAttribute) {
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
        },
        productListFactory: function(sId,oContext){
            var oUiControl;
            
            if (oContext.getProperty("UnitsInStock") === 0 && oContext.getProperty("Discontinued")){
                oUiControl = this.byId("ProductSimple").clone(sId);
            }
            else{
                oUiControl = this.byId("ProductExtended").clone(sId);
                if (oContext.getProperty("UnitsInStock") <1){
                    oUiControl.addAttribute(new ObjectAttribute({
                        text:"Out of Stock"
                    }));
                }
            }
            return oUiControl;
        }
    });
    
});