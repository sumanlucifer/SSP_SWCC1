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
				var sValue = jQuery.sap.getUriParameters().get("param");
				// debugger;
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/FinanceAppVisible/", sServiceProduct);
				this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.callDropDownService();

				var fiModel = this.getOwnerComponent().getModel("fiModel");
				this.CallValueHelpFISRVAPI('/I_CompanyCodeStdVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/companyCode", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpAPI('/ZCDSV_WORKCENTERVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/workCenter", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpAPI('/A_Plant/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/plant", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpFISRVAPI('/F_Mmim_Customer_Vh/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/Customer", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/A_GLAccountText/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/GLAccount", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					FinanceAppVisible: null,
					CompanyF4: [],
					CashJournalF4: [],
					PMCreateRequest: {
						UploadedData: [],
						Header: {},
						CustomDisplayData: {},
						Attachment: [],
						PlantF4: [],
						WorkCenterF4: []
					},
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
			WorkCenterF4: function (sKey) {
				var filters = [{
						path: "Plant",
						value: sKey,
						group: "WorkCntrFilter"
					}, {
						path: "ServiceProduct",
						value: this.getModel().getProperty("/PMCreateRequest/Header/Material"),
						group: "WorkCntrFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/ZCDSV_WORKCENTERVH', null, dynamicFilters.WorkCntrFilter, null
				).then(function (oResponse) {

					this.getModel().setProperty("/PMCreateRequest/WorkCenterF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);

				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
			},
			onSelectPlant: function (oEve) {
				var sKey = oEve.getSource().getSelectedKey();
				this.WorkCenterF4(sKey);

			},
			onCheckPlantVal: function (oEve) {

				oEve.getSource().getSelectedKey() === "" ? oEve.getSource().setValue(null) : "";

			},

			callDropDownService: function () {
				this.getModel().setProperty("/busy", true);
				var filters = [{
						path: "Country",
						value: "SA",
						group: "CompanyFilter"
					}, {
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

			handleManagePettyCashDateChange: function (oEve) {
				// debugger;
				var sYear = oEve.getSource().getValue();
			},
			buildResponselist: function (values) {
				// debugger;
				this.getModel().setProperty("/busy", false);
				// 			Company F4 type response
				var aCompanyF4Data = values[0].value.results;
				this.getModel().setProperty("/CompanyF4/", aCompanyF4Data);
				// 			Cash Journal F4 type response
				var aCashJournalF4Data = values[1].value.results;
				this.getModel().setProperty("/CashJournalF4/", aCashJournalF4Data);

			},

			onSearchFinanceRequest: function () {
				// debugger;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.callManageRecordInvoice() : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.callManagePettyCashAPI() : null;

			},

			callManagePettyCashAPI: function () {
				// debugger;
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
						value: this.getModel().getProperty("/ManagePettyCashData/CashJournalKey"),
						group: "ManagePettyCashFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.callCommonFinanceAPIRequest("/PettyCashSet/", "GET", dynamicFilters.ManagePettyCashFilter, null,
					"/ManagePettyCashData/itemData/");

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
			onProceed: function () {
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.FinanceCreateaRequestAPI() : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.FinanceCreateaRequestAPI() : null;

			},
			FinanceCreateaRequestAPI: function (oPayload) {
				//	var oPayload = this.getModel().getProperty("/PMCreateRequest/itemData/");
				var oPayload = {};
				oPayload.Username = "WT_POWER";
				oPayload.ServiceHeadertoItem = [];
				oPayload.Attachments = [];
				// debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'POST', '/ServNotificationSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.Notificat} `);
						this.getModel().setProperty("/PMCreateRequest/Header", oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			handleBackPress: function () {
				this.navigationBack();

			},
			/*onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},*/
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
				}
				/*	onProceed: function () {
						this.getOwnerComponent().getTargets().display("FinanceCreateRequest");
					},*/

		})
	})