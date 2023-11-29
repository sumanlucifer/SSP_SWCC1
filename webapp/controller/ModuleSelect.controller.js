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

			onSelect: function (oEve) {

				var sKey = oEve.getSource().getSelectedKey();
				if (sKey === "1") {
					this.oRouter.navTo("FinanceRequest");
				}

			},

			onSearch: function () {
				this.getModel().setProperty("/VisibleManagePttyCash", true);
				this.getModel().setProperty("/VisibleRecordProcessInvoice", true);
				this.oRouter.navTo("FinanceRequest");
				//	this.oRouter.navTo("LandingView");

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