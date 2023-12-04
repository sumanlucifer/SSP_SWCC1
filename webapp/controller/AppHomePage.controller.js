sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.AppHomePage", {
			onInit: function () {
			    
			    

				this.oRouter = this.getRouter();

			},
			onPressTile: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("ModuleSelect");
			}
		})
	})