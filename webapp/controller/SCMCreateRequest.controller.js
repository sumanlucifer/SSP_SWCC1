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
				this.callDropDownService();

				this.getModel().setProperty("/busy", true);
			},
			onValueHelpRequest: function (oEve) {
				debugger;
				// this._oMultiInput = this.getView().byId("multiInput");

				// //	this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
				// this._oValueHelpDialog.open();

				var sEntity = oEve.getSource().getAriaLabelledBy()[0].split("-")[3];
				var sEntityPath = oEve.getSource().getAriaLabelledBy()[0].split("-")[4];
				var sFragName = oEve.getSource().getAriaLabelledBy()[0].split("-")[5];

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

				var sModelPath = oEvent.getSource().getAriaDescribedBy()[0];
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
			_filterTable: function (oFilter, sType) {

				this.handleVHFilterTable(oFilter, sType);
			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PlantF4: [],
					WorkCenterF4: [],
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
						PreapreofDirectpurchase: {
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
				var Req_status = `/ZCDSV_DOMAINVH(p_domain='ZREQ_STAT')/Set/`;
				var Proj_Type = `/ZCDSV_DOMAINVH(p_domain='ZPROJ_TYP')/Set/`;
				var Estimate_Type = `/ZCDSV_DOMAINVH(p_domain='ZEST_TYP')/Set/`;
				var Technical_Type = `/ZCDSV_DOMAINVH(p_domain='ZTEC_EVA')/Set/`;
				var Conf_Proj = `/ZCDSV_DOMAINVH(p_domain='ZCONF_PROJ')/Set/`;
				var Site_Visit = `/ZCDSV_DOMAINVH(p_domain='ZSITE_VIS')/Set/`;
				var Ecomomic_Feasibility = `/ZCDSV_DOMAINVH(p_domain='ZECON_FEAS')/Set/`;
				var Security_Approval = `/ZCDSV_DOMAINVH(p_domain='ZSEC_PROJ')/Set/`;
				var Vendor_Type = `/ZCDSV_DOMAINVH(p_domain='ZVEN_TYP')/Set/`;

				var dynamicFilters = this.getFilters(filters);
				Promise.allSettled([
					// Plant F4
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/A_Plant/', null,
						null),
					// Workcenter F4
					/*	this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/ZCDSV_WORKCENTERVH/', null,
							null),*/
					//   Material Code F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ZCDSV_SCM_PRODUCTVH/', null,
						null),
					//CR type	
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/CRTypeSet/', null,
						null),
					//Material Type	
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/MaterialTypeSet/', null,
						null),
					//Industrial sector
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/IndustrySectorSet/', null,
						null),
					//external product sector
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_ExtProdGrp/', null,
						null),
					//PurchasingGroupSet
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/PurchasingGroupSet/', null,
						null),
					//Req status
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Req_status, null,
						null),
					//Proj_status 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Proj_Type, null,
						null),
					//Estimate_status 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Estimate_Type, null,
						null),
					//Technical_type 
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Technical_Type, null,
						null),
					//Confidential Project
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Conf_Proj, null,
						null),
					//Site visit
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Site_Visit, null,
						null),
					//Ecomomic_Feasibility
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Ecomomic_Feasibility, null,
						null),
					//Security_Approval
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Security_Approval, null,
						null),
					//Vendor_Type
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', Vendor_Type, null,
						null),
					//Movement Type
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/MovementTypeSet/', null,
						null),
					//Cost center
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_CostCenterVH/', null,
						null),
					//Goods Movement
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ZCDSV_GoodsMovementType/', null,
						null),
					//UOM
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ZCDSV_SCM_UOMVH/', null,
						null),
					//Product type
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_ProductPlantVHType/', null,
						null),
					//service group
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ServiceGroupSet/', null,
						null),
					// used in table material 	
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_ProductDescriptionType/', null,
						null),
					//Service code
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ServiceNoSet/', null,
						null)

				]).then(this.buildResponselist.bind(this)).catch(function (error) {}.bind(this));

			},
			buildResponselist: function (values) {
				debugger;
				this.getModel().setProperty("/busy", false);
				//Plant F4 Valuehelp
				var aPlantF4Data = values[0].value.results;
				this.getModel().setProperty("/PlantF4/", aPlantF4Data);
				//Material F4 Valuehelp
				var aMaterialF4Data = values[1].value.results;
				this.getModel().setProperty("/Materialf4/", aMaterialF4Data);
				//CR type F4 Valuehelp
				var acrF4Data = values[2].value.results;
				this.getModel().setProperty("/CRf4/", acrF4Data);
				//Material type type F4 Valuehelp
				var aMaterialTypeF4Data = values[3].value.results;
				this.getModel().setProperty("/MaterialTypef4/", aMaterialTypeF4Data);
				//Industrial Sector type F4 Valuehelp
				var aIndustrialSectorF4Data = values[4].value.results;
				this.getModel().setProperty("/IndustrialSectorf4/", aIndustrialSectorF4Data);
				//Ex Material F4 Valuehelp
				var aExMaterialF4Data = values[5].value.results;
				this.getModel().setProperty("/ExMaterialf4/", aExMaterialF4Data);
				//purchasing Group 
				var aPurchasingGroupF4Data = values[6].value.results;
				this.getModel().setProperty("/PurchasingGroupf4/", aPurchasingGroupF4Data);
				//Request Status
				var aRequestStatusF4Data = values[7].value.results;
				this.getModel().setProperty("/RequestStatusf4/", aRequestStatusF4Data);
				//proj type
				var aProjectTypeF4Data = values[8].value.results;
				this.getModel().setProperty("/ProjectTypef4/", aProjectTypeF4Data);
				//Estimate type
				var aEstimateTypeF4Data = values[9].value.results;
				this.getModel().setProperty("/EstimateTypef4/", aEstimateTypeF4Data);
				//Technical type
				var aTechnicalTypeF4Data = values[10].value.results;
				this.getModel().setProperty("/TechnicalTypef4/", aTechnicalTypeF4Data);
				//Confidential Project
				var aConfidentialProjF4Data = values[11].value.results;
				this.getModel().setProperty("/ConfidentialProjectf4/", aConfidentialProjF4Data);
				//Site Visit
				var aSiteVisitF4Data = values[12].value.results;
				this.getModel().setProperty("/SiteVisitf4/", aSiteVisitF4Data);
				//Economic Feasibility
				var aEconomicFeasF4Data = values[13].value.results;
				this.getModel().setProperty("/EconomicFeasibilityf4/", aEconomicFeasF4Data);
				//Security Approval
				var aSecurityApprovalF4Data = values[14].value.results;
				this.getModel().setProperty("/SecurityApprovalf4/", aSecurityApprovalF4Data);
				//Vendor type
				var aVendorTypeF4Data = values[15].value.results;
				this.getModel().setProperty("/VendorTypef4/", aVendorTypeF4Data);
				//Movement type
				var aMovementTypeF4Data = values[16].value.results;
				this.getModel().setProperty("/MovementTypef4/", aMovementTypeF4Data);
				//cost center
				var aCostCenterF4Data = values[17].value.results;
				this.getModel().setProperty("/CostCenterf4/", aCostCenterF4Data);
				//goods movement type
				var aGoodsMovementF4Data = values[18].value.results;
				this.getModel().setProperty("/GoodsMovementf4/", aGoodsMovementF4Data);
				//UOM
				var aUomF4Data = values[19].value.results;
				this.getModel().setProperty("/UOMf4/", aUomF4Data);
				//Product type
				var aProductTypeF4Data = values[20].value.results;
				this.getModel().setProperty("/ProductTypef4/", aProductTypeF4Data);
				//Service Group 
				var aServiceGroupF4Data = values[21].value.results;
				this.getModel().setProperty("/ServiceGroupf4/", aServiceGroupF4Data);
				// Service code 
				var aServiceCodeF4Data = values[22].value.results;
				this.getModel().setProperty("/ServiceCodef4/", aServiceCodeF4Data);
				// used in table material
				var aMaterialtypeF4Data = values[23].value.results;
				this.getModel().setProperty("/MaterialTypef4/", aMaterialtypeF4Data);

			},

			SCMCreateaRequestAPI: function (oPayload) {
				debugger;
				var oPayload = this.getModel().getProperty("/MaterialProcurement/Header/");
				var oPayload = {};
				oPayload.Username = this.getCurrentUserLoggedIn();
				oPayload.ServiceHeadertoItem = [];
				//oPayload.Attachments = [];
				// debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'POST', '/ServNotificationSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.Notificat} `);
						this.getModel().setProperty("/MaterialProcurement/Header", oResponse.results);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						MessageBox.error(error.responseText);
						this.getModel().setProperty("/busy", false);
					}.bind(this));

			},
			onSaveRequest: function () {
				debugger;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-FIN-3001-1" ? this.SCMCreateRequestPayload() : null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" ? this.SCMCreateRequestPayload(this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/Header/"), this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-FIN-3003-3" ? this.SCMCreateRequestPayload() : null;
				debugger;

			},
			SCMCreateRequestPayload: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": oPayloadHeader.Plant,
					"Descript": oPayloadHeader.Descript,
					"ZHeaderExtra": {
						"Justification": oPayloadHeader.PR_JUST,
						"TenderQualification": oPayloadHeader.TEN_PRE,
						"TotalValue": oPayloadHeader.TOT_EST_VAL
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Material: aItem.MATNR

							};
						}
					)

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			onAddItemsPress: function (oEvent) {
				var oModel = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/itemData");
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					MATNR: "",
					Description: "",
					MENGE: "",
					BaseUnit: "",
					WERKS: "",
					Ekgrp: "",
					AFNAM: "",
					UNIT_PRICE: ""
				});
				this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/itemData", oItems);

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