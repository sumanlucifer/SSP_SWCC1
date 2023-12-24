sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	],

	function (BaseController, JSONModel, History) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.SCMCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("SCMCreateRequest").attachPatternMatched(this._onObjectMatched, this);
				this._createItemDataModel();

			},
			_onObjectMatched: function () {
				debugger;
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				this.getModel().setProperty("/SCMAppVisible/", sServiceProduct);
				//this.callDropDownService();

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					recognitionAlreadyStarted: false,
					SCMAppVisible: null,
					MarineTransportation: {
						itemData: []
					}
				});
			},
			handleBackPress: function () {
				this.navigationBack();

			},
			/*onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},*/
			onAddItemsPress: function (oEvent) {
				var oModel = this.getModel().getProperty("/MarineTransportation/itemData");
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					Material: "",
					Description: "",
					StorageLocation: "",
					Quantity: "",
					BaseUnit: "",
					Batch: "",
					M: true,
					// UnloadPoint: "",
					AvailableQty: null,
					PopupItems: null,
					IsBOQApplicable: ""
				});
				this.getModel().setProperty("/MarineTransportation/itemData", oItems);

			},
			onDeleteItemPress: function (oEvent) {
					var iRowNumberToDelete = parseInt(oEvent.getSource().getBindingContext().getPath().split("/")[3]);
					var aTableData = this.getModel().getProperty("/MarineTransportation/itemData");
					aTableData.splice(iRowNumberToDelete, 1);
					this.getModel().refresh();
				}
				/*,

							onSearch: function () {

								this.oRouter.navTo("LandingView");

							}*/
		})
	})