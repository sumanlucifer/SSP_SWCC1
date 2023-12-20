sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/Device",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/core/routing/History"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, Fragment, Device, MessageBox, MessageToast, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.SlaCreationView", {

			onInit: function () {
				this.oRouter = this.getRouter();
				this.getRouter().getRoute("SlaCreation").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				this._SLARegistrationModel();
				this.getSLADetails();
			},
			_SLARegistrationModel: function () {
				this.getModel().setData({
					busy: false,
					SLARegistrationData: {
						Header: {},
						CustomData: {}
					}

				});
			},
			getSLADetails: function () {

				var sAPI = `/BPRequestSet(UserName='WT_POWER')`;

				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', sAPI)
					.then(function (oResponse) {
						this.getModel().setProperty("/SLARegistrationData/Header/", oResponse);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			onCancel: function () {

				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("HomePage", {}, true);
				}

			},

			onSubmitBP: function () {
				var oPayload = this.getModel().getProperty("/CustomerRegistrationData/Header/");
				this.SubmitBPRegistration(oPayload);
			},
			SubmitSLARegistration: function (oPayload) {
				debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'POST', '/SLARequestSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`SLA Request has been Created : ${oResponse.ReqID} `);
						this.getModel().setProperty("/CustomerRegistrationData/Header/", null);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));
			},

			onProceed: function () {

				var oPayload = this.getModel().getProperty("/SLARegistrationData/CustomData/");
				this.InputValidation() !== true ?
					"" : this.SubmitSLARegistration(oPayload);
				//	this.SubmitSLARegistration(oPayload);

			},
			InputValidation: function () {
				var bValid = true;
				if (!this.getModel().getProperty("/SLARegistrationData/CustomData/P2_Represen/")) {
					this.getModel().setProperty("/SLARegistrationData/CustomData/P2_Represen/", "")

					bValid = false;
				}
				if (!this.getModel().getProperty("/SLARegistrationData/CustomData/P2_Rep_Pos/")) {
					this.getModel().setProperty("/SLARegistrationData/CustomData/P2_Rep_Pos/", "")

					bValid = false;
				}
				if (!this.getModel().getProperty("/SLARegistrationData/CustomData/P2_CorName/")) {
					this.getModel().setProperty("/SLARegistrationData/CustomData/P2_CorName/", "")

					bValid = false;
				}
				if (!this.getModel().getProperty("/SLARegistrationData/CustomData/P2_CorPos/")) {
					this.getModel().setProperty("/SLARegistrationData/CustomData/P2_CorPos/", "")

					bValid = false;
				}
				if (!this.getModel().getProperty("/SLARegistrationData/CustomData/P2_CorEmail/")) {
					this.getModel().setProperty("/SLARegistrationData/CustomData/P2_CorEmail/", "")

					bValid = false;
				}

				return bValid;
			},

			onPresshomepage: function () {
				this.getOwnerComponent().getRouter().navTo("HomePage");
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

			/***** Agreement Popup ************/
			onPressAgreement: function (oEvent) {

				var oView = this.getView();

				if (!this.oSearchResultDialog) {
					Fragment.load({
						id: oView.getId(),
						name: "com.swcc.Template.fragments.PDFViewer",
						controller: this
					}).then(function (oDialog) {
						oDialog.setTitle("SLA Agreement Version");
						this.oSearchResultDialog = oDialog;
						this.getView().addDependent(oDialog);
						oDialog.open();
						this.loadPDFView();

					}.bind(this));
				} else {
					this.oSearchResultDialog.open();
					this.loadPDFView();

				}

			},

			loadPDFView: function () {
				var oScrollContainer = this.getView().byId("myScrollContainer");
				oScrollContainer.$().off("scroll"); // Unbind any existing scroll event handlers
				oScrollContainer.$().on("scroll", this.onScroll.bind(this)); // Bind the scroll event
			},

			onScroll: function (event) {

				var oScrollContainer = this.getView().byId("myScrollContainer");
				var scrollTop = oScrollContainer.$().scrollTop();

				if (scrollTop > 400) {
					this.getView().byId("idacceptpdf").setEnabled(true);
					this.getView().byId("ideclinepdf").setEnabled(true);
					// Implement your scroll-down functionality
					console.log("Scrolled down!");
				}
			},

			onCloseSlaAgreementDialog: function () {
				this.oSearchResultDialog.close();

			},
			onacceptpdf: function (event) {
				var demoToast = this.getView().byId("accept_checkbox");
				this.onCloseSlaAgreementDialog();
				demoToast.setSelected(true);
				//event.getSource().getParent().close();
			},
			onrejectpdf: function (event) {
					var demoToast = this.getView().byId("accept_checkbox");
					this.oSearchResultDialog.close();
					demoToast.setSelected(false);
					//event.getSource().getParent().close();
				}
				/****** Agreeement popup code ends here ******************/

		});
	});