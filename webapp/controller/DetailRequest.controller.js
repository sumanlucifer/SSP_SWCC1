sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/library",
	"sap/m/MessageBox"
], function (BaseController, History, JSONModel, coreLibrary, MessageBox) {
	"use strict";
	return BaseController.extend("com.swcc.Template.controller.DetailRequest", {
		onInit: function () {

			this.oRouter = this.getRouter();
			this.getRouter().getRoute("DetailRequest").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function (oEvent) {
			this._createDataModel();
			var sReqId = oEvent.getParameter("arguments").RequestID;
			this.RequestDetailsAPI(sReqId);
		},
		_createDataModel: function () {
			this.getModel().setData({
				busy: false,
				ProcessFlowData: [],
				RequestDetails: {
					Header: {}

				}
			});
		},
		RequestDetailsAPI: function (sReqId) {

			// 			test
			this.getModel().setProperty("/busy", true);
			var sAPI = `/ViewRequestSet('${sReqId}')`;
			debugger;
			var urlParameters = {
				"$expand": "Statuses"
			}
			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', sAPI, null, null,
					urlParameters)
				.then(function (oResponse) {

					this.getModel().setProperty("/busy", false);
					this.getModel().setProperty("/RequestDetails/Header/", oResponse);
					var aProcessFlowData = this.customResponseData(oResponse.Statuses.results);
					this.getModel().setProperty("/ProcessFlowData/", aProcessFlowData);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));

		},
		onLanePress: function (oEvent) {
			debugger;
			const oPressedLane = oEvent.getSource(); // Get the pressed lane header
			var oDate = oPressedLane.getBindingContext().getObject().Date;
			var sParsedDate = this.handleDateFormat(oDate);
			var sTime = this.handleTimeFormat(oDate);

			// Create or retrieve popover
			if (!this._popover) {
				this._popover = new sap.m.Popover({
					title: oPressedLane.getProperty("text"),
					contentWidth: "200px", // Set the content width
					contentHeight: "140px",
					content: [
						new sap.ui.layout.form.SimpleForm({
							layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
							content: [

								new sap.m.Label({
									text: "Date:"
								}),
								new sap.m.Text({
									text: sParsedDate
								}),

								new sap.m.Label({
									text: "Time:"
								}),
								new sap.m.Text({
									text: sTime
								}),

								// Add more fields as needed
							]
						})
					]
				});
			}

			// Open popover
			this._popover.openBy(oPressedLane);
		},

		customResponseData: function (aData) {
			debugger;
			let counter = 0;
			let cnt = 0;
			const filteredData = aData
				.filter(item => item.Visible === true) // Filtering based on label condition
				.map(item => ({
					id: (counter++).toString(),
					icon: item.Icon,
					label: item.Description,
					position: cnt++,
					Date: item.Date,
					state: [{
						state: item.State,
						value: 10
					}]
				}));

			return filteredData;
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
		handleBackPress: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("ViewRequest", {}, true);
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
	})
})