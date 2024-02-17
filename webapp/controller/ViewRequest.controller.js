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
		_onObjectMatched: function (oEvent) {
			debugger;
			var sStatusId = oEvent.getParameter("arguments").StatusId;

			this._createItemDataModel();
			var statusFilters = this.StatusRequestFilter(sStatusId);
			this.getViewRequestDetails(statusFilters);

		},

		StatusRequestFilter: function (sStatus) {
			var filters = [{
					path: "Username",
					value: this.getCurrentUserLoggedIn(),
					group: "SubmitStatusFilter",
					useOR: true
				}, {
					path: "Status",
					value: "Request Submitted",
					group: "SubmitStatusFilter"
				}, {
					path: "Username",
					value: this.getCurrentUserLoggedIn(),
					group: "CompleteFilter",
					useOR: true
				}, {
					path: "Status",
					value: "Request Completed",
					group: "CompleteFilter"
				}, {
					path: "Username",
					value: this.getCurrentUserLoggedIn(),
					group: "InProgessFilter",
					useOR: true
				}, {
					path: "Status",
					value: "Request under Process",
					group: "InProgessFilter"
				}, {
					path: "Username",
					value: this.getCurrentUserLoggedIn(),
					group: "allRequestFilter",

				}

			];

			var dynamicFilters = this.getFilters(filters);
			var statusFilter;
			if (sStatus === "Open") {
				statusFilter = dynamicFilters.SubmitStatusFilter;
			} else if (sStatus === "In_Progress") {
				statusFilter = dynamicFilters.InProgessFilter
			} else if (sStatus === "Done") {
				statusFilter = dynamicFilters.CompleteFilter
			} else if (sStatus === "NA") {
				statusFilter = dynamicFilters.allRequestFilter
			}

			return statusFilter;
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

		getViewRequestDetails: function (statusFilters) {

			this.getModel().setProperty("/busy", true);
			var sAPI = `/ViewRequestSet`;
			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', sAPI, null, statusFilters,
					null)
				.then(function (oResponse) {
					this.getModel().setProperty("/RequestDetails/itemData/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					// 	MessageBox.error(error.responseText);
					this._handleError(error);
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