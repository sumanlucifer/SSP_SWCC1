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

			},
			_onObjectMatched: function () {
				debugger;
				this._createItemDataModel();

				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				this.getModel().setProperty("/SCMAppVisible/", sServiceProduct);
				this.callDropDownService();

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PlantF4: [],
					recognitionAlreadyStarted: false,
					SCMAppVisible: null,
					MaterialProcurement: {
						itemData: []
					}
				});
			},
			handleBackPress: function () {
				this.navigationBack();

			},
			callDropDownService: function () {
				this.getModel().setProperty("/busy", true);
				var filters = [{
						path: "Country",
						value: "SA",
						group: "CompanyFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				Promise.allSettled([
					//   Company Code F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/C_CompanyCodeVHTemp/', null,
						dynamicFilters.CompanyFilter),
					//	Cash Journal F4 Data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDSV_CASHJOURNALVH/', null,
						null)

				]).then(this.buildResponselist.bind(this)).catch(function (error) {}.bind(this));

			},
			buildResponselist: function (values) {
				debugger;
				this.getModel().setProperty("/busy", false);
				// 			Company F4 type response
				var aCompanyF4Data = values[0].value.results;
				this.getModel().setProperty("/CompanyF4/", aCompanyF4Data);
				// 			Cash Journal F4 type response
				var aCashJournalF4Data = values[1].value.results;
				this.getModel().setProperty("/CashJournalF4/", aCashJournalF4Data);

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