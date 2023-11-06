sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/Device"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, Fragment, Device) {
		"use strict";

		return Controller.extend("com.swcc.Template.controller.LandingView", {
			onInit: function () {

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
				this.getOwnerComponent().getTargets().display("DetailView");
			},
			onPressViewRequest: function () {

				this.getOwnerComponent().getTargets().display("ViewRequest");
			},

			onPressCustRegistration: function () {
				this.getOwnerComponent().getTargets().display("CustRegistration");
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
					this.getView().byId("idRequestButton").setEnabled(true);
					// Implement your scroll-down functionality
					console.log("Scrolled down!");
				}
			}

		});
	});