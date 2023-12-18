sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, Filter, FilterOperator, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.UserManagementRequest", {

			onInit: function () {

				this.oRouter = this.getRouter();

				this._createItemDataModel();

				this.getUserDetails();

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					OpenItemRequestData: {
						itemData: []
					}
				});
			},

			getUserDetails: function () {

				var Filter = this.getFilters("WT_POWER", true);

				this.getAPI.oDataAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'read', '/UserSet',
						Filter, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/OpenItemRequestData/itemData", oResponse.results);

					}.bind(this));

			},

			getFilters: function (sUserName, sIsRequest) {

				var sUserNameFilter = new sap.ui.model.Filter({
					path: "SapID",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sUserName
				});

				var sIsRequestFilter = new sap.ui.model.Filter({
					path: "IsRequest",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sIsRequest
				});
				var aUserFilter = [];
				aUserFilter.push(sUserNameFilter, sIsRequestFilter);

				return aUserFilter;

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
				this.getOwnerComponent().getRouter().navTo("ModuleSelect");
			}
		})
	})