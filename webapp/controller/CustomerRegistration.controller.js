sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"

], function (BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.swcc.Template.controller.CustomerRegistration", {
		onInit: function () {

			this.oRouter = this.getRouter();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(function (oEvent) {
				var sRouteName = oEvent.getParameter("name");

				if (sRouteName === "CustomerRegistration") {
					this.callDropDownAndModel();
				}
			}, this);
			//	this.callDropDownAndModel();
		},

		callDropDownAndModel: function () {
			this._customeRegistrationModel();
			this.getModel().setSizeLimit(1000);
			this.CountryF4();

		},
		_customeRegistrationModel: function () {
			this.getModel().setData({
				busy: false,
				CustomerRegistrationData: {
					Header: {},
					CountryF4: [],
					RegionF4: []
				}

			});
		},
		CountryF4: function () {

			var filters = [{
					path: "Language",
					value: "en",
					group: "CountryFilter"
				}

			];

			var dynamicFilters = this.getFilters(filters);
			this.getModel().setProperty("/busy", true);
			this.getAPI.oDataReadAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'read', '/A_CountryText/', null, dynamicFilters.CountryFilter)
				.then(function (oResponse) {

					this.getModel().setProperty("/CustomerRegistrationData/CountryF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));

		},
		onCountryChange: function (oEve) {
			var sKey = oEve.getSource().getSelectedKey();
			var filters = [{
					path: "Country",
					value: oEve.getSource().getSelectedKey(),
					group: "CountryChangeFilter"
				}, {
					path: "Language",
					value: "EN",
					group: "CountryChangeFilter"
				}

			];

			var dynamicFilters = this.getFilters(filters);
			this.getModel().setProperty("/busy", true);

			this.getAPI.oDataReadAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'read', '/C_RegionTextVHTemp', null,
					dynamicFilters.CountryChangeFilter)
				.then(function (oResponse) {
					oResponse.results.length === 0 ? this.getModel().setProperty("/CustomerRegistrationData/Header/Regio/", null) : this.getModel().setProperty(
						"/CustomerRegistrationData/RegionF4/", oResponse.results);
					debugger;
					this.getModel().setProperty("/CustomerRegistrationData/RegionF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
		},

		onSubmitBP: function () {
			var oPayload = this.getModel().getProperty("/CustomerRegistrationData/Header/");
			this.SubmitBPRegistration(oPayload);
		},
		onCancel: function () {
			this.getOwnerComponent().getRouter().navTo("SlaCreation");
		},
		SubmitBPRegistration: function (oPayload) {
			this.getModel().setProperty("/busy", true);
			this.getAPI.oDataAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'create', '/BPRequestSet',
					oPayload)
				.then(function (oResponse) {
					this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.ReqID} `);
					this.getModel().setProperty("/CustomerRegistrationData/Header/", null);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
		},
		_handleMessageBoxProceed: function (sMessage) {
			var that = this;
			sap.m.MessageBox.success(sMessage, {
				icon: MessageBox.Icon.SUCCESS,
				title: "Success",
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction == "OK") {
						that.onPresshomepage();
					}
				},
			});
		},
		onPresshomepage: function () {
			this.getOwnerComponent().getRouter().navTo("SlaCreation");
		},
		onback: function () {

			//this.getOwnerComponent().getTargets().display("LandingView");

		},
		onSubmit: function () {

			this.getOwnerComponent().getRouter().navTo("SlaCreation");

		}
	})
})