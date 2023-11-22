sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel, Sorter) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.MouleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
				debugger;
				this.testCPI_API();
				this.testOdata_API();

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			},
			testOdata_API: function () {
				const oModel = this.getOwnerComponent().getModel("ModuleInput");

				this.getAPI.crudOperations_ODATA(oModel, 'read', '/I_Producttype')
					.then(function (oResponse) {
						var aData = oResponse.data;

					}.bind(this));

			},

			testCPI_API: function () {

				var oOptions = {
					url: "http/sf",
					type: "GET"
				};
				this.getAPI.crudOperations_REST(oOptions)
					.then(function (oResponse) {
						var aData = oResponse.data;

					}.bind(this));
			}

		})
	})