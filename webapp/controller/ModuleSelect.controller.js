sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox"
	],

	function (BaseController, JSONModel, History, MessageBox) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.ModuleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
				this.getRouter().getRoute("ModuleSelect").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				this._createHeaderModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				var sModuleType = oStorage.get("sMouleType");
				this.byId("idService").setSelectedKey(sModuleType);
				this.getServiceTypeDD();

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
			/*onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},*/

			onSearch: function () {

				this.InputValidation() !== true ?
					"" : this.onNavigation();

				// this.getModel().setProperty("/VisibleManagePttyCash", true);
				// this.getModel().setProperty("/VisibleRecordProcessInvoice", true);

			},

			onNavigation: function () {
				var sSubServiveType = this.getModel().getProperty("/ModuleSearch/Header/SUbServiceKey/");
				this.setDataLocalStaorage(sSubServiveType);
				this.getModel().setProperty("/ServiceProduct/", sSubServiveType);
				var sModuleType = this.byId("idService").getSelectedKey();
				var sTargetRoute = sModuleType === "ZSSM" ? "PMCreateServiceRequest" :
					sModuleType === "ZSSH" ? "HRCreateRequest" : sModuleType === "ZSSI" ? "ITCreateRequest" : sModuleType === "ZSSF" ?
					"FinanceCreateRequest" : sModuleType === "ZSSS" ?
					"SCMCreateRequest" : "";

				this.oRouter.navTo(sTargetRoute);
			},
			InputValidation: function () {
				var bValid = true;
				if (!this.getModel().getProperty("/ModuleSearch/Header/ServiceTypeKey/")) {
					this.getModel().setProperty("/ModuleSearch/Header/ServiceTypeKey/", "")

					bValid = false;
				}

				if (!this.getModel().getProperty("/ModuleSearch/Header/SUbServiceKey/")) {
					this.getModel().setProperty("/ModuleSearch/Header/SUbServiceKey/", "")

					bValid = false;
				}
				return bValid;
			},

			setDataLocalStaorage: function (sVal) {
				// Get access to local storage
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

				// Define your data object
				// var payloadObject = {
				// 	"UserName": "JohnDoe123",
				// 	"P2_Represen": "JaneSmith456",
				// 	"P2_Rep_Pos": "Representative",
				// 	"P2_CorName": "CorporationX",
				// 	// ... rest of your payload
				// };

				// Convert the object to string before storing
				//		var jsonString = JSON.stringify(payloadObject);

				// Store the data
				oStorage.put("sSubServiceType", sVal);

				// Retrieve the data
				//	var retrievedData = oStorage.get("myDataKey");

				// If you want to parse the retrieved data back to an object
				// if (retrievedData) {
				// 	var parsedData = JSON.parse(retrievedData);
				// 	// Use the parsedData object as needed
				// }
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