sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel, Sorter) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.MouleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			}
		})
	})