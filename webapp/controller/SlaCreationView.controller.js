sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/m/PDFViewer",
		"sap/ui/Device",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/core/routing/History"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, Fragment, PDFViewer, Device, MessageBox, MessageToast, History) {
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
					SLACheckFlag: false,
					SLARegistrationData: {
						Header: {},
						CustomData: {}
					}

				});
			},

			getSLADetails: function () {
				var sLoggedInUserName = this.getCurrentUserLoggedIn();
				var sAPI = `/BPRequestSet(UserName='${sLoggedInUserName}')`;

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

			SubmitSLARegistration: function (oPayload) {
				var aSLAResponseData = this.getModel().getProperty("/SLARegistrationData/Header/");
				oPayload.P2_Customer = aSLAResponseData ? aSLAResponseData.P2_Customer : "";
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
				if (!this.getView().byId("accept_checkbox").getSelected()) {
					MessageToast.show("Please Accept SLA Version");
					bValid = false;
				}

				return bValid;
			},

			onSelectCheckagreement: function (oEve) {

				if (this.getModel().getProperty("/SLACheckFlag/")) {
					this.getView().byId("accept_checkbox").setSelected(false);
					MessageToast.show("Please Read SLA Version and Accept");

				}

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

			onPressAgreement: function () {
				this.getModel().setProperty("/busy", true);
				var sServiceURL = this.getOwnerComponent().getModel("ZSSP_USER_SRV").sServiceUrl;

				fetch(sServiceURL + "/SLAPreviewSet(Username='WT_POWER')/$value")
					.then(response => response.blob())
					.then(blob => {
						const url = URL.createObjectURL(blob);
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/pdf", url);
						this.oopenSLAAgreementDialog();

					})
					.catch(error => {
						this.getModel().setProperty("/busy", false);
						console.error('Error fetching the PDF:', error);
					});

			},

			/***** Agreement Popup ************/
			oopenSLAAgreementDialog: function (oEvent) {

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

						// Click handler

						oDialog.attachAfterOpen(function () {
							var oScrollContainer = oView.byId("myScrollContainer");
							var oScrollDomRef = oScrollContainer.getDomRef();
							oScrollDomRef.addEventListener("click", this.onScroll.bind(this));
							//
						}.bind(this));

						oDialog.open();
						// 		this.loadPDFView();

					}.bind(this));
				} else {
					this.oSearchResultDialog.open();
					// 	this.loadPDFView();

				}

			},

			loadPDFView: function () {
				// var oView = this.getView();
				// var oScrollContainer = oView.byId("myHTMLControl");
				// oScrollContainer.addEventDelegate({
				// 	onAfterRendering: function () {
				// 		var oScrollDomRef = oScrollContainer.getDomRef();
				// 		oScrollDomRef.addEventListener("scroll", this.onScroll.bind(this));
				// 	}.bind(this)
				// });

				var oScrollContainer = this.getView().byId("myHTMLControl");
				oScrollContainer.$().off("scroll"); // Unbind any existing scroll event handlers
				oScrollContainer.$().on("scroll", this.onScroll.bind(this)); // Bind the scroll event
			},

			// 			onScroll: function (event) {

			// 				var oScrollContainer = this.getView().byId("myScrollContainer");
			// 				var scrollTop = oScrollContainer.$().scrollTop();

			// 				if (scrollTop > 400) {
			// 					this.getView().byId("idacceptpdf").setEnabled(true);
			// 					this.getView().byId("ideclinepdf").setEnabled(true);
			// 					// Implement your scroll-down functionality
			// 					console.log("Scrolled down!");
			// 				}
			// 			},

			onScroll: function (oEvent) {
				// Handle scroll event logic here
				console.log("Scrolled");
			},

			onCloseSlaAgreementDialog: function () {
				this.oSearchResultDialog.close();

			},
			onacceptpdf: function (event) {
				this.getModel().setProperty("/SLACheckFlag/", true);
				this.getView().byId("accept_checkbox").setSelected(true);
				this.onCloseSlaAgreementDialog();

			},
			onrejectpdf: function (event) {
					this.getModel().setProperty("/SLACheckFlag/", false);
					this.getView().byId("accept_checkbox").setSelected(false);
					this.oSearchResultDialog.close();

				}
				/****** Agreeement popup code ends here ******************/

		});
	});