sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.AppHomePage", {
			onInit: function () {
				this.oRouter = this.getRouter();

			},
			handleBackPress: function () {

				var oHistory, sPreviousHash;
				oHistory = History.getInstance();

				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("HomePage", {}, true);
				}

			},

			onPressTile: function (oEvent) {
				debugger;
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				var sVal = oEvent.getSource().getId().split("--")[1];
				oStorage.put("sMouleType", sVal);
				this.oRouter.navTo("ModuleSelect");
			}
		})
	})