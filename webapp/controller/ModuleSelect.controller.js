sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.ModuleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
				this._createHeaderModel();
				this.byId("idService").setSelectedKey("ZSSM");
				this.getServiceTypeDD();
				// this.testCPI_API();

			},
			_createHeaderModel: function () {
				this.getModel().setData({
					busy: false,
					ModuleSearch: {
						Header: {},
						SelectServiceType: [],
						SelectSubServiceType: []
					}
				});
			},
			getServiceTypeDD: function () {

				var sProductTypeFilter = new sap.ui.model.Filter({
					path: "ProductType",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: this.byId("idService").getSelectedKey()
				});

				var Filter = [];
				Filter.push(sProductTypeFilter);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataReadAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'read', '/ZCDSV_PRODUCTTYPEVH/', null, Filter)
					.then(function (oResponse) {
						this.getModel().setProperty("/ModuleSearch/SelectServiceType/", oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			onSelectServiceTypeDD: function () {
				var sProductTypeFilter = new sap.ui.model.Filter({
					path: "ProductGroup",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: this.getModel().getProperty("/ModuleSearch/Header/ServiceTypeKey/")
				});

				var Filter = [];
				Filter.push(sProductTypeFilter);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataReadAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'read', '/ZCDSV_SUBSERVICEVH/', null, Filter)
					.then(function (oResponse) {
						this.getModel().setProperty("/ModuleSearch/SelectSubServiceType/", oResponse.results);
						this.getModel().setProperty("/busy", false);

					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));
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
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},

			onSearch: function () {
				// this.getModel().setProperty("/VisibleManagePttyCash", true);
				// this.getModel().setProperty("/VisibleRecordProcessInvoice", true);
				this.oRouter.navTo("PMRequest");
				//	this.oRouter.navTo("LandingView");

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