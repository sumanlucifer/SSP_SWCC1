sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/Device",
		"sap/m/MessageBox",
		"sap/m/MessageToast"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, Fragment, Device, MessageBox, MessageToast) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.SlaCreationView", {

			onInit: function () {
				this.oRouter = this.getRouter();
			},
			onCancel: function () {

				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("LandingView", {}, true);
				}

			},

			onProceed: function () {
				this._handleMessageBoxProceed("SLA Agreement has been done successfully");
				//this.getOwnerComponent().getRouter().navTo("AppHomePage");

			},

			onPresshomepage: function () {
				this.getOwnerComponent().getRouter().navTo("AppHomePage");
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