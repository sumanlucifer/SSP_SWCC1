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
				this.callDropDownService();

			},

			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					FinanceAppVisible: null,
					CompanyF4: [],
					PlantF4: [],
					CashJournalF4: [],
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
								quantity: 1
							},
							ItemData: []
						},
						PeriodEndReconcilation: {
							Header: {
								GLAccount: ""
							},
							ItemData: []
						},
						PrepareReviewTrail: {
							Header: {
								quantity: 1,
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
								quantity: 1,
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
								quantity: 1,
								CompanyCode: "1000"
							},
							ItemData: []
						},
						IssueGovernment: {
							Header: {
								quantity: 1,
								FinancialManagementArea: "1000"

							},
							ItemData: []
						},
					},
					AssetLifecycle: {
						DepreciationProcess: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						PerfomAsset: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						RecordAsset: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						SaleofAssets: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						RetirementofAssets: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						TransferofAssets: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						ProjectCaptilization: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					AccountsReceivable: {
						Manageandprocess: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						Billing: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					InsuranceandClaim: {
						CreateInsurance: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						Billing: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					AccountPayable: {
						RecordProcess: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},
						ManagePettyCash: {
							Header: {
								quantity: 1,
								CompanyCode: "1000"

							},
							ItemData: []
						},

					},
					RecordandProcessInvoice: {
						itemData: []
					},
					MarineTransportation: {
						itemData: []
					},
					FinancialClose: {
						itemData: []
					},
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
					//	Cash Journal F4 Data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDSV_CASHJOURNALVH/', null,
						null),
					// Plant F4
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/A_Plant/', null,
						null),
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_POST_PERIOD_VARIANT/', null,
						null),
					//customer code
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/F_Mmim_Customer_Vh/', null,
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
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_FI_SRV"), 'GET', '/ZCDS_NONTECH_ASSET/', null,
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
				//     Plant F4 Valuehelp
				var aPlantF4Data = values[2].value.results;
				this.getModel().setProperty("/PlantF4/", aPlantF4Data);
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
				var aNontecnicalF4Data = values[24].value.results;
				this.getModel().setProperty("/NonTechnicalf4/", aNontecnicalF4Data);

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
						value: this.getModel().getProperty("/AccountPayable/ManagePettyCash/Header/CashJournalKey"),
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

				debugger;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.callCommonFinanceSearchRequest("/PettyInvoicesSet/",
					"GET", dynamicFilters.ManageRecordInvoiceFilter, null,
					"/AccountPayable/RecordandProcessInvoice/itemData/") : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.callCommonFinanceSearchRequest("/PettyCashSet/",
					"GET",
					dynamicFilters.ManagePettyCashFilter, null, "/AccountPayable/ManagePettyCash/itemData/") : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-3" ? this.callCommonFinanceSearchRequest() : null;

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
				debugger;
				var oPayloadHeader = this.getModel().getProperty("/AccountPayable/ManagePettyCash/Header/");
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/FinanceAppVisible/"),
					"MaterialQty": oPayloadHeader.quantity,
					"Plant": oPayloadHeader.Plant,
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": oPayloadHeader.CompanyCode
					},
					"ServiceHeadertoItem": [{
						"PostingNumber": "0100000118"

					}, {
						"PostingNumber": "0100000119"

					}]
				};

				this.FinanceCreateRequestAPI(oPayload);
				/*	this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.FinanceCreateaRequestAPI() : null;
					this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.FinanceCreateaRequestAPI() : null;
					this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-3" ? this.FinanceCreateaRequestAPI() : null;*/

			},
			FinanceCreateRequestAPI: function (oPayload) {
				//	var oPayload = this.getModel().getProperty("/PMCreateRequest/itemData/");

				debugger;
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

				// Update the count in the input field
				this.updateSelectedRowCount(aSelectedData.length);
			},
			updateSelectedRowCount: function (iCount) {
				// Assuming you have a model named 'selectedItemsModel'
				var selectedItemsModel = this.getView().getModel("selectedItemsModel");

				if (!selectedItemsModel) {
					selectedItemsModel = new JSONModel();
					this.getView().setModel(selectedItemsModel, "selectedItemsModel");
				}

				// Update the count property in the model
				selectedItemsModel.setProperty("/selectedRowCount", iCount);
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