sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.UserProfile", {

			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("UserProfile").attachPatternMatched(this._onObjectMatched, this);

			},

			_onObjectMatched: function () {
				//var sValue = jQuery.sap.getUriParameters().get("param");
				//debugger;
				this._createHeaderDataModel();
				this.getUserDetailsDetails();

			},
			_createHeaderDataModel: function () {
				this.getModel().setData({
					busy: false,
					UserDetails: {
						Header: {}
					}
				});
			},

			getUserDetailsDetails: function () {

				var sLoggedInUserName = this.getCurrentUserLoggedIn();
				var sAPI = `/UserSet(RequestID='',SapID='${sLoggedInUserName}')`;

				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
					.then(function (oResponse) {
						this.getModel().setProperty("/UserDetails/Header/", oResponse);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			handleBackPress: function () {
				this.navigationBack();

			}

		})
	})