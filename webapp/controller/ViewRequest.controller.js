sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("com.swcc.Template.controller.ViewRequest", {
		onInit: function () {

			this.oRouter = this.getRouter();
			this.getRouter().getRoute("ViewRequest").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function () {
			this._createItemDataModel();
			this.getViewRequestDetails();

		},
		_createItemDataModel: function () {
			this.getModel().setData({
				busy: false,
				RequestDetails: {
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

		getViewRequestDetails: function () {
			var filters = [{
					path: "Username",
					value: "WT_POWER",
					group: "ViewRequestFilter"
				}

			];

			var dynamicFilters = this.getFilters(filters);

			var sAPI = `/ViewRequestSet`;
			debugger;

			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', sAPI, null, dynamicFilters.ViewRequestFilter)
				.then(function (oResponse) {
					this.getModel().setProperty("/RequestDetails/itemData/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));

		},

		onPressTile: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("ModuleSelect");
		}

	});

});