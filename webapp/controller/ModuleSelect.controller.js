sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.MouleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
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
				debugger;
				const oModel = this.getOwnerComponent().getModel("ModuleInput");

				this.getAPI.crudOperations_ODATA(oModel, 'read', '/ZCDSV_SS_SERVICES_F4')
					.then(function (oResponse) {
						var aData = oResponse.data;

					}.bind(this));

			},

			testCPI_API: function () {

				var oManifest = this.getOwnerComponent().getManifest();
				var oDataSources = oManifest["sap.app"].dataSources;
				var oRemoteService = oDataSources.CPI_API;

				// Create an OData model using the configured data source
				var oModel = new sap.ui.model.odata.v2.ODataModel(oRemoteService.uri);

				debugger

				// Perform a read operation to fetch data from the remote API
				oModel.read("/http/sf", {
					success: function (data) {
						// Handle successful data retrieval
						console.log("Data from remote API:", data);
					},
					error: function (error) {
						// Handle error
						console.error("Error fetching data from remote API:", error);
					}
				});

				// var oOptions = {
				// 	url: "http/sf",
				// 	type: "GET"
				// };
				// this.getAPI.crudOperations_REST(oOptions)
				// 	.then(function (oResponse) {
				// 		var aData = oResponse.data;

				// 	}.bind(this));
			}

		})
	})