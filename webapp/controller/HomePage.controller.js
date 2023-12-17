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
						// Restore the model to its initial state or any desired state
						// 		var oModel = this.getModel(); // Replace 'YourModelName' with your model name

						// 		// Restore your model here, for example:
						// 		oModel.setProperty("/YourProperty", initialValue); // Replace 'YourProperty' and initialValue with your actual property and value
					}
				}, this);
				this._createTileDataModel();
				this.BPFlagCheckAPI();
			},

			_onObjectMatched: function () {
				this._createTileDataModel();
				this.BPFlagCheckAPI();
			},
			BPFlagCheckAPI: function () {
				debugger;

				var sAPI = `/CheckUserSet(UserName='WT_POWER')`;

				this.getAPI.oDataReadAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'read', sAPI)
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

			onPressViewAllRequest: function () {
				this.oRouter.navTo("ViewRequest");
			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},
			onPressBpRequest: function () {
				this.oRouter.navTo("CustomerRegistration");
			},
			onPressSlaRequest: function () {
				this.oRouter.navTo("SlaCreation");
			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			}
		})
	})