sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/library",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/Text",
	"sap/ui/core/Fragment",
], function (BaseController, History, JSONModel, coreLibrary, Dialog, Button, mobileLibrary, Text, Fragment) {
	"use strict";
	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;
	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;
	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;
	return BaseController.extend("com.swcc.Template.controller.DetailView", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();

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
		onApprovePress: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					state: ValueState.Warning,
					title: "Confirm",
					content: new Text({
						text: "Do you want to Approve this Request?"
					}),
					beginButton: new Button({
						type: ButtonType.Accept,
						text: "Approve",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					}).addStyleClass("btn-proceed"),
					endButton: new Button({
						type: ButtonType.Reject,
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					}).addStyleClass("btn-cancel")
				});
			}

			this.oApproveDialog.open();
		},

		onAssignPress: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: oView.getId(),
					name: "com.swcc.Template.fragments.PDFViewer",
					controller: this
				}).then(function (oDialog) {
					oDialog.setModel(oView.getModel());
					return oDialog;
				});
			}

			this._pDialog.then(function (oDialog) {
				oDialog.open();
			}.bind(this));

		},

		_configDialog: function (oButton, oDialog) {
			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			oDialog.setMultiSelect(bMultiSelect);

			var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			oDialog.setConfirmButtonText(sCustomConfirmButtonText);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			oDialog.setRememberSelections(bRemember);

			//add Clear button if needed
			var bShowClearButton = !!oButton.data("showClearButton");
			oDialog.setShowClearButton(bShowClearButton);

			// Set growing property
			var bGrowing = oButton.data("growing");
			oDialog.setGrowing(bGrowing == "true");

			// Set growing threshold
			var sGrowingThreshold = oButton.data("threshold");
			if (sGrowingThreshold) {
				oDialog.setGrowingThreshold(parseInt(sGrowingThreshold));
			}

			// Set draggable property
			var bDraggable = !!oButton.data("draggable");
			oDialog.setDraggable(bDraggable);

			// Set draggable property
			var bResizable = !!oButton.data("resizable");
			oDialog.setResizable(bResizable);

			// Set style classes
			var sResponsiveStyleClasses =
				"sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";
			var bResponsivePadding = !!oButton.data("responsivePadding");
			oDialog.toggleStyleClass(sResponsiveStyleClasses, bResponsivePadding);

			// clear the old search filter
			oDialog.getBinding("items").filter([]);

			// toggle compact style
			syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
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
				title: "Request status",
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

	})
})