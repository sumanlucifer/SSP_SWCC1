sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.UserProfile", {

			onInit: function () {

				this.oRouter = this.getRouter();

			},
			handleBackPress: function () {
				this.navigationBack();

			}

		})
	})