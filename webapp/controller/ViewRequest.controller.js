sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, History, MessageBox, Filter, FilterOperator) {
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

			var oSelected = oEvent.getSource().getBindingContext().getObject();
			this.getOwnerComponent().getRouter().navTo("DetailRequest", {
				RequestID: oSelected.RequestID
			});
		},

		getViewRequestDetails: function () {
			var filters = [{
					path: "Username",
					value: this.getCurrentUserLoggedIn(),
					group: "ViewRequestFilter"
				}

			];
			this.getModel().setProperty("/busy", true);
			var dynamicFilters = this.getFilters(filters);
			//var sortParams = [new sap.ui.model.Sorter("CreatedOn", true)];
			var sAPI = `/ViewRequestSet`;
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
		onSearch: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters.push(
					this.createFilter("RequestID", FilterOperator.Contains, sQuery, false)
				);
			}

			var oTable = this.byId("idViewRequestTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters);
		},
		createFilter: function (key, operator, value, useToLower) {
			return new Filter(
				useToLower ? "tolower(" + key + ")" : key,
				operator,
				useToLower ? "'" + value.toLowerCase() + "'" : value
			);
		},

		onPressTile: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("ModuleSelect");
		}

	});

});