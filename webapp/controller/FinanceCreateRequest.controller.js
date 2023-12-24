sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox"
	],

	function (BaseController, JSONModel, History, MessageBox) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.FinaceCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("FinanceCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				debugger;
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				this.getModel().setProperty("/FinanceAppVisible/", sServiceProduct);
				this.callDropDownService();

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					recognitionAlreadyStarted: false,
					FinanceAppVisible: null,
					CompanyF4: [],
					CashJournalF4: [],
					ManagePettyCashData: {
						itemData: []
					},
					RecordandProcessInvoice: {
						itemData: []
					},
					MarineTransportation: {
						itemData: []
					}
				});
			},

			callDropDownService: function () {
				this.getModel().setProperty("/busy", true);
				var filters = [{
						path: "Country",
						value: "SA",
						group: "CompanyFilter"
					},

					{
						path: "Language",
						value: "E",
						group: "CashJrnlFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				Promise.allSettled([
					//   Company Code F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/C_CompanyCodeVHTemp/', null,
						dynamicFilters.CompanyFilter),
					//	Cash Journal F4 Data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_CashJournal/', null, dynamicFilters.CashJrnlFilter)

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

			onSearchFinanceRequest: function () {

				this.callManagePettyCashAPI();
				this.callManageRecordInvoice();
			},

			callManagePettyCashAPI: function () {

				var filters = [{
						path: "CompanyCode",
						value: "1000",
						group: "ManagePettyCashFilter"
					}, {
						path: "FiscalYear",
						value: this.getModel().getProperty("/ManagePettyCashData/FiscalYear"),
						group: "ManagePettyCashFilter"
					}, {
						path: "PostingNo",
						value: this.getModel().getProperty("/ManagePettyCashData/CashJournalF4/CashJournalKey"),
						group: "ManagePettyCashFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/PettyCashSet/', null, dynamicFilters.ManagePettyCashFilter)
					.then(function (oResponse) {

						this.getModel().setProperty("/ManagePettyCashData/itemData/", oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			callManageRecordInvoice: function () {

				var filters = [{
						path: "CompanyCode",
						value: "1000",
						group: "ManageRecordInvoiceFilter"
					}, {
						path: "FiscalYear",
						value: this.getModel().getProperty("/RecordandProcessInvoice/FiscalYear"),
						group: "ManageRecordInvoiceFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.callCommonFinanceAPIRequest("/PettyInvoicesSet/", "GET", dynamicFilters.ManageRecordInvoiceFilter, null,
					"/RecordandProcessInvoice/itemData/");

			},

			callCommonFinanceAPIRequest: function (Entity, operation, Filters, oPayload, oModelSet) {

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), operation, Entity, null, Filters)
					.then(function (oResponse) {

						this.getModel().setProperty(`${oModelSet}`, oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));
			},
			handleBackPress: function () {
				this.navigationBavk();

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},
			onProceed1: function () {

				this._handleMessageBoxProceed("Your Service Request has been generated : 12111099");
			},

			_handleMessageBoxProceed: function (sMessage) {
				var params = {
					sMessage: sMessage
				};

				this.createMessageBoxHandler(this.onPresshomepage.bind(this))(params);

			},
			onPresshomepage: function () {
				this.getOwnerComponent().getRouter().navTo("HomePage");
			},
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
			},
			/*	onProceed: function () {
					this.getOwnerComponent().getTargets().display("FinanceCreateRequest");
				},*/

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			}
		})
	})