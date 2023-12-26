sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (BaseController, History, MessageBox) {
	"use strict";

	return BaseController.extend("com.swcc.Template.controller.ViewRequest", {
		onInit: function () {

			this.oRouter = this.getRouter();
			this.getRouter().getRoute("ViewRequest").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function () {
			this._createItemDataModel();
			this.getViewRequestDetails();
			//this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
			//this.getModel().setProperty("/ServiceDescription", sServiceDescription);
			//this.getModel().setProperty("/PMCreateRequest/CustomDisplayData/BaseUnit", sBaseUnit);

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
			this.navigationBack();
		},
		onRowPress: function (oEvent) {
			debugger;
			var oSelected = oEvent.getSource().getBindingContext().getObject();
			this.getOwnerComponent().getRouter().navTo("DetailRequest", {
				RequestID: oSelected.RequestID
			});
		},

		getViewRequestDetails: function () {
			var filters = [{
					path: "Username",
					value: "WT_POWER",
					group: "ViewRequestFilter"
				}

			];
			this.getModel().setProperty("/busy", true);
			var dynamicFilters = this.getFilters(filters);
			//var sortParams = [new sap.ui.model.Sorter("CreatedOn", true)];
			var sAPI = `/ViewRequestSet`;
			debugger;

			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', sAPI, null, dynamicFilters.ViewRequestFilter,
					null)
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