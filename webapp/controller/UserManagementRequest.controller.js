sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox"
	],

	function (BaseController, JSONModel, Filter, FilterOperator, History, MessageBox) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.UserManagementRequest", {

			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("UserManagementRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				this._createItemDataModel();
				this.getPendingUserDetails();
				this.getApprovedUserDetails();
			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					OpenItemRequestData: {
						itemData: []
					},
					ClosedItemRequestData: {
						itemData: []
					}
				});
			},

			getPendingUserDetails: function () {
				var filters = [{
						path: "ID",
						value: "WT_POWER",
						group: "UserFilter"
					}

				];
				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', '/UserRequestSet',
						null, dynamicFilters.UserFilter, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/OpenItemRequestData/itemData", oResponse.results);

					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},

			getApprovedUserDetails: function () {
				var filters = [{
						path: "SapID",
						value: "WT_POWER",
						group: "UserFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', '/UserSet',
						null, dynamicFilters.UserFilter, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/ClosedItemRequestData/itemData", oResponse.results);

					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},

			onApprove: function (oEve) {
				var sID = oEve.getSource().getBindingContext().getObject().ID;

				var params = {
					sRequestID: sID,
					sBtnTxt: "Approve",
					sMsgTxt: `Are you sure you want to Approve the Request: ${sID} `
				};

				this.handleConfirmMessage(this.onApproveAPICall.bind(this))(params);

			},

			onApproveAPICall: function (sID) {
				var oPayload = {
					"RequestID": sID
				};

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'POST', '/UserSet',
						oPayload, null, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this._handleMessageBoxProceed(`Request has been Approved Successfully `);
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
							that.getPendingUserDetails();
							that.getApprovedUserDetails();
						}
					},
				});
			},

			onReject: function (oEve) {
				var sID = oEve.getSource().getBindingContext().getObject().ID;

				var params = {
					sRequestID: sID,
					sMsgTxt: `Are you sure you want to Reject the Request: ${sID} `,
					sBtnTxt: "Reject"
				};

				this.handleConfirmMessage(this.onRejectAPICall.bind(this))(params);

			},
			onRejectAPICall: function (sID) {
				var sAPI = `/UserRequestSet(ID='${sID}')`;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'DELETE', sAPI,
						null, null, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this._handleMessageBoxProceed(`Request has been Rejected Successfully `);
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
			onPressTile: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("ModuleSelect");
			}
		})
	})