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
		return BaseController.extend("com.swcc.Template.controller.LandingView", {

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
				//	this.getOwnerComponent().getTargets().display("DetailView");
				this._handleMessageBoxProceed("Your Service Request has been generated : 12111099");
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
			onPressViewRequest: function () {

				this.getOwnerComponent().getTargets().display("ViewRequest");
			},

			onPressCustRegistration: function () {
				this.getOwnerComponent().getTargets().display("CustRegistration");
			},
			onPresshomepage: function () {
				debugger;

				this.oRouter.navTo("HomePage");
				//this.getOwnerComponent().getTargets().display("HomePage");
			},
			onPressAgreement: function (oEvent) {

				var oView = this.getView();

				if (!this._pDialog) {
					this._pDialog = Fragment.load({
						id: oView.getId(),
						name: "com.swcc.Template.fragments.PDFViewer",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						if (Device.system.desktop) {
							oDialog.addStyleClass("sapUiSizeCompact");
						}
						return oDialog;
					});
				}

				this._pDialog.then(function (oDialog) {
					oDialog.setTitle("SLA Agreement");
					oDialog.open();

					this.loadPDFView();

				}.bind(this));

			},

			onStartUpload: function () {
				var oUploadCollection = this.byId("UploadCollection");
				var oTextArea = this.byId("TextArea");
				var cFiles = oUploadCollection.getItems().length;
				var uploadInfo = cFiles + " file(s)";

				if (cFiles > 0) {
					oUploadCollection.upload();
					MessageBox.information("Uploaded " + uploadInfo);
				}

			},

			loadPDFView: function () {
				var oScrollContainer = this.getView().byId("myScrollContainer");
				oScrollContainer.$().on("scroll", this.onScroll.bind(this));

			},

			onScroll: function (event) {

				var oScrollContainer = this.getView().byId("myScrollContainer");
				var scrollTop = oScrollContainer.$().scrollTop();

				if (scrollTop > 400) {
					this.getView().byId("idRequestButton").setEnabled(true);
					// Implement your scroll-down functionality
					console.log("Scrolled down!");
				}
			}

		});
	});