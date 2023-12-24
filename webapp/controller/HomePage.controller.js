sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.HomePage", {
			onInit: function () {
				this.oRouter = this.getRouter();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.attachRouteMatched(function (oEvent) {
					var sRouteName = oEvent.getParameter("name");

					if (sRouteName === "Routeapp" || sRouteName === "HomePage") {
						this._createTileDataModel();
						this.BPFlagCheckAPI();

					}
				}, this);

			},

			_onObjectMatched: function () {
				this._createTileDataModel();
				this.BPFlagCheckAPI();
			},
			BPFlagCheckAPI: function () {
				var sAPI = `/CheckUserSet(UserName='WT_POWER')`;

				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
					.then(function (oResponse) {
						this.getModel().setProperty("/TileData/Header/", oResponse);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			_createTileDataModel: function () {
				this.getModel().setData({
					busy: false,
					TileData: {
						Header: {}
					}
				});
			},
			onPressCreateRequest: function () {
				this.oRouter.navTo("AppHomePage");
			},
			onPressUserRequest: function () {
				this.oRouter.navTo("UserProfile");
			},
			onPressBpRequest: function () {
				this.oRouter.navTo("CustomerRegistration");
			},
			onPressSlaRequest: function () {
				this.oRouter.navTo("SlaCreation");
			},
			onPressUserManagement: function () {
				this.oRouter.navTo("UserManagementRequest");
			},
			onPressUserViewRequest: function () {
				this.oRouter.navTo("ViewRequest");

			},

			onOpen: function () {

				this.oRouter.navTo("ViewRequest");

			}
		})
	})