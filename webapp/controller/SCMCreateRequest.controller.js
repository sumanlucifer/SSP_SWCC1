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
			/* Value help request */
			onValueHelpRequest: function (oEve) {
				debugger;
				var iIndex = oEve.getSource().getBindingContext() ? parseInt(oEve.getSource().getBindingContext().getPath().split("/")[4]) : "";
				this.getModel().setProperty("/itemIndex", iIndex);
				var sValuehelpCheck = this.handleItemValuehelps(iIndex, oEve.getSource().getAriaLabelledBy()[0].split("-")[6]);
				this.getModel().setProperty("/valueHelpName", oEve.getSource().getAriaLabelledBy()[0].split("-")[6]);
				var sEntity = oEve.getSource().getAriaLabelledBy()[0].split("-")[3];
				var sEntityPath = oEve.getSource().getAriaLabelledBy()[0].split("-")[4];
				var sFragName = oEve.getSource().getAriaLabelledBy()[0].split("-")[5];
				var sFragModel = sValuehelpCheck === "" ? oEve.getSource().getAriaLabelledBy()[0].split("-")[6] : sValuehelpCheck;
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

				this.onHandleValueHelpRequest(oModel, aColumns, sEntityPath, sFragName);

			},

			handleItemValuehelps: function (iIndex, valuehelpModel) {
				if (iIndex === "") {
					this.getModel().setProperty("/HeaderValueHelp", true);
					return "";
				}

				this.getModel().setProperty("/HeaderValueHelp", false)
				var sModelPath;
				// Procurement: Computer devices and accessories Screen
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && this.getModel().getProperty(
						"/WarehouseandLogistics/IssueofMaterial/itemData").length !== 0 ?
					`/WarehouseandLogistics/IssueofMaterial/itemData/${iIndex}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && this.getModel().getProperty(
						"/ClasssificationandInventory/STO/itemData").length !== 0 ?
					`/ClasssificationandInventory/STO/itemData/${iIndex}${valuehelpModel}` :
					sModelPath;
				return sModelPath;
			},
			onValueHelpOkPress: function (oEvent) {
				var sModelPath = this.getModel().getProperty("/FragModel");
				var tokens = oEvent.getParameter("tokens"); // Pass the tokens you want to process
				var sKeyProperty = this.getModel().getProperty("/valueHelpKey1"); // Property name to set in the model
				var textProperty = this.getModel().getProperty("/valueHelpKey2"); // Property name for the token text
				var yourModel = this.getModel(); // Pass your model here
				var sModelPath = sModelPath;

				this.onHandleValueHelpOkPress(yourModel, sModelPath, tokens, sKeyProperty, textProperty);
				this.setDependentFilterData();

			},
			setDependentFilterData: function () {
				// Procurement: Computer devices and accessories Screen
				if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ProductF4/") {
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Product",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_SCM_PRODUCTVH",
						dynamicFilters.Item_ProductFilter,
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}`)
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/WarehouseF4/") {
					var filters = [

						{
							path: "Material",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "WareHouseFilter",
							useOR: true

						}, {
							path: "Warehouse",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/WarehouseF4/`).split(
								"-")[0],
							group: "WareHouseFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_SC_STORAGEBIN",
						dynamicFilters.WareHouseFilter,
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}`)
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && !this.getModel().getProperty(
						"/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ProductF4/") {
					var filters = [

						{
							path: "Product",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "Sto_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_SCM_PRODUCTVH",
						dynamicFilters.Sto_ProductFilter,
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}`)
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && !this.getModel().getProperty(
						"/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ProductF4/") {
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Product",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/C_StorageLocationVH",
						dynamicFilters.Item_ProductFilter,
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}`)
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && !this.getModel().getProperty(
						"/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/StoragelocationF4/") {
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Material",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "StorageLoc",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`).split(
								"-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/SCMStockCheckSet",
						dynamicFilters.Item_ProductFilter,
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}`)
				}
			},
			callDependentFilterAPI: function (entity, path, filter, model) {

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel(entity), 'GET', path, null, filter, null
				).then(function (oResponse) {
					this.handleDependentFilterResponse(oResponse.results, `${model}`);
					this.getModel().setProperty("/busy", false);

				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
			},

			handleDependentFilterResponse: function (aData, oModel) {
				if (!aData[0]) {
					return;
				}

				if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && this.getModel().getProperty("/FragModel") ===
					`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {
					this.getModel().setProperty(`${oModel}/Plant/`, aData[0].Plant);
					this.getModel().setProperty(`${oModel}/BaseUnit/`, aData[0].BaseUnit);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && this.getModel().getProperty("/FragModel") ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {
					debugger;
					this.getModel().setProperty(`${oModel}/Plant/`, aData[0].Plant);
					this.getModel().setProperty(`${oModel}/BaseUnit/`, aData[0].BaseUnit);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && this.getModel().getProperty("/FragModel") ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`) {
					debugger;
					this.getModel().setProperty(`${oModel}/Plant/`, aData[0].Plant);
					this.getModel().setProperty(`${oModel}/BaseUnit/`, aData[0].BaseUnit);
				}

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
						operator: sap.ui.model.FilterOperator.Contains,
						group: "DynamicF4SearchFilter"
					}

				];
				var dynamicFilters = this.getFilters(filters);

				this._filterTable(Object.keys(dynamicFilters).length === 0 ? [] : dynamicFilters.DynamicF4SearchFilter);
			},
			handleFiltersForValueHelp: function (F4) {

				var aFilter;

				if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
					`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {

					var filters = [{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "Material4Filter"
						}

					];

					var dynamicFilters = this.getFilters(filters);

					aFilter = this._getfilterforControl(dynamicFilters.Material4Filter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
					`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`) {

					var filters = [{
							path: "Material",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "StorageFilter",
							useOR: true
						}, {
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
					`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/WarehouseF4/`) {

					var filters = [{
							path: "Lgort",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`).split(
								"-")[0],
							group: "WarehouseFilter",
							useOR: true
						}, {
							path: "Werks",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "WarehouseFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.WarehouseFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && F4 ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {

					var filters = [{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "ProductFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.ProductFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && F4 ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`) {

					var filters = [{
							path: "Material",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "StorageFilter",
							useOR: true
						}, {
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && F4 ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`) {

					var filters = [{
							path: "Material",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "StorageFilter",
							useOR: true
						}, {
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "StorageFilter"
						}, {
							path: "StorageLoc",
							value: this.getModel().getProperty(
								`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`).split(
								"-")[0],
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);
				} else {
					// Default case if none of the conditions are met
					aFilter = [];
				}

				this.getModel().setProperty("/DynamicValuehelpFilter", aFilter.length == 0 ? [] : aFilter);

			},
			onValueHelpAfterOpen: function () {

				//   apply filter before value help open 
				var aFilter = this.getModel().getProperty("/DynamicValuehelpFilter");

				this._filterTable(aFilter, "Control");
			},
			onClearFilter: function (oEve) {
				var afilterBar = oEve.getParameter("selectionSet");
				afilterBar[0].setValue(null);
				afilterBar[1].setValue(null);
				this._filterTable(
					new Filter({
						filters: [],
						and: false,
					})
				);
			},
			_getfilterforControl: function (aFilter) {

				if (!aFilter) {
					return [];
				}
				return new Filter(aFilter);

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
							"/WarehouseandLogistics/IssueofMaterial/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/IssueofMaterial/itemData/")) :
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
				//--------------------------Digital Catalogue-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.ScmCreatestoRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/STO/Header/"), this.getModel().getProperty(
							"/ClasssificationandInventory/STO/itemData/")) :
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

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Werks: items.Plant,
								Menge: items.Menge,
								Lgort: items.StoragelocationF4 ? items.StoragelocationF4.split("-")[0] : "",
								/*Lglpa: items.Lgpla,*/
								Sgtxt: items.Sgtxt,

							};
						}
					)

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
			ScmCreatestoRequest: function (oPayloadHeader, aItem) {
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"SupplPlant": this.getModel().getProperty("/SuppPlantF4/ ") ? this.getModel().getProperty("/SuppPlantF4/").split("-")[
							0] : "",
						"Ekgrp": this.getModel().getProperty("/PurchasinggroupF4/ ") ? this.getModel().getProperty("/PurchasinggroupF4/").split("-")[0] : "",
						"Werks": this.getModel().getProperty("/PlantF4/ ") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Werks: items.Plant,
								/*	Menge: items.Menge,*/
								Lgort: items.StoragelocationF4 ? items.StoragelocationF4.split("-")[0] : ""
									/*Lglpa: items.Lgpla,*/
									/*Sgtxt: items.Sgtxt,*/

							};
						}
					)

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
					Wercks: "",
					Menge: "",
					Plant: "",
					BaseUnit: "",
					Lgort: "",
					Lgpla: "",
					Sgtxt: ""

				}, "/WarehouseandLogistics/IssueofMaterial/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ProcurementAdhoc/PrepareofDirectpurchase/itemData"), {
					Matnr: "",
					Wercks: "",
					Lgort: ""
				}, "/ClasssificationandInventory/STO/itemData") : "";

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