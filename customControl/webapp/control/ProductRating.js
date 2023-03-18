sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/RatingIndicator",
    "sap/m/Label",
    "sap/m/Button"
], function(Control,
	RatingIndicator,
	Label,
	Button){
    "use strict";
    return Control.extend("dgs.customctrl.control.ProductRating",{
        metadata:{
            properties:{
                value:{
                    type: "float",
                    defaultValue: 0
                }
            },
            aggregations:{
                _rating:{
                    type: "sap.m.RatingIndicator", 
                    multiple: false,
                    visibility: "hidden"
                },
                _label:{
                    type: "sap.m.Label",
                    multiple: false,
                    visibility: "hidden"
                },
                _button:{
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                }
            },
            events:{
                change:{
                    parameters:{
                        value: {
                            type: "int"
                        }
                    }
                }
            }
        },
        init: function(){
            this.setAggregation("_rating", new RatingIndicator({
                value: this.getValue(),
                iconSize: "2rem",
                visualMode: "Half",
                liveChange: this._onRate.bind(this)
            }));
            this.setAggregation("_label", new Label({
                text: "Rate this product now!!"
            }).addStyleClass("sapUiTinyMarginTopBottom"));
            this.setAggregation("_button", new Button({
                text: "Rate",
                press: this._onSubmit.bind(this)
            }).addStyleClass("sapUiTinyMarginTopBottom"));
        },

        setValue: function(fValue){
            this.setProperty("value", fValue, true);
            this.getAggregation("_rating").setValue(fValue);
        },

        reset: function(){
            this.setValue(0);
            this.getAggregation("_label").setDesign("Standard");
            this.getAggregation("_rating").setEnabled(true);
            this.getAggregation("_label").setText("Please rate it");
            this.getAggregation("_button").setEnabled(true);
        },

        _onRate: function(oEvent){
            var fValue = oEvent.getParameter("value");
            this.setProperty("value", fValue, true);
            this.getAggregation("_label").setText(`Your rating: ${fValue} out of ${oEvent.getSource().getMaxValue()} `);
            this.getAggregation("_label").setDesign("Bold");
        },

        _onSubmit: function(oEvent){
            this.getAggregation("_rating").setEnabled(false);
            this.getAggregation("_label").setText("Thanks!!");
            this.getAggregation("_button").setEnabled(false);
            this.fireEvent("change",{
                value: this.getValue()
            });
        },
        renderer: function(oRm, oControl){
            oRm.openStart("div", oControl);
            oRm.class("myProductRating");
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_rating"));
            oRm.renderControl(oControl.getAggregation("_label"));
            oRm.renderControl(oControl.getAggregation("_button"));
            oRm.close("div");               
        }
    })
})  
