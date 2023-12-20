sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("com.swcc.Template.controller.ViewRequest", {
		onInit: function () {

			this.oRouter = this.getRouter();

			this._createItemDataModel();
			this.BPFlagCheckAPI();

		},
		_createItemDataModel: function () {
			this.getModel().setData({
				busy: false,
				OpenItemRequestData: {
					itemData: []
				}
			});
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

		BPFlagCheckAPI: function () {
			var sAPI = `/CheckUserSet(UserName='WT_POWER')`;

			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
				.then(function (oResponse) {
					this.getModel().setProperty("/TileData/Header/", oResponse);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
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
		onPressTile: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("ModuleSelect");
		}

	});

});