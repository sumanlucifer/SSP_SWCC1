sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageBox"
	],

	function (BaseController, JSONModel, MessageBox) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.HomePage", {
			onInit: function () {
				this.oRouter = this.getRouter();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.attachRouteMatched(function (oEvent) {
					var sRouteName = oEvent.getParameter("name");

					if (sRouteName === "RouteApp" || sRouteName === "HomePage") {
						this._createTileDataModel();
						this.BPFlagCheckAPI();

					}
				}, this);

			},

			_onObjectMatched: function () {
				debugger;
				this._createTileDataModel();
				this.BPFlagCheckAPI();
			},
			_createTileDataModel: function () {
				this.getModel().setData({
					busy: false,
					TileData: {
						Header: {}
					}
				});
			},
			BPFlagCheckAPI: function () {
				/*	debugger;
					var sLoginUser = this.getCurrentUserLoggedIn();
					var sLoginUserName = this.getCurrentLogInUserName();
					this.getModel().setProperty("/LoginUser", sLoginUserName);
					this.getModel().setProperty("/busy", true);
					var sAPI = `/CheckUserSet(UserName='${sLoginUser}')`;
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
						.then(function (oResponse) {
							this.getModel().setProperty("/TileData/Header/", oResponse);
							this.getModel().setProperty("/busy", false);
						}.bind(this)).catch(function (error) {
							MessageBox.error(error.responseText);
							this.getModel().setProperty("/busy", false);
						}.bind(this));*/

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