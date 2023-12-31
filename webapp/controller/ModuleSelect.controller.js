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
				//var url = window.location.href;
				//var currentURL = window.location.href;
				//var sOrderID = 123;
				//Get URL parameters
				var urlParameters = jQuery.sap.getUriParameters();

				// Retrieve a specific parameter
				//var sOrderID = urlParameters.get("sOrderID");

				// Use sOrderID as needed
				//console.log(sOrderID);
				//var sOrderID = currentURL.match(/\/ModuleSelect\/([^/]+)/);

				// Assuming you want to redirect to a new URL with the sOrderID parameter
				// Modify the URL to include the parameter
				//var newURL = currentURL + '?sOrderID=' + encodeURIComponent(sOrderID);
				//sap.ui.getCore().urlparams = sOrderID;

				// Redirect to the new URL
				//window.location.href = newURL;

				//console.log(value1);

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

				var filters = [{
						path: "ProductType",
						value: this.byId("idService").getSelectedKey(),
						group: "ServiceTypeFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/ZCDSV_PRODUCTTYPEVH/', null,
						dynamicFilters.ServiceTypeFilter)
					.then(function (oResponse) {
						this.getModel().setProperty("/ModuleSearch/SelectServiceType/", oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			onSelectServiceTypeDD: function () {

				var filters = [{
						path: "ProductGroup",
						value: this.getModel().getProperty("/ModuleSearch/Header/ServiceTypeKey/"),
						group: "ServiceTypeFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/ZCDSV_SUBSERVICEVH/', null,
						dynamicFilters.ServiceTypeFilter)
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
					this.getRouter().navTo("AppHomePage", {}, true);
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
				var sTargetRoute = sModuleType === "ZSSH" ? "HRCreateRequest" : sModuleType === "ZSSI" ? "ITCreateRequest" : sModuleType === "ZSSF" ?
					"FinanceCreateRequest" : sModuleType === "ZSSS" ?
					"SCMCreateRequest" : "";

				var oParameters = {
					param1: "0"
				};
				var sTargetRoutePM = sModuleType === "ZSSM" ? this.oRouter.navTo("PMCreateServiceRequest", oParameters) : "";

				this.oRouter.navTo(sTargetRoute, oParameters);
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
			onSelectSubServiceTypeDD: function (oEve) {
				debugger;

				var sKey = oEve.getSource().getSelectedKey();
				var sDesc = sKey.split("_")[2],
					sDesc = sDesc === "" ? "" : sDesc;

				this.getModel().setProperty("/ModuleSearch/Header/Desc/", sDesc);
				this.getModel().setProperty("/ModuleSearch/Header/SLA/", sKey.split("_")[4]);
				this.getModel().setProperty("/ModuleSearch/Header/Price/", sKey.split("_")[5]);

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