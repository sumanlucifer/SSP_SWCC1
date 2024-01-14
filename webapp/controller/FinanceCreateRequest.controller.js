sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],

	function (BaseController, JSONModel, History, MessageBox, Filter, FilterOperator) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.FinaceCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("FinanceCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				//var sValue = jQuery.sap.getUriParameters().get("param");
				//debugger;
				this._createItemDataModel();
				this.getModel().setSizeLimit(1000);
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/FinanceAppVisible/", sServiceProduct);
				// this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);

			},
			onValueHelpRequest: function (oEve) {

				// this._oMultiInput = this.getView().byId("multiInput");

				// //	this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				// this._oValueHelpDialog.open();

				var sEntity = oEve.getSource().getAriaLabelledBy()[0].split("-")[3];
				var sEntityPath = oEve.getSource().getAriaLabelledBy()[0].split("-")[4];
				var sFragName = oEve.getSource().getAriaLabelledBy()[0].split("-")[5];
				var sFragModel = oEve.getSource().getAriaLabelledBy()[0].split("-")[6];
				this.getModel().setProperty("/FragModel", sFragModel);
				this.handleFiltersForValueHelp(this.getModel().getProperty("/FragModel"));
				var sColumn1Template = oEve.getSource().getCustomData()[0].getKey();
				var sColumn1Label = oEve.getSource().getCustomData()[0].getValue();
				var sColumn2Template = oEve.getSource().getCustomData()[1].getKey();
				var sColumn2Label = oEve.getSource().getCustomData()[1].getValue();
				this.getModel().setProperty("/valueHelpKey1", sColumn1Template);
				this.getModel().setProperty("/valueHelpKey2", sColumn2Template);
				// Example usage:
				var oModel = this.getOwnerComponent().getModel(sEntity);
				var aColumns = [{
					label: sColumn1Label,
					template: sColumn1Template,
					width: "10rem",
				}, {
					label: sColumn2Label,
					template: sColumn2Template,
				}];

				// var sPath = "/ZCDSV_EQUIPMENTVH";

				this.onHandleValueHelpRequest(oModel, aColumns, sEntityPath, sFragName);

			},
			onValueHelpOkPress: function (oEvent) {
				debugger;

				var sModelPath = this.getModel().getProperty("/FragModel");
				var tokens = oEvent.getParameter("tokens"); // Pass the tokens you want to process
				var sKeyProperty = this.getModel().getProperty("/valueHelpKey1"); // Property name to set in the model
				var textProperty = this.getModel().getProperty("/valueHelpKey2"); // Property name for the token text
				var yourModel = this.getModel(); // Pass your model here
				var sModelPath = sModelPath;

				this.onHandleValueHelpOkPress(yourModel, sModelPath, tokens, sKeyProperty, textProperty);

			},
			onValueHelpCancelPress: function () {
				this.onHandleValueHelpCancelPress();
			},
			onFilterBarSearch: function (oEvent) {
				var afilterBar = oEvent.getParameter("selectionSet");
				var filters = [{
						path: this.getModel().getProperty("/valueHelpKey1"),
						value: afilterBar[0].getValue(),
						group: "DynamicF4SearchFilter"
					}, {
						path: this.getModel().getProperty("/valueHelpKey2"),
						value: afilterBar[1].getValue(),
						group: "DynamicF4SearchFilter"
					}

				];
				var dynamicFilters = this.getFilters(filters);

				this._filterTable(
					new Filter({
						filters: dynamicFilters.DynamicF4SearchFilter,
						and: false,
					})
				);
			},
			handleFiltersForValueHelp: function (F4) {
				debugger;
				var filters = [{
						path: "CompanyCode",
						value: "1000",
						group: "GLF4Filter"
					}, {
						path: "FiscalYear",
						value: this.getModel().getProperty("/AccountPayable/ManagePettyCash/Header/FiscalYear") ? this.getModel().getProperty(
							"/AccountPayable/ManagePettyCash/Header/FiscalYear") : "",
						group: "CashJrnlF4Filter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				var aFilter;

				if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-4" && F4 === "/GlaccountF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.GLF4Filter);
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-1" && F4 === "/GlaccountF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.GLF4Filter);
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-2" && F4 === "/GlaccountF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.GLF4Filter);
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-1" && F4 === "/GlaccountF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.GLF4Filter);
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" && F4 === "/CashJornalF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.CashJrnlF4Filter);
				} else {
					// Default case if none of the conditions are met
					aFilter = [];
				}

				this.getModel().setProperty("/DynamicValuehelpFilter", aFilter.length == 0 ? [] : aFilter);

			},
			onValueHelpAfterOpen: function () {
				debugger;
				//   apply filter before value help open 
				var aFilter = this.getModel().getProperty("/DynamicValuehelpFilter");

				this._filterTable(aFilter, "Control");
			},
			_getfilterforControl: function (aFilter) {

				if (!aFilter) {
					return [];
				}
				return new Filter({
					filters: aFilter,
					and: true,
				});

				//	return dynamicFilters.PlantFilter;
			},

			_filterTable: function (oFilter, sType) {

				this.handleVHFilterTable(oFilter, sType);
			},

			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					FinanceAppVisible: null,
					CompanycodeF4: "1000- SWCC",
					PlantF4: "",
					Assestsupernumber: "",
					CashJournalF4: "",
					GLAccountf4: "",
					ManagePettyCashData: {
						Header: {
							CompanyCode: "1000"
						},
						itemData: []
					},
					FinancialReviewGeneralClose: {

						FinancialClose: {
							Header: {
								PostPerVariant: "1000",
								quantity: "1"
							},
							ItemData: []
						},
						PeriodEndReconcilation: {
							Header: {
								quantity: "1",
								GLAccount: ""
							},
							ItemData: []
						},
						PrepareReviewTrail: {
							Header: {
								quantity: "1",
								ChartOfAccounts: "1000",
								CurrencyRole: 10,
								Ledger: "0L",
								GLAccount: "",
								CompanyCode: "1000"
							},
							ItemData: []
						},
						IssueFinancialStatement: {
							Header: {
								quantity: "1",
								ChartOfAccounts: "1000",
								CurrencyRole: 10,
								Ledger: "0L",
								GLAccount: "",
								LanguageCode: "EN",
								CompanyCode: "1000"
							},
							ItemData: []
						},
						MaintainChart: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"
							},
							ItemData: []
						},
						IssueGovernment: {
							Header: {
								quantity: "1",
								FinancialManagementArea: "1000"

							},
							ItemData: []
						},
					},
					AssetLifecycle: {
						DepreciationProcess: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						PerfomAsset: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						RecordAsset: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						SaleofAssets: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						RetirementofAssets: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						TransferofAssets: {
							Header: {
								quantity: "1",
								CompanyCode: "1000",
								SubNumber: 0

							},
							ItemData: []
						},
						ProjectCaptilization: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					AccountsReceivable: {
						Manageandprocess: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							itemData: []
						},
						Billing: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							itemData: []
						},

					},
					InsuranceandClaim: {
						CreateInsurance: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},
						Billing: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					AccountPayable: {
						RecordProcess: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							itemData: []
						},
						ManagePettyCash: {
							Header: {
								quantity: "1",
								CompanyCode: "1000"

							},
							itemData: []
						},

					},
					RecordandProcessInvoice: {
						itemData: []
					},
					MarineTransportation: {
						itemData: []
					}
				});
			},

			onCheckPlantVal: function (oEve) {

				oEve.getSource().getSelectedKey() === "" ? oEve.getSource().setValue(null) : "";

			},

			handleManagePettyCashDateChange: function (oEve) {
				// debugger;
				var sYear = oEve.getSource().getValue();
			},

			onSearchFinanceRequest: function () {
				var filters = [{
						path: "CompanyCode",
						value: "1000",
						group: "ManagePettyCashFilter"
					}, {
						path: "FiscalYear",
						value: this.getModel().getProperty("/AccountPayable/ManagePettyCash/Header/FiscalYear"),
						group: "ManagePettyCashFilter"
					}, {
						path: "PostingNo",
						value: this.getModel().getProperty("/CashJornalF4") ? this.getModel().getProperty("/CashJornalF4").split("-")[0] : "",
						group: "ManagePettyCashFilter"
					}, {
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

				// Accounts Payable
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.callCommonFinanceSearchRequest("/PettyInvoicesSet/",
					"GET", dynamicFilters.ManageRecordInvoiceFilter, null,
					"/AccountPayable/RecordProcess/itemData/") : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.callCommonFinanceSearchRequest("/PettyCashSet/",
					"GET",
					dynamicFilters.ManagePettyCashFilter, null, "/AccountPayable/ManagePettyCash/itemData/") : null;

				// Accounts Recievable
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-2" ? this.callCommonFinanceSearchRequest(
					"/AccReceivableBillingSet/",
					"GET",
					dynamicFilters.ManagePettyCashFilter, null, "/AccountsReceivable/Billing/itemData/") : null;

				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-1" ? this.callCommonFinanceSearchRequest(
					"/ArCollectionProcessSet/",
					"GET",
					dynamicFilters.ManagePettyCashFilter, null, "/AccountsReceivable/Manageandprocess/itemData/") : null;

			},
			callCommonFinanceSearchRequest: function (Entity, operation, Filters, oPayload, oModelSet) {

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

				//   Accounts Payable
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.FinanceCreateRecordInvoiceRequest(this.getModel().getProperty(
					"/AccountPayable/RecordProcess/Header/"), this.getModel().getProperty("/AccountPayable/RecordProcess/customItemData/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.FinanceCreateManangePettyCashRequest(this.getModel()
						.getProperty(
							"/AccountPayable/ManagePettyCash/Header/"), this.getModel().getProperty("/AccountPayable/ManagePettyCash/customItemData/")) :
					null;

				// 	Accounts Recievable	

				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-1" ? this.FinanceCreateManageProcessRequest(this.getModel().getProperty(
					"/AccountsReceivable/Manageandprocess/Header/"), this.getModel().getProperty(
					"/AccountsReceivable/Manageandprocess/customItemData/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-2" ? this.FinanceCreateBillingRequest(this.getModel().getProperty(
					"/AccountsReceivable/Billing/Header/"), this.getModel().getProperty(
					"/AccountsReceivable/Billing/customItemData/")) : null;

				// Financial Review & General Ledger Close

				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-3" ? this.FinanceCreateFinancialCLoseRequest(this.getModel().getProperty(
					"/FinancialReviewGeneralClose/FinancialClose/Header/")) : null;

				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-4" ? this.FinanceCreatePeriodEndReconclRequest(this.getModel()
					.getProperty(
						"/FinancialReviewGeneralClose/PeriodEndReconcilation/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-1" ? this.FinanceCreatePrepareReviewBalanceRequest(this.getModel()
					.getProperty(
						"/FinancialReviewGeneralClose/PrepareReviewTrail/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-2" ? this.FinanceCreateIssueFinancialStmntsRequest(this.getModel()
					.getProperty(
						"/FinancialReviewGeneralClose/IssueFinancialStatement/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-5" ? this.FinanceCreateMaintainChartofAccRequest(this.getModel()
					.getProperty(
						"/FinancialReviewGeneralClose/MaintainChart/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3004-1" ? this.FinanceCreateIssueGovStatmntRequest(this.getModel()
					.getProperty(
						"/FinancialReviewGeneralClose/MaintainChart/Header/")) : null;

				// Asset LifeCycle
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3005-1" ? this.FinanceDepreciationProcessRequest(this.getModel()
					.getProperty(
						"/AssetLifecycle/DepreciationProcess/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3005-2" ? this.FinancePerformAsstInventoryRequest(this.getModel()
					.getProperty(
						"/AssetLifecycle/DepreciationProcess/Header/")) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3005-3A" ? this.FinanceRecordAssetRequest(this.getModel()
					.getProperty(
						"/AssetLifecycle/DepreciationProcess/Header/")) : null;

			},

			FinanceCreateManangePettyCashRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0]
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								PostingNumber: items.PostingNo,
								Budat: items.PostingDate,

							};
						}
					)

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceCreateRecordInvoiceRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0]
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Belnr: items.InvoiceNo,
								Budat: items.PostingDate,

							};
						}
					)

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceCreateManageProcessRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0]
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Vbeln: items.InvoiceNo,
								Budat: items.PostingDate,

							};
						}
					)

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceCreateBillingRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0]
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Vbeln: items.InvoiceNo,
								Budat: items.PostingDate,

							};
						}
					)

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceCreateFinancialCLoseRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"BukrsPp": this.getModel().getProperty("/PostingF4/").split("-")[0]
					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceCreatePeriodEndReconclRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Saknr": this.getModel().getProperty("/GlaccountF4/").split("-")[0],
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Allgstid": oPayloadHeader.OpenDate
					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceCreatePrepareReviewBalanceRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Saknr": this.getModel().getProperty("/GlaccountF4/").split("-")[0],
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Gjahr": oPayloadHeader.FiscalYear,
						"Curtp": this.getModel().getProperty("/CurrencytypeF4/").split("-")[0],
						"Ktopl": this.getModel().getProperty("/ChartofaccountF4/").split("-")[0],
						"Rldnr": this.getModel().getProperty("/LedgerF4/").split("-")[0],
						"BILABMON_FROM": "",
						"BILABMON_TO": ""

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceCreateIssueFinancialStmntsRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Saknr": this.getModel().getProperty("/GlaccountF4/").split("-")[0],
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Gjahr": oPayloadHeader.FiscalYear,
						"Curtp": this.getModel().getProperty("/CurrencytypeF4/").split("-")[0],
						"Ktopl": this.getModel().getProperty("/ChartofaccountF4/").split("-")[0],
						"Rldnr": this.getModel().getProperty("/LedgerF4/").split("-")[0],
						"BilabmonFrom": oPayloadHeader.BilabmonFrom,
						"BilabmonTo": oPayloadHeader.BilabmonTo,
						"BilavmonFrom": oPayloadHeader.BilavmonFrom,
						"BilavmonTo": oPayloadHeader.BilavmonTo,
						"Versn": this.getModel().getProperty("/FinancialstatmentF4/").split("-")[0],
						"Dspra": this.getModel().getProperty("/LanguageF4/").split("-")[0]

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceCreateMaintainChartofAccRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {

						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0]

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceCreateIssueGovStatmntRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {

						"Fikrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Gjhar": "",
						"POPER": ""

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinanceDepreciationProcessRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {

						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"AccPrinciple": this.getModel().getProperty("/AccountingprincipalF4/").split("-")[0],
						"Gjhar": oPayloadHeader.FiscalYear,
						"Poper": ""

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			FinancePerformAsstInventoryRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {

						"Bukrs": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Kostl": this.getModel().getProperty("/AccountingprincipalF4/").split("-")[0],
						"Brdatu": oPayloadHeader.FiscalYear,
						"Afabe1": ""

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceRecordAssetRequest: function (oPayloadHeader) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": this.getModel().getProperty("/PlantF4/").split("-")[0],
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {

						"Anlkl": this.getModel().getProperty("/CompanycodeF4/").split("-")[0],
						"Anln2": this.getModel().getProperty("/AccountingprincipalF4/").split("-")[0],
						"Txt50": oPayloadHeader.FiscalYear,
						"Anlhtxt": "",
						"Invnr": "",
						"Invzu": "",
						"Aktiv": "",
						"Werks": "",
						"Prctr": "",
						"Ord41": "",
						"Ord42": "",
						"Ord43": "",
						"Anlue": "",
						"Gdlgrp": ""

					},

					"ServiceHeadertoItem": []

				};
				this.FinanceCreateRequestAPI(oPayload);
			},
			FinanceCreateRequestAPI: function (oPayload) {
				debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'POST', '/ServNotificationSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.Notificat} `);

						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			handleBackPress: function () {
				this.navigationBack();

			},

			_handleMessageBoxProceed: function (sMessage) {
				var params = {
					sMessage: sMessage
				};

				this.createMessageBoxHandler(this.onPresshomepage.bind(this))(params);
			},
			onTableSelectionChange: function (oEvent) {
				var oTable = oEvent.getSource();
				var aSelectedItems = oTable.getSelectedItems();

				// Access data from selected items
				var aSelectedData = aSelectedItems.map(function (oItem) {
					return oItem.getBindingContext().getObject();
				});
				if (aSelectedData.length >= 10) {
					this.onDeselectItems(oTable);
					MessageBox.error("Please Select only 10 items");
					return false;
				}
				this.setSelectedItemData(aSelectedData);

				// Update the count in the input field
				this.updateSelectedRowCount(aSelectedData.length);
			},
			setSelectedItemData: function (aSelectedData) {
				// Accounts Payable
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.getModel().setProperty(
					"/AccountPayable/RecordProcess/customItemData", aSelectedData) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.getModel().setProperty(
					"/AccountPayable/ManagePettyCash/customItemData", aSelectedData) : null;
				// Accounts Recievable
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-1" ? this.getModel().setProperty(
					"/AccountsReceivable/Manageandprocess/customItemData", aSelectedData) : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3002-2" ? this.getModel().setProperty(
					"/AccountsReceivable/Billing/customItemData", aSelectedData) : null;

			},
			updateSelectedRowCount: function (iCount) {
				// Assuming you have a model named 'selectedItemsModel'
				var selectedItemsModel = this.getModel().setProperty("/itemCount", iCount);

			},
			onDeselectItems: function (oTable) {
				var aSelectedItems = oTable.getSelectedItems();

				aSelectedItems.forEach(function (oSelectedItem) {
					oSelectedItem.setSelected(false); // Deselect each selected item
				});
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