sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.MouleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
				// this.testCPI_API();
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
				// const oModel = this.getOwnerComponent().getModel("ModuleInput");

				// this.getAPI.crudOperations_ODATA(oModel, 'read', '/ZCDSV_SS_SERVICES_F4')
				// 	.then(function (oResponse) {
				// 		var aData = oResponse.data;

				// 	}.bind(this));

				var oPayload = {
					"BusinessPartnerCategory": "2",
					"BusinessPartnerFullName": "Test Test",
					"BusinessPartnerName": "Test Test",
					"FirstName": "",
					"IsFemale": false,
					"IsMale": false,
					"IsNaturalPerson": "",
					"IsSexUnknown": false,
					"Language": "",
					"LastName": "",
					"LegalForm": "",
					"OrganizationBPName1": "Test Test",
					"OrganizationBPName2": "Test Test",
					"OrganizationBPName3": "",
					"OrganizationBPName4": "",
					"OrganizationFoundationDate": null,
					"OrganizationLiquidationDate": null,
					"SearchTerm1": "TEST",
					"CreatedByUser": "DV_MKUMAR",
					"AdditionalLastName": "",
					"BirthDate": null,
					"BusinessPartnerIsBlocked": false,
					"BusinessPartnerType": "",
					"GroupBusinessPartnerName1": "",
					"GroupBusinessPartnerName2": "",
					"IndependentAddressID": "",
					"InternationalLocationNumber3": "0",
					"MiddleName": "",
					"NameCountry": "",
					"NameFormat": "",
					"PersonFullName": "",
					"PersonNumber": "",
					"IsMarkedForArchiving": false,
					"BusinessPartnerIDByExtSystem": ""
				};

				this.getAPI.oDataAPICall(this.getOwnerComponent().getModel("ZAPI_BUSINESS_PARTNER"), 'create', '/A_BusinessPartner',
						oPayload)
					.then(function (oResponse) {
						// 		var aData = oResponse.data;

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