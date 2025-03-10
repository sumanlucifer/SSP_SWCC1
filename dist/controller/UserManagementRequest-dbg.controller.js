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

			onFilterBarSearch: function (oEvent) {
				debugger;

				var oAvailableUsersTable = this.getView().byId("idAvailableUsers");
				var oPendingUserTable = this.getView().byId("idPendingUserTable");
				var afilterBar = oEvent.getParameter("selectionSet");
				var filters = [{
						path: "RequestID",
						value: afilterBar[0].getValue(),
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: "FirstName",
						value: afilterBar[1].getValue(),
						operator: sap.ui.model.FilterOperator.Contains,
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: "LastName",
						value: afilterBar[2] && afilterBar[2].getValue() ? afilterBar[2].getValue().split("-")[0] : "",
						operator: sap.ui.model.FilterOperator.Contains,
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: "Email",
						value: afilterBar[3] && afilterBar[3].getValue() ? afilterBar[3].getValue() : "",
						group: "DynamicF4SearchFilter"
					}

				];
				var dynamicFilters = this.getFilters(filters);

				this._filterTable(dynamicFilters.DynamicF4SearchFilter, "Application", [oAvailableUsersTable, oPendingUserTable]);
			},

			_filterTable: function (oFilter, sType, oTable) {

				this.handleVHFilterTable(oFilter, sType, oTable);
			},

			getPendingUserDetails: function () {
				var filters = [{
						path: "ID",
						value: this.getCurrentUserLoggedIn(),
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
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},

			getApprovedUserDetails: function () {
				var filters = [{
						path: "SapID",
						value: this.getCurrentUserLoggedIn(),
						group: "UserFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', '/UserSet',
						null, dynamicFilters.UserFilter, null)
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						var aCustomItemData = this.insertcustomProperties(oResponse);
						this.getModel().setProperty("/ClosedItemRequestData/itemData", aCustomItemData);

					}.bind(this)).catch(function (error) {
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},

			insertcustomProperties: function (oResponse) {

				const aItemData = oResponse.results.map(obj => ({
					...obj,
					editFlag: false
				}));

				return aItemData;
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
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},

			_handleMessageBoxProceed: function (sMessage) {
				var params = {
					sMessage: sMessage
				};

				this.createMessageBoxHandler(this._onObjectMatched.bind(this))(params);

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
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
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
			// 			onSelectRoleHR: function (oEve) {
			// 				debugger;
			// 				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);

			// 				if (oEve.getSource().getSelected()) {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessHR/`, "X");
			// 				} else {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessHR/`, "");
			// 				}

			// 			},
			onSelectRole: function (oEve) {
				debugger;
				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);

				var sRoleTxt = oEve.getSource().getText();
				sRoleTxt = sRoleTxt === "HR" ? "AccessHR" : sRoleTxt;
				sRoleTxt = sRoleTxt === "FI" ? "AccessFI" : sRoleTxt;
				sRoleTxt = sRoleTxt === "IT" ? "AccessIT" : sRoleTxt;
				sRoleTxt = sRoleTxt === "TECH" ? "AccessPM" : sRoleTxt;
				sRoleTxt = sRoleTxt === "SCM" ? "AccessSC" : sRoleTxt;
				var s = sRoleTxt;

				if (oEve.getSource().getSelected()) {
					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/${sRoleTxt}/`, "X");
				} else {
					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/${sRoleTxt}/`, "");
				}

			},
			// 			onSelectRoleIT: function (oEve) {
			// 				debugger;
			// 				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);
			// 				if (oEve.getSource().getSelected()) {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessIT/`, "X");
			// 				} else {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessIT/`, "");
			// 				}

			// 			},
			// 			onSelectRolePM: function (oEve) {
			// 				debugger;
			// 				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);
			// 				if (oEve.getSource().getSelected()) {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessPM/`, "X");
			// 				} else {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessPM/`, "");
			// 				}

			// 			},
			// 			onSelectRoleSCM: function (oEve) {
			// 				debugger;
			// 				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);
			// 				if (oEve.getSource().getSelected()) {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessSC/`, "X");
			// 				} else {
			// 					this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/AccessSC/`, "");
			// 				}

			// 			},
			onEditUSer: function (oEve) {
				var iRowNumber = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);
				this.getModel().setProperty(`/ClosedItemRequestData/itemData/${iRowNumber}/editFlag/`, true);

			},
			onSaveUser: function (oEve) {

				var aData = oEve.getSource().getBindingContext().getObject();
				// Create a new object without the editflag property
				const {
					editFlag,
					...oPayload
				} = aData;

				this.callSaveUSerAPI(oPayload);

			},

			callSaveUSerAPI: function (oPayload) {
				var sAPI = `/UserSet(RequestID='',SapID='${oPayload.SapID}')`;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'PUT', sAPI,
						oPayload, null, null)
					.then(function (oResponse) {

						if (oResponse === undefined) {
							conole.log("dswdwsd");
						}
						debugger;
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.ReqID} `);
						this._onObjectMatched();
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						this._onObjectMatched();
						//	MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));
			},
			onCancelUser: function () {
				this._onObjectMatched();
			},
			onPressTile: function (oEvent) {
				this.getOwnerComponent().getRouter().navTo("ModuleSelect");
			}
		})
	})