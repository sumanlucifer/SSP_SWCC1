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
						this.getViewRequestDetails();

					}
				}, this);

				// this.oRouter = this.getRouter();
				// this._onObjectMatched();

			},

			_onObjectMatched: function () {
				this._createTileDataModel();
				this.BPFlagCheckAPI();
				this.getViewRequestDetails();
			},
			_createTileDataModel: function () {
				this.getModel().setData({
					busy: false,
					TileData: {
						Header: {},
						subTile: {}
					}
				});
			},
			BPFlagCheckAPI: function () {
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
					}.bind(this));

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
				this.oRouter.navTo("ViewRequest", {
					StatusId: "NA"
				});

			},
			getViewRequestDetails: function () {
				this.getModel().setProperty("/busy", true);
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
						group: "ProcessFilter",
						useOR: true
					}, {
						path: "Status",
						value: "Request under Process",
						group: "ProcessFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				Promise.allSettled([this.readChecklistEntity("/ViewRequestSet/$count", dynamicFilters.SubmitStatusFilter),
					this.readChecklistEntity("/ViewRequestSet/$count", dynamicFilters.CompleteFilter),
					this.readChecklistEntity("/ViewRequestSet/$count", dynamicFilters.ProcessFilter)
				]).then(this.buildChecklist.bind(this)).catch(function (error) {}.bind(this));

			},

			readChecklistEntity: function (path, filter) {

				return new Promise(
					function (resolve, reject) {
						this.getOwnerComponent().getModel("ZSSP_COMMON_SRV").read(path, {
							filters: [filter],
							success: function (oData) {
								resolve(oData);
							},
							error: function (oResult) {
								reject(oResult);

							}
						});
					}.bind(this));
			},

			buildChecklist: function (values) {
				this.getModel().setProperty("/busy", false);
				this.getModel().setProperty("/TileData/subTile/openRequest/", parseInt(values[0].value));
				this.getModel().setProperty("/TileData/subTile/inProgressRqt/", parseInt(values[2].value));
				this.getModel().setProperty("/TileData/subTile/doneReqst/", parseInt(values[1].value));

			},

			onPressSubTile: function (oEve) {

				this.oRouter.navTo("ViewRequest", {
					StatusId: oEve.getSource().getHeader()
				});

				// this.oRouter.navTo("ViewRequest");

			}
		})
	})