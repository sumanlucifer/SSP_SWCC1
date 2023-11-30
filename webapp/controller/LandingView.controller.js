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
				var oLocalViewModel = new JSONModel({
					busy: false,
					uploadAttachment: true
				});
				const fileInput = document.getElementById('UploadSet');

				this.getView().setModel(oLocalViewModel, "LocalViewModel");
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

			loadPDFView: function () {
				var oScrollContainer = this.getView().byId("myScrollContainer");
				oScrollContainer.$().on("scroll", this.onScroll.bind(this));

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

			/*** Upload attach code **********/
			onFileAdded: function (oEvent) {

				debugger;
				var file = oEvent.getParameter("item");
				var Filename = file.getFileName(),
					Filetype = file.getMediaType(),
					Filesize = file.getFileObject().size,
					Filedata = oEvent.getParameter("item").getFileObject();

				//code for base64/binary array 
				this._getImageData((Filedata), function (Filecontent) {
					this._addData(Filecontent, Filename, Filetype, Filesize);
				}.bind(this));
				var oUploadSet = this.getView().byId("UploadSet");
				//oUploadSet.getDefaultFileUploader().setEnabled(false);

			},
			onFileSizeExceed: function () {
				MessageBox.error("File size exceeded, Please upload file upto 10MB.");
				this.isAttachment = false;
			},

			onFileNameLengthExceed: function () {
				MessageBox.error("File name length exceeded, Please upload file with name lenght upto 50 characters.");
			},
			_getImageData: function (url, callback, fileName) {
				var reader = new FileReader();

				reader.onloadend = function (evt) {
					if (evt.target.readyState === FileReader.DONE) {

						var binaryString = evt.target.result,
							base64file = btoa(binaryString);

						callback(base64file);
					}
				};
				reader.readAsBinaryString(url);
			},
			_addData: function (Filecontent, Filename, Filetype, Filesize) {
				this.getViewModel("LocalViewModel").setProperty(
					"/busy",
					true
				);
				this.fileContent = Filecontent;
				this.fileName = Filename;
				this.isAttachment = true;

			},
			onFileDeleted: function (oEvent) {
				var oUploadSet = this.getView().byId("UploadSet");
				oUploadSet.getDefaultFileUploader().setEnabled(true);
				this.isAttachment = false;

			},
			onFileRenamed: function (oEvent) {
					this.onFileAdded(oEvent);
				}
				/* upload attach code ends here ****/

		});
	});