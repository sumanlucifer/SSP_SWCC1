sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox"
	],

	function (BaseController, JSONModel, History, MessageBox) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.AppHomePage", {
			onInit: function () {
				this.oRouter = this.getRouter();
				this.getRouter().getRoute("AppHomePage").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {

				this._createDataModel();
				this.getTileDisplayData();

			},
			_createDataModel: function () {
				this.getModel().setData({
					busy: false,
					AppHomeTileDisplay: {
						Header: {}
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

			getTileDisplayData: function () {

				this.getModel().setProperty("/busy", true);
				var sLoggedInUserName = this.getCurrentUserLoggedIn();
				var sAPI = `/UserSet(RequestID='',SapID='${sLoggedInUserName}')`;

				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
					.then(function (oResponse) {
						this.handleAcessissueError(oResponse);
						this.getModel().setProperty("/AppHomeTileDisplay/Header/", oResponse);
						this.handleSetLocalStaorage("userType", oResponse.UserType);
						this.handleSetLocalStaorage("userPlant", oResponse.Plant);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			handleAcessissueError: function (response) {
				debugger;
				const allEmpty = response.AccessHR === "" && response.AccessFI === "" && response.AccessIT === "" && response.AccessSC ===
					"" && response.AccessPM === "";

				// Throw an error if all access fields are empty
				if (allEmpty) {
					MessageBox.error("You do not have permission to access, Please Contact System Administrator ");
					return;
				}

			},
			onPressTile: function (oEvent) {
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				var sVal = oEvent.getSource().getId().split("--")[1];
				oStorage.put("sMouleType", sVal);
				this.oRouter.navTo("ModuleSelect");
			}
		})
	})