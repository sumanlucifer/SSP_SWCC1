sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/Device",
		"sap/ui/core/library"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, Fragment, Device, coreLibrary) {
		"use strict";

		return Controller.extend("com.swcc.Template.controller.LandingView", {
			onInit: function () {

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
			},
			itemPress: function (oEvent) {
				var oItem = oEvent.getSource(),
					aCustomData = oItem.getCustomData(),
					sTitle = aCustomData[0].getValue(),
					sIcon = aCustomData[1].getValue(),
					sSubTitle = aCustomData[2].getValue(),
					sDescription = aCustomData[3].getValue();

				var oPopover = new sap.m.Popover({
					contentWidth: "300px",
					title: "Order status",
					content: [
						new sap.m.HBox({
							items: [
								new sap.ui.core.Icon({
									src: sIcon,
									color: this._getColorByState(oItem)
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd"),
								new sap.m.FlexBox({
									width: "100%",
									renderType: "Bare",
									direction: "Column",
									items: [new sap.m.Title({
											level: sap.ui.core.TitleLevel.H1,
											text: sTitle
										}), new sap.m.Text({
											text: sSubTitle
										}).addStyleClass("sapUiSmallMarginBottom sapUiSmallMarginTop"),
										new sap.m.Text({
											text: sDescription
										})
									]
								})
							]
						}).addStyleClass("sapUiTinyMargin")
					],
					footer: [
						new sap.m.Toolbar({
							content: [
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({
									text: "Close",
									press: function () {
										oPopover.close();
									}
								})
							]
						})
					]
				});

				oPopover.openBy(oEvent.getParameter("item"));
			},
			_getColorByState: function (oItem) {
				switch (oItem.getState()) {
				case "Error":
					return coreLibrary.IconColor.Negative;
				case "Warning":
					return coreLibrary.IconColor.Critical;
				case "Success":
					return coreLibrary.IconColor.Positive;
				}
			}

		});
	});