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
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/FinanceAppVisible/", sServiceProduct);
				// this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.callDropDownService();

				var fiModel = this.getOwnerComponent().getModel("fiModel");

				/*	this.CallValueHelpFISRVAPI('/A_GLAccountText/')
						.then(function (oResponse) {
							this.getModel().setProperty("/busy", false);
							fiModel.setProperty("/GLAccount", oResponse.results);
							this.getView().setModel(fiModel, "fiModel");
						}.bind(this)).catch(function (error) {
							this.getModel().setProperty("/busy", false);
							MessageBox.error(error.responseText);
						}.bind(this));*/
				this.CallValueHelpFISRVAPI('/I_CostCenter/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/CostCenter", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/I_DeprAreaForLedgerVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/AssetDepreciationArea", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpFISRVAPI('/I_Group1AssetEvaluationKey/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/Group1AssetEvaluationKey", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/I_Group2AssetEvaluationKey/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/Group2AssetEvaluationKey", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/I_Group3AssetEvaluationKey/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/Group3AssetEvaluationKey", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/ZCDS_ASSET_SUPER/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/AssetSuperNum", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/ZCDS_NONTECH_ASSET/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/AssetNonTech", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/I_AssetClassStdVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/AssetClass", oResponse.results);
						this.getView().setModel(fiModel, "fiModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
				this.CallValueHelpFISRVAPI('/ZCDS_ASSET_MAIN/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						fiModel.setProperty("/AssetClass", oResponse.results);
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
								GLAccount: "1000"
							},
							ItemData: []
						},
						PrepareReviewTrail: {
							Header: {
								quantity: 1,
								ChartOfAccounts: "1000",
								CurrencyRole: 10,
								Ledger: "0L",
								GLAccount: "1000",
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
								GLAccount: "1000",
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
						group: "CountryFilter"
					}, {
						path: "CompanyCode",
						value: "1000",
						group: "CompanyFilter"
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
					//F_Min_customer
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
						null),
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
				//max custoemr f4
				var aMaxCustoF4Data = values[4].value.results;
				this.getModel().setProperty("/Maxcustomerf4/", aMaxCustoF4Data);
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

			},

			onSearchFinanceRequest: function () {
				// debugger;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.callManageRecordInvoice() : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.callManagePettyCashAPI() : null;
				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-3" ? this.callManagePettyCashAPI() : null;

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
						/*value: "1000",*/
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
				var oPayload = this.getModel().getProperty("/PMCreateRequest/Header/");

				this.FinanceCreateaRequestAPI(oPayload);
				/*	this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-1" ? this.FinanceCreateaRequestAPI() : null;
					this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.FinanceCreateaRequestAPI() : null;
					this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-3" ? this.FinanceCreateaRequestAPI() : null;*/

			},
			FinanceCreateaRequestAPI: function (oPayload) {
				//	var oPayload = this.getModel().getProperty("/PMCreateRequest/itemData/");
				var oPayload = {};
				oPayload.Material = this.getView().byId("finServiceProduct").getValue();
				oPayload.ServiceDescription = this.getView().byId("finDescription").getValue();
				oPayload.PostVarDesc = this.getView().byId("finPostingPeriod").getSelectedKey();
				oPayload.qty = this.getView().byId("finQty").getValue();
				oPayload.Username = "WT_POWER";
				oPayload.ServiceHeadertoItem = [];
				const aUploadData = this.getModel().getProperty("/PMCreateRequest/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				oPayload.Attachments = aUploadData;
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
			onProceed1: function () {

				/*this._handleMessageBoxProceed("Your Service Request has been generated : 12111099");*/
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