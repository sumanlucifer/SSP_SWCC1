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
				//	this.callDropDownService();

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

				if ((aFilter.length == 0)) {
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

			callDropDownService: function () {
				this.getModel().setProperty("/busy", true);
				var filters = [{
						path: "Country",
						value: "SA",
						group: "CountryFilter"
					}, {
						path: "CompanyCode",
						value: "1000",
						group: "CompanyFilter"
					}, {
						path: "LanguageCode",
						value: "EN",
						group: "LanguageFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				Promise.allSettled([
					//   Company Code F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/C_CompanyCodeVHTemp/', null,
						null),
					//	Cash Journal F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDSV_CASHJOURNALVH/', null,
						null),
					// Plant F4
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/A_Plant/', null,
						null),
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_POST_PERIOD_VARIANT/', null,
						null),
					//customer code
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_Customer_VH/', null,
						null),
					//General Leder
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_GeneralLedgerAccountVH/', null,
						dynamicFilters.CompanyFilter),
					//Chart of accounts
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_ChartOfAccountsStdVH/', null,
						null),
					//currency type
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_CurrencyTypeAndValuationView/', null,
						null),
					//Ledger type 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_LedgerStdVH/', null,
						null),
					//Language 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_LanguageText/', null,
						dynamicFilters.LanguageFilter),
					//Financial statment version  
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/C_FinancialStatementVersion/', null,
						null),
					//FM Area 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_FinMgmtAreaStdVH/', null,
						null),
					// Head of accounting section 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_HEAD_AS/', null,
						null),
					// Director of Finance  
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_DRCTOR_FM/', null,
						null),
					// Financial Auditor 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_Financial_Auditor/', null,
						null),
					//Accounting Principal  	
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_AccountingPrincipleText/', null,
						null),
					//cost center 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_CostCenterDetail/', null,
						null),
					//Deprication area
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_DeprAreaForLedgerVH/', null,
						null),
					//Area
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_Group1AssetEvaluationKey/', null,
						null),
					//Unit
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_Group2AssetEvaluationKey/', null,
						null),
					//System
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_Group3AssetEvaluationKey/', null,
						null),
					//Assest Class
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_AssetClassStdVH/', null,
						null),
					//Sub Number
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/Faa_Sil_Anla_Relevant/', null,
						null),
					//Super Number
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_ASSET_SUPER/', null,
						null),
					//Non Technical Assest
					// 	this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_NONTECH_ASSET/', null,
					// 		null),
					//Project captilization
					// 	this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/I_ProjectNtwkValueHelp/', null,
					// 		null),
					//Assest Sub number
					// this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_ASSET_MAIN/', null,
					// 	null),

				]).then(this.buildResponselist.bind(this)).catch(function (error) {}.bind(this));

			},

			handleManagePettyCashDateChange: function (oEve) {
				// debugger;
				var sYear = oEve.getSource().getValue();
			},
			buildResponselist: function (values) {

				this.getModel().setProperty("/busy", false);
				// 			Company F4 type response
				var aCompanyF4Data = values[0].value.results;
				this.getModel().setProperty("/CompanyF4/", aCompanyF4Data);
				// 			Cash Journal F4 type response
				//var aCashJournalF4Data = values[1].value.results;
				var aCashJournalF4Data = values[1].status === "rejected" ? null : values[1].value.results;
				this.getModel().setProperty("/CashJournalF4/", aCashJournalF4Data);
				//     Plant F4 Valuehelp
				var aPlantF4Data = values[2].value.results;
				this.getModel().setProperty("/PlantF4ytt/", null);
				//posting period f4 
				var aPostingPeriodF4Data = values[3].value.results;
				this.getModel().setProperty("/PostingPeriodF4/", aPostingPeriodF4Data);
				//customer code f4
				var aCustomerCodeF4Data = values[4].value.results;
				this.getModel().setProperty("/CustomerCodef4/", aCustomerCodeF4Data);
				//general ledger
				var aGeneralLedgerF4Data = values[5].value.results;
				this.getModel().setProperty("/GeneralLedgerf4/", aGeneralLedgerF4Data);
				//chart of accounts
				var aChartofAccountF4Data = values[6].value.results;
				this.getModel().setProperty("/ChartofAccountf4/", aChartofAccountF4Data);
				//currency type
				var aCurrencyTypeF4Data = values[7].value.results;
				this.getModel().setProperty("/CurrencyTypef4/", aCurrencyTypeF4Data);
				//Ledger Type
				var aLedgerTypeF4Data = values[8].value.results;
				this.getModel().setProperty("/LedgerTypef4/", aLedgerTypeF4Data);
				//Language Type
				var aLanuguageF4Data = values[9].value.results;
				this.getModel().setProperty("/Languagef4/", aLanuguageF4Data);
				//Financial Statement version
				var aFinancialStatementF4Data = values[10].value.results;
				this.getModel().setProperty("/FinancialStatementf4/", aFinancialStatementF4Data);
				//FM Area
				var aFmareaF4Data = values[11].value.results;
				this.getModel().setProperty("/Fmareaf4/", aFmareaF4Data);
				//Head of accounting
				var aHeadAccountF4Data = values[12].value.results;
				this.getModel().setProperty("/HeadAccountf4/", aHeadAccountF4Data);
				//Director of finance
				var aDirectorFinanceF4Data = values[13].value.results;
				this.getModel().setProperty("/DirectorFinancef4/", aDirectorFinanceF4Data);
				//Financial Auditor
				var aFinancialAuditorF4Data = values[14].value.results;
				this.getModel().setProperty("/FinancialAuditorf4/", aFinancialAuditorF4Data);
				//Accounting Principal
				var aAccouningPrincipalF4Data = values[15].value.results;
				this.getModel().setProperty("/AccountingPrincipalf4/", aAccouningPrincipalF4Data);
				//Cost center
				var aCostCenterF4Data = values[16].value.results;
				this.getModel().setProperty("/CostCenterf4/", aCostCenterF4Data);
				//Deprication Area
				var aDepricationAreaF4Data = values[17].value.results;
				this.getModel().setProperty("/DepricationAreaf4/", aDepricationAreaF4Data);
				//Area
				var aAreaF4Data = values[18].value.results;
				this.getModel().setProperty("/Areaf4/", aAreaF4Data);
				//Unit
				var aUnitF4Data = values[19].value.results;
				this.getModel().setProperty("/Unitf4/", aUnitF4Data);
				//System
				var aSystemF4Data = values[20].value.results;
				this.getModel().setProperty("/Systemf4/", aSystemF4Data);
				//assestclass
				var aAssestClassF4Data = values[21].value.results;
				this.getModel().setProperty("/AssestClassf4/", aAssestClassF4Data);
				//assestsub
				var aAssestSubF4Data = values[22].value.results;
				this.getModel().setProperty("/AssestSubf4/", aAssestSubF4Data);
				//assestsuper
				var aAssestSuperF4Data = values[23].value.results;
				this.getModel().setProperty("/AssestSuperf4/", aAssestSuperF4Data);
				//Non technical assest
				// var aNontecnicalF4Data = values[24].value.results;
				// this.getModel().setProperty("/NonTechnicalf4/", aNontecnicalF4Data);
				//Project captilization
				// var aProjectCaptialF4Data = values[25].value.results;
				// this.getModel().setProperty("/ProjectCaptialf4/", aProjectCaptialF4Data);
				//Assest sub number
				// var aSubNumberF4Data = values[26].value.results;
				// this.getModel().setProperty("/SubNumberf4/", aSubNumberF4Data);

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
						"BILABMON_FROM": "",
						"BILABMON_TO": "",
						"BILAVMON_FROM": "",
						"BILAVMON_TO": "",
						"Dspra": ""

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