sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],

	function (BaseController, JSONModel, History, MessageBox, Fragment, Filter, FilterOperator) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.SCMCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("SCMCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				// debugger;
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				var sBaseUnit = sServiceProductLocalVal.split("_")[3];
				this.getModel().setProperty("/MaterialProcurement/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.getModel().setProperty("/SCMAppVisible/", sServiceProduct);
				//this.callDropDownService();

				this.getModel().setProperty("/busy", true);
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
						path: "shkzg",
						value: "H",
						group: "MovementtypeF4Filter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				var aFilter;

				if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 === "/MovementtypeF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.MovementtypeF4Filter);
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
				return aFilter;

				//	return dynamicFilters.PlantFilter;
			},

			_filterTable: function (oFilter, sType) {

				this.handleVHFilterTable(oFilter, sType);
			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PlantF4: "",
					TypeofcompetitionF4: "",
					//WorkCenterF4: [],
					//Crtype: [],
					recognitionAlreadyStarted: false,
					SCMAppVisible: null,
					ProcurementAdhoc: {
						MaterialProcurement: {
							Header: {},
							itemData: []
						},
						ServiceProcurement: {
							Header: {},
							itemData: []
						},
						PrepareofDirectpurchase: {
							Header: {},
							itemData: []
						},
						PrepareforTender: {
							Header: {},
							itemData: []
						},
						PrepareforFramework: {
							Header: {},
							itemData: []
						},
					},
					Quality: {
						SpecalizedWorkQualification: {
							Header: {},
							itemData: []
						},
						ManfactureQualification: {
							Header: {},
							itemData: []
						},
						ConsultantQualification: {
							Header: {},
							itemData: []
						}
					},
					ClasssificationandInventory: {
						ChangeRequest: {
							Header: {},
							itemData: []
						},
						DuplicateResolution: {
							Header: {},
							itemData: []
						},
						SPIR: {
							Header: {},
							itemData: []
						},
						STO: {
							Header: {},
							itemData: []
						}
					},
					WarehouseandLogistics: {
						IssueofMaterial: {
							Header: {},
							itemData: []
						}
					},

				});
			},
			PlantF4: function () {
				this.getModel().setProperty("/busy", true);
				this.CallValueHelpAPI('/A_Plant/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/PMCreateRequest/PlantF4/", oResponse.results);
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

			},
			handleBackPress: function () {
				this.navigationBack();

			},

			onProceed: function () {
				debugger;
				//-----------------Procurement-ADHOC-----------------------------------------------------
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" ? this.ScmCreateServiceProcurementRequest(this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/Header/"), this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/customItemData/")) : null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" ? this.ScmCreateMaterialProcurementRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/customItemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" ? this.ScmCreateRfcRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData/")) :
					null;
				//--------------------------Qualification-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2005-1" ? this.ScmCreatespecializedworkqualificationRequest(this.getModel()
						.getProperty(
							"/Quality/SpecalizedWorkQualification/Header/"), "") :
					null;
				//--------------------------Warehouseand logistics-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" ? this.ScmCreateissueofmaterialRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/IssueofMaterial/Header/"), "") :
					null;
				//-------------------------Classification and Inventory-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" ? this.ScmCreatechangeRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/ChangeRequest/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" ? this.ScmCreateduplicateresolutionRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/DuplicateResolution/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2012-1" ? this.ScmCreatespirRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/SPIR/Header/"), "") :
					null;
			},

			ScmCreateServiceProcurementRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Gjahr": oPayloadHeader.FiscalYear,
						"Bukrs": this.getModel().getProperty("/CompanycodeF4/") ? this.getModel().getProperty("/CompanycodeF4/").split("-")[0] : ""
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
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateMaterialProcurementRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Justification": oPayloadHeader.PR_JUST,
						"TenderQualification": oPayloadHeader.TEN_PRE,
						"TotalValue": oPayloadHeader.TOT_EST_VAL
					},

					/*	"ServiceHeadertoItem": aItem.map(
							function (items) {
								return {
									Material: aItem.MATNR
								};
							}
						)*/

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateRfcRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					//"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"SecName": oPayloadHeader.SEC_NAME,
						"ReqParty": oPayloadHeader.REQ_PARTY,
						"CompTyp": this.getModel().getProperty("/TypeofcompetitionF4/ ") ? this.getModel().getProperty("/TypeofcompetitionF4/")
							.split("-")[0] : "",
						"EstCost": oPayloadHeader.EST_COST,
						"ImpPeriod": oPayloadHeader.IMP_PERIOD,
						"ProjName": oPayloadHeader.PROJ_NAME
					},

					"ServiceHeadertoItem": aItem

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatespecializedworkqualificationRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"QualTyp": oPayloadHeader.QUAL_TYP,
						"SuppName": oPayloadHeader.SUPP_NAME,
						"VenTyp": this.getModel().getProperty("/ProjectstatusF4/ ") ? this.getModel().getProperty("/ProjectstatusF4/").split("-")[0] : "",
						"SuppCon": oPayloadHeader.SUPP_CON,
						"SuppCr": oPayloadHeader.SUPP_CR,
						"ProjName": oPayloadHeader.PROJ_NAME
					},

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateissueofmaterialRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Rsdat": this.handleOdataDateFormat(oPayloadHeader.Rsdat),
						//"Bwart": oPayloadHeader.BWART,
						"Bwart": this.getModel().getProperty("/MovementtypeF4/ ") ? this.getModel().getProperty("/MovementtypeF4/").split("-")[0] : "",
						"Kostl": this.getModel().getProperty("/costF4/ ") ? this.getModel().getProperty("/costF4/").split("-")[0] : "",
						"Wempf": oPayloadHeader.WEMPF,
					},

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatechangeRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Rsdat": this.handleOdataDateFormat(oPayloadHeader.Rsdat),
						//"Bwart": oPayloadHeader.BWART,
						"Bwart": this.getModel().getProperty("/MovementtypeF4/ ") ? this.getModel().getProperty("/MovementtypeF4/").split("-")[0] : "",
						"Kostl": this.getModel().getProperty("/costF4/ ") ? this.getModel().getProperty("/costF4/").split("-")[0] : "",
						"Wempf": oPayloadHeader.WEMPF,
					},

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateduplicateresolutionRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"Menge": oPayloadHeader.MENGE,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {},

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatespirRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"SpirNo": this.handleOdataDateFormat(oPayloadHeader.SPIR_NO),
						//"Bwart": oPayloadHeader.BWART,
						"Equnr": this.getModel().getProperty("/MovementtypeF4/ ") ? this.getModel().getProperty("/MovementtypeF4/").split("-")[0] : "",
						"EquiTyp": oPayloadHeader.EQUI_TYP,
						"SpirSub": oPayloadHeader.SPIR_SUB,
					},

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},

			SCMCreateaRequestAPI: function (oPayload) {
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

				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ProcurementAdhoc/PrepareofDirectpurchase/itemData"), {
					Matnr: "",
					Menge: ""
				}, "/ProcurementAdhoc/PrepareofDirectpurchase/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ClasssificationandInventory/STO/itemData"), {
					ProductF4: null,
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ClasssificationandInventory/STO/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/WarehouseandLogistics/IssueofMaterial/itemData"), {
					Matnr: "",
					Menge: ""
				}, "/WarehouseandLogistics/IssueofMaterial/itemData") : "";

			},

			updateItemAddModel: function (oModel, obj, path) {

				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push(obj);
				this.getModel().setProperty(`${path}`, oItems);
			},
			onDeleteItemPress: function (oEvent) {
				var iRowNumberToDelete = parseInt(oEvent.getSource().getBindingContext().getPath().split("/")[3]);
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ClasssificationandInventory/STO/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/WarehouseandLogistics/IssueofMaterial/itemData")) : "";
			},
			updateItemDeleteModel: function (index, oModel) {
				oModel.splice(index, 1);
				this.getModel().refresh();
			},

			/*	var iRowNumberToDelete = parseInt(oEvent.getSource().getBindingContext().getPath().split("/")[3]);
				var aTableData = this.getModel().getProperty("/ProcurementAdhoc/PrepareofDirectpurchase/itemData");
				aTableData.splice(iRowNumberToDelete, 1);
				this.getModel().refresh();*/
			/* File uplaod 	*/
			onFileAdded: function (oEvent) {
				debugger;
				var that = this;
				var oFileUploader = oEvent.getSource();
				var aFiles = oEvent.getParameter("files");

				if (aFiles.length === 0)
					return;

				var Filename = aFiles[0].name,
					Filetype = aFiles[0].type,
					Filedata = aFiles[0],
					Filesize = aFiles[0].size;

				//code for base64/binary array 
				this._getImageData((Filedata), function (Filecontent) {
					that._addData(Filecontent, Filename, Filetype, Filesize);
				});
				// var oUploadSet = this.byId("UploadSet");
				// oUploadSet.getDefaultFileUploader().setEnabled(false);

			},
			_addData: function (Filecontent, Filename, Filetype, Filesize) {

				debugger;
				var oModel = this.getModel().getProperty("/UploadedData");
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					Filename: Filename,
					Mimetype: Filetype,
					Value: Filecontent,
					//Filesize: Filesize

				});
				this.getModel().setProperty("/UploadedData", oItems);

			},
			handleMissmatch: function () {
				this.handleFileMissmatch();
			},
			onFileSizeExceed: function () {

				this.handleFileSizeExceed();
			}

			/*,

						onSearch: function () {

							this.oRouter.navTo("LandingView");

						}*/
		})
	})