sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageToast"
	],

	function (BaseController, JSONModel, History, MessageBox, Fragment, Filter, FilterOperator, MessageToast) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.SCMCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("SCMCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				var sBaseUnit = sServiceProductLocalVal.split("_")[3];
				this.getModel().setProperty("/MaterialProcurement/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.getModel().setProperty("/SCMAppVisible/", sServiceProduct);
				var sUserPlant = this.handlegetlocalStorage("userPlant");
				this.getModel().setProperty("/PlantF4", sUserPlant);

				var sUserType = this.handlegetlocalStorage("userType");

			},
			/* Value help request */
			onValueHelpRequest: function (oEve) {
				var iIndex = oEve.getSource().getBindingContext() ? parseInt(oEve.getSource().getBindingContext().getPath().split("/")[4]) : "";
				this.getModel().setProperty("/itemIndex", iIndex);
				var sValuehelpCheck = this.handleItemValuehelps(iIndex, oEve.getSource().getAriaLabelledBy()[0].split("-")[6], oEve.getSource().getBindingContext());
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

			handleItemValuehelps: function (iIndex, valuehelpModel, oEveBinding) {
				if (iIndex === "") {
					this.getModel().setProperty("/HeaderValueHelp", true);
					return "";
				}

				this.getModel().setProperty("/HeaderValueHelp", false)
				var sModelPath;

				var sTableBindingPath = oEveBinding.getPath();
				var sTabelModel = sTableBindingPath.replace(/\/\d+$/, '');
				// Procurement: Computer devices and accessories Screen
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;

				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;

				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
					sModelPath;
				sModelPath = this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" && this.getModel().getProperty(
						`${sTabelModel}`).length !== 0 ?
					`${sTableBindingPath}${valuehelpModel}` :
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
				// Check each token and set visibility based on its value

				if (this.getModel()
					.getProperty("/valueHelpName") === "/CrtypeF4/") {
					tokens.forEach(function (token) {
						var tokenValue = token.getKey();
						if (["ZEMATL02", "ZFMATL02", "ZGMATL02", "ZHMATL02", "ZIMATL02", "ZJMATL02", "ZDMATL02"].includes(tokenValue)) {
							// Set visibility to true if any of the tokens match
							this.getModel().setProperty("/ClasssificationandInventory/ChangeRequest/Header/MaterialVisible/", true);
						} else {
							this.getModel().setProperty("/ClasssificationandInventory/ChangeRequest/Header/MaterialVisible/", false);
						}
					}.bind(this));
				}
				debugger;

				if (!this.handleItemValidation(this.getModel().getProperty(
						"/SCMAppVisible/"), this.getModel().getProperty(
						"/ClasssificationandInventory/DuplicateResolution/itemData/"), "Add")) return false;
				// Set the visibility property in the model

			},
			setDependentFilterData: function () {
				// Procurement: Computer devices and accessories Screen
				// if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
				// 	this.getModel()
				// 	.getProperty("/valueHelpName") === "/ProductF4/") {

				if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" &&
						!this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/") ||
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" &&
						!this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/") ||
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" &&
						!this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/") ||
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" &&
						!this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/") ||
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" &&
						!this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/")
				) {

					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Product",
							value: this.getModel().getProperty(`${this.getModel().getProperty("/FragModel")}`).split("-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_SCM_PRODUCTVH",
						dynamicFilters.Item_ProductFilter,
						`${this.getModel().getProperty("/FragModel")}`)
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/ProductF4/")) {
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/SuppPlantF4/") ? this.getModel().getProperty("/SuppPlantF4/").split("-")[0] : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Product",
							value: this.getModel().getProperty(`${this.getModel().getProperty("/FragModel")}`).split("-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_SCM_PRODUCTVH",
						dynamicFilters.Item_ProductFilter,
						`${this.getModel().getProperty("/FragModel")}`)
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/WarehouseF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" && !
						this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/WarehouseF4/")) {
					var filters = [

						{
							path: "Material",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
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
					.getProperty("/valueHelpName") === "/StoragelocationF4/") {
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
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
					var sMaterial = this.getModel().getProperty(
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
						"-")[0];
					var sPlant = this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "";
					var sstorageloc = this.getModel().getProperty(
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`).split(
						"-")[0];

					var serviceUrl = `/SCMStockCheckSet(Material='${sMaterial}',Plant='${sPlant}',StorageLoc='${sstorageloc}')`;
					this.callDependentFilterAPI("ZSSP_SCM_SRV", serviceUrl,
						null,
						`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`)
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/ClassF4/")) {
					var filters = [{
							path: "ClassInternalID",
							value: this.getModel().getProperty(`${this.getModel().getProperty("/FragModel")}`).split("-")[0],
							group: "WareHouseFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/I_ClfnClassCharcForKeyDate",
						dynamicFilters.WareHouseFilter,
						`${this.getModel().getProperty("/FragModel")}`)
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" && !this.getModel().getProperty(
						"/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ProductF4/") {
					debugger;
					var filters = [

						{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "Material",
							value: this.getModel().getProperty(`${this.getModel().getProperty("/FragModel")}`).split("-")[0],
							group: "Item_ProductFilter",
							useOR: true

						}, {
							path: "StorageLoc",
							value: "100",
							group: "Item_ProductFilter",
							useOR: true

						}
					];
					var sMaterial = this.getModel().getProperty(
						`/WarehouseandLogistics/Scrapsale/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
						"-")[0];
					var sPlant = this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "";
					var sstorageloc = 100;

					var serviceUrl = `/SCMStockCheckSet(Material='${sMaterial}',Plant='${sPlant}',StorageLoc='${sstorageloc}')`;
					this.callDependentFilterAPI("ZSSP_SCM_SRV", serviceUrl,
						null,
						`/WarehouseandLogistics/Scrapsale/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`)
				}
			},
			callDependentFilterAPI: function (entity, path, filter, model) {
				debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel(entity), 'GET', path, null, filter, null
				).then(function (oResponse) {
					this.handleDependentFilterResponse(oResponse.results ? oResponse.results : oResponse, `${model}`);
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
				debugger;
				var spath = oModel.replace(/\/[^/]+\/$/, '/');

				if ((this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`) || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`)) {
					this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
					this.getModel().setProperty(`${spath}/BaseUnit/`, aData[0].BaseUnit);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && this.getModel().getProperty("/FragModel") ===
					`${oModel}`) {
					var sF4 = oModel.replace(/\/$/, '').split('/').pop();
					if (sF4 === "ProductF4") {
						this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
						this.getModel().setProperty(`${spath}/BaseUnit/`, aData[0].BaseUnit);
						this.getModel().setProperty(`${spath}/Description/`, aData[0].Description);
					} else if (sF4 === "StoragelocationF4") {
						debugger;
						this.getModel().setProperty(`${spath}/Stock/`, aData.Stock ? aData.Stock : 0);
						this.getModel().setProperty(`${spath}/Price/`, aData.Price);
					}
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`) || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`)
				) {
					this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
					this.getModel().setProperty(`${spath}/BaseUnit/`, aData[0].BaseUnit);
					this.getModel().setProperty(`${spath}/Description/`, aData[0].Description);

				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`)
				) {
					this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
					/*this.getModel().setProperty(`${spath}/BaseUnit/`, aData[0].BaseUnit);*/
					this.getModel().setProperty(`${spath}/Description/`, aData[0].Description);

				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`)
				) {
					this.getModel().setProperty(`/ClasssificationandInventory/ChangeRequest/itemData/`, aData);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2") {
					this.getModel().setProperty(`/ContractManagement/IssuingContractualLetters/Header/Po`, aData[0].PurchaseOrder);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" && this.getModel().getProperty("/FragModel") ===
					`${oModel}`) {
					debugger;
					var sF4 = oModel.replace(/\/$/, '').split('/').pop();
					if (sF4 === "ProductF4") {
						this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
						this.getModel().setProperty(`${spath}/BaseUnit/`, aData[0].BaseUnit);
						this.getModel().setProperty(`${spath}/Description/`, aData[0].Description);
					}
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1" && this.getModel().getProperty("/FragModel") ===
						`${oModel}`)
				) {
					this.getModel().setProperty(`${spath}/Plant/`, aData[0].Plant);
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
				debugger;
				var aFilter;

				// if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
				// 	`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {

				if ((
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" &&
							F4 === `/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) ||
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" &&
							F4 === `/ProcurementAdhoc/MaterialProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) ||
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" &&
							F4 === `/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) ||
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" &&
							F4 === `/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) ||
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" &&
							F4 === `/ProcurementAdhoc/MaterialProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) ||
						(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" &&
							F4 === `/ClasssificationandInventory/DuplicateResolution/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`)
					)) {

					var filters = [{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
							group: "Material4Filter"
						}

					];

					var dynamicFilters = this.getFilters(filters);

					aFilter = this._getfilterforControl(dynamicFilters.Material4Filter);
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`) || (this.getModel()
						.getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" && F4 ===
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`)

				) {

					var filters = [{
							path: "Material",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`).split(
								"-")[0],
							group: "StorageFilter",
							useOR: true
						}, {
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/WarehouseF4/`) || (this.getModel().getProperty(
							"/SCMAppVisible/") === "SSA-PSCM-2010-3" && F4 ===
						`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/WarehouseF4/`)

				) {

					var filters = [{
							path: "Lgort",
							value: this.getModel().getProperty(
								`/WarehouseandLogistics/IssueofMaterial/itemData/${this.getModel().getProperty("/itemIndex")}/StoragelocationF4/`).split(
								"-")[0],
							group: "WarehouseFilter",
							useOR: true
						}, {
							path: "Werks",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
							group: "WarehouseFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.WarehouseFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" && F4 ===
					`/ClasssificationandInventory/STO/itemData/${this.getModel().getProperty("/itemIndex")}/ProductF4/`) {

					var filters = [{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
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
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
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
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
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
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && F4 ===
					`/MovementtypeF4/`) {
					debugger;
					var filters = [{
							path: "shkzg",
							value: "H",
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);

				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" && F4 ===
					`/MovementtypeF4/`) {
					var filters = [{
							path: "shkzg",
							value: "S",
							group: "StorageFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.StorageFilter);

				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2" && this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/PonoF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1" &&
						this.getModel()
						.getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/PonoF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2-A" &&
						this
						.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/PonoF4/") || (this.getModel().getProperty("/SCMAppVisible/") ===
						"SSA-PSCM-2007-1-A" && this
						.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/PonoF4/")) {
					var filters = [{
							path: "Supplier",
							value: this.getModel().getProperty("/SupplierF4/") ? this.getModel().getProperty("/SupplierF4/").split(
								"-")[0] : "",
							group: "WareHouseFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.WareHouseFilter);
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2" && this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/PrnoF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1" &&
						this.getModel()
						.getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/PrnoF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2-A" &&
						this
						.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/PrnoF4/") || (this.getModel().getProperty("/SCMAppVisible/") ===
						"SSA-PSCM-2007-1-A" && this
						.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/PrnoF4/")) {
					var filters = [{
							path: "PurchasingDocument",
							value: this.getModel().getProperty("/PonoF4/") ? this.getModel().getProperty("/PonoF4/").split("-")[0] : "",
							group: "WareHouseFilter",
							useOR: true

						}

					];

					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.WareHouseFilter);
				} else if (
					(this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2" && this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel()
						.getProperty("/valueHelpName") === "/ContractvalueF4/") || (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1" &&
						this.getModel()
						.getProperty("/HeaderValueHelp") && this.getModel()
						.getProperty("/valueHelpName") === "/ContractvalueF4/") || (this.getModel().getProperty("/SCMAppVisible/") ===
						"SSA-PSCM-2007-2-A" &&
						this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/ContractvalueF4/") || (this.getModel().getProperty("/SCMAppVisible/") ===
						"SSA-PSCM-2007-1-A" && this.getModel().getProperty("/HeaderValueHelp") &&
						this.getModel().getProperty("/valueHelpName") === "/ContractvalueF4/")) {
					var filters = [{
							path: "PurchaseOrder",
							value: this.getModel().getProperty("/PrnoF4/") ? this.getModel().getProperty("/PrnoF4/").split("-")[1].trim() : "",
							group: "WareHouseFilter",
							useOR: true
						}

					];

					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.WareHouseFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ProductF4/") {

					var filters = [{
							path: "Plant",
							value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
							group: "ProductFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.ProductFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/ClassF4/") {

					var filters = [{
							path: "ClassType",
							value: "001",
							group: "ProductFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.ProductFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" && this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel().getProperty("/valueHelpName") === "/MaterialgroupF4/") {
					debugger;
					var filters = [{
							path: "ExternalProductGroup",
							value: this.getModel().getProperty("/servicegroupF4/") ? this.getModel().getProperty("/servicegroupF4/").split("-")[0] : "",
							group: "ProductFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.ProductFilter);
				} else if (this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" && this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel().getProperty("/valueHelpName") === "/CostcenterF4/") {
					debugger;
					var filters = [{
							path: "usrid",
							value: this.getCurrentUserLoggedIn(),
							group: "userIdFilter"
						}

					];
					var dynamicFilters = this.getFilters(filters);
					aFilter = this._getfilterforControl(dynamicFilters.userIdFilter);
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
					IndustrysectorF4: "U- Utility Industry",
					PurchasinggroupF4: "901- STO-PlantRequestor",
					//WorkCenterF4: [],
					//Crtype: [],
					UploadedData: [],
					SCMAppVisible: null,
					ProcurementAdhoc: {
						MaterialProcurement: {
							Header: {},
							itemData: []
						},
						ServiceProcurement: {
							Header: {},
							itemData: [{
								Txz01: "",
								Matkl: "",
								Ekgrp: ""
							}],
							itemData1: []
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
					ContractManagement: {
						ContractualChangeOrders: {
							Header: {},
							itemData: []
						},
						NonContractualOrders: {
							Header: {},
							itemData: []
						},
						IssuingContractualLetters: {
							Header: {},
							itemData: []
						},
						ContractClosure: {
							Header: {},
							itemData: []
						}
					},
					ClasssificationandInventory: {
						ChangeRequest: {
							Header: {
								quantity: "1",
								MaterialVisible: false
							},
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
						},
						Localtransport: {
							Header: {},
							itemData: []
						},
						Localtransportsto: {
							Header: {},
							itemData: []
						},
						Scrapsale: {
							Header: {},
							itemData: []
						}
					},

				});
			},
			handleBackPress: function () {
				this.navigationBack();

			},
			handleBackHomePress: function () {
				this.getRouter().navTo("HomePage", {}, true);
			},

			onProceed: function (oEve) {

				//-----------------Procurement-ADHOC-----------------------------------------------------
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" ? this.ScmCreateServiceProcurementRequest(this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/Header/"), this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/itemData/"), this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/itemData1/")) : null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-2" ? this.ScmCreateServiceProcurementRequest(this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/Header/"), this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/itemData/"), this.getModel().getProperty(
					"/ProcurementAdhoc/ServiceProcurement/itemData1/")) : null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" ? this.ScmCreateMaterialProcurementRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" ? this.ScmCreateMaterialProcurementRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/MaterialProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" ? this.ScmCreateRfcRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-2" ? this.ScmCreateRfcRequest(this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/Header/"), this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData/")) :
					null;

				//--------------------------Qualification-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2005-1" ? this.ScmCreatespecializedworkqualificationRequest(this.getModel()
						.getProperty(
							"/Quality/SpecalizedWorkQualification/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2005-2" ? this.ScmCreatespecializedworkqualificationRequest(this.getModel()
						.getProperty(
							"/Quality/SpecalizedWorkQualification/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2005-3" ? this.ScmCreatespecializedworkqualificationRequest(this.getModel()
						.getProperty(
							"/Quality/SpecalizedWorkQualification/Header/"), "") :
					null;
				//--------------------------Warehouseand logistics-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" ? this.ScmCreateissueofmaterialRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/IssueofMaterial/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/IssueofMaterial/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" ? this.ScmCreateissueofmaterialRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/IssueofMaterial/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/IssueofMaterial/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" ? this.ScmCreatescrapsaleRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/Scrapsale/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/Scrapsale/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2008-2" ? this.ScmCreatelocaltransportRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/Localtransport/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/Localtransport/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2008-2-A" ? this.ScmCreatelocaltransportstoRequest(this.getModel()
						.getProperty(
							"/WarehouseandLogistics/Localtransportsto/Header/"), this.getModel().getProperty(
							"/WarehouseandLogistics/Localtransportsto/itemData/")) :
					null;
				//-------------------------Classification and Inventory-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-1" ? this.ScmCreatechangeRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/ChangeRequest/Header/"), this.getModel().getProperty(
							"/ClasssificationandInventory/ChangeRequest/itemData/")) :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" ? this.ScmCreateduplicateresolutionRequest(this.getModel()
						.getProperty(
							"/ClasssificationandInventory/DuplicateResolution/Header/"), this.getModel().getProperty(
							"/ClasssificationandInventory/DuplicateResolution/itemData/"), oEve.getSource().getText()) :
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
				//--------------------------Contract Management-----------------------------------------------------	
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1" ? this.ScmContractualChangeOrdersRequest(this.getModel()
						.getProperty(
							"/ContractManagement/ContractualChangeOrders/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-1-A" ? this.ScmContractualChangeOrdersRequest(this.getModel()
						.getProperty(
							"/ContractManagement/ContractualChangeOrders/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2" ? this.ScmIssuingRequest(this.getModel()
						.getProperty(
							"/ContractManagement/IssuingContractualLetters/Header/"), "") :
					null;
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2007-2-A" ? this.ScmIssuingRequest(this.getModel()
						.getProperty(
							"/ContractManagement/ContractClosure/Header/"), "") :
					null;
			},

			ScmCreateServiceProcurementRequest: function (oPayloadHeader, aItem, aitem1) {
				debugger;
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleItemValidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/itemData/")) || !this.handleAttachmentvalidation(
						this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					/*	"Descript": oPayloadHeader.Descript,*/
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"EstPrice": `${oPayloadHeader.TotalPrice}`,
						"TotalValue": `${oPayloadHeader.TotalServiceLevel}`,
						"ServLev": oPayloadHeader.ServiceLevel,
						"TenPre": oPayloadHeader.TenPre,
						"ReqStat": this.getModel().getProperty("/RequeststatF4/") ? this.getModel().getProperty("/RequeststatF4/").split("-")[0] : "",
						/*"Afnam": oPayloadHeader.AFNAM,*/
						"PrJust": oPayloadHeader.PrJust,
						"ContDur": oPayloadHeader.ContDur,
						"ConfProj": this.getModel().getProperty("/ConfidentialF4/") ? this.getModel().getProperty("/ConfidentialF4/").split("-")[0] : "",
						"ProjTyp": this.getModel().getProperty("/ProjecttypeF4/") ? this.getModel().getProperty("/ProjecttypeF4/").split("-")[0] : "",
						"SiteVis": this.getModel().getProperty("/SitevisitF4/") ? this.getModel().getProperty("/SitevisitF4/").split("-")[0] : "",
						"EstTyp": this.getModel().getProperty("/CostestF4/") ? this.getModel().getProperty("/CostestF4/").split("-")[0] : "",
						"SugComp": oPayloadHeader.SugComp,
						"TecEva": oPayloadHeader.TecEva,
						"EconFeas": oPayloadHeader.EconFeas,
						"SecProj": oPayloadHeader.SecProj,
						"ExTc": oPayloadHeader.ExTc,
						"Txz01": aItem[0].Txz01,
						"Matkl": aItem[0].servicegroupF4 ? aItem[0].servicegroupF4.split("-")[0] : "",
						"Ekgrp": aItem[0].PurchasinggroupF4 ? aItem[0].PurchasinggroupF4.split("-")[0] : "",
						"Werks": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Txz01: items.Txz01,
								Meins: items.uomF4 ? items.uomF4.split("-")[0] : "",
								Kostl: items.CostcenterF4 ? items.CostcenterF4.split("-")[0] : "",
								Menge: items.Menge,
								UnitPrice: items.UnitPrice,
								Afnam: items.AFNAM

							};
						}
					)

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateMaterialProcurementRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleItemValidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/itemData/"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					/*"Descript": oPayloadHeader.Descript,*/
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"TotalValue": `${oPayloadHeader.TotalServiceLevel}`,
						"ServLev": oPayloadHeader.ServiceLevel,
						"PrJust": oPayloadHeader.PrJust,
						"TenPre": oPayloadHeader.TenPre,
						"EstPrice": `${oPayloadHeader.EstPrice}`

					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Werks: items.Plant,
								Menge: items.Menge,
								Ekgrp: items.PurchasinggroupF4 ? items.PurchasinggroupF4.split("-")[0] : "",
								UnitPrice: items.UnitPrice,
								Afnam: items.AFNAM

							};
						}
					)

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateRfcRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					/*"Descript": oPayloadHeader.Descript,*/
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

					"ServiceHeadertoItem": []

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatespecializedworkqualificationRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(
						this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"QualTyp": oPayloadHeader.QUAL_TYP,
						"SuppName": oPayloadHeader.SUPP_NAME,
						"VenTyp": this.getModel().getProperty("/ProjectstatusF4/ ") ? this.getModel().getProperty("/ProjectstatusF4/").split("-")[0] : "",
						"SuppCon": oPayloadHeader.SUPP_CON,
						"SuppCr": oPayloadHeader.SUPP_CR,
						"ProjName": oPayloadHeader.PROJ_NAME
					},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateissueofmaterialRequest: function (oPayloadHeader, aItem) {
				debugger;
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleItemValidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/WarehouseandLogistics/IssueofMaterial//itemData/"))) return false;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Rsdat": this.handleOdataDateFormat(oPayloadHeader.Rsdat),
						//"Bwart": oPayloadHeader.BWART,
						"Bwart": this.getModel().getProperty("/MovementtypeF4/") ? this.getModel().getProperty("/MovementtypeF4/").split("-")[0] : "",
						"Kostl": this.getModel().getProperty("/costF4/") ? this.getModel().getProperty("/costF4/").split("-")[0] : "",
						"Wempf": oPayloadHeader.WEMPF,
						"Werks": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
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
					),
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatechangeRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleItemValidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/ClasssificationandInventory/ChangeRequest/Header/itemData/")) || !this.handleAttachmentvalidation(
						this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"MaterialQty": oPayloadHeader.quantity.toString(),
					"ZHeaderExtra": {
						"UsmdCreqType": this.getModel().getProperty("/CrtypeF4/") ? this.getModel().getProperty("/CrtypeF4/").split("-")[0] : "",
						"Mtart": this.getModel().getProperty("/MaterialtypeF4/") ? this.getModel().getProperty("/MaterialtypeF4/").split("-")[0] : "",
						"Meins": this.getModel().getProperty("/uomF4/") ? this.getModel().getProperty("/uomF4/").split("-")[0] : "",
						"Txz01": oPayloadHeader.Txz01,
						"TXT50": oPayloadHeader.TXT50,
						"Mbrsh": this.getModel().getProperty("/IndustrysectorF4/") ? this.getModel().getProperty("/IndustrysectorF4/").split("-")[0] : "",
						"Matkl": this.getModel().getProperty("/servicegroupF4/") ? this.getModel().getProperty("/servicegroupF4/").split("-")[0] : "",
						"Extwg": this.getModel().getProperty("/MaterialgroupF4/") ? this.getModel().getProperty("/MaterialgroupF4/").split("-")[0] : "",
						"Maktx": oPayloadHeader.Maktx,
						"Clint": this.getModel().getProperty("/ClassF4/") ? this.getModel().getProperty("/ClassF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Atinn: items.CharcInternalID,
								Atwrt: items.Atwrt
							};
						}
					),
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreateduplicateresolutionRequest: function (oPayloadHeader, aItem, action) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleItemValidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/ClasssificationandInventory/DuplicateResolution/itemData"), action) || !this.handleAttachmentvalidation(
						this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					/*"Menge": oPayloadHeader.MENGE,*/
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Werks: items.Plant
							};
						}
					),
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatespirRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"SpirNo": oPayloadHeader.SPIR_NO,
						//"Bwart": oPayloadHeader.BWART,
						"Equnr": this.getModel().getProperty("/MovementtypeF4/ ") ? this.getModel().getProperty("/MovementtypeF4/").split("-")[0] : "",
						"EquiTyp": oPayloadHeader.EQUI_TYP,
						"SpirSub": oPayloadHeader.SpirSub
					},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatestoRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				debugger;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"SupplPlant": this.getModel().getProperty("/SuppPlantF4/") ? this.getModel().getProperty("/SuppPlantF4/").split("-")[
							0] : "",
						"Ekgrp": this.getModel().getProperty("/PurchasinggroupF4/") ? this.getModel().getProperty("/PurchasinggroupF4/").split("-")[0] : "",
						"Werks": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Werks: items.Plant,
								Menge: items.Menge,
								Lgort: items.StoragelocationF4 ? items.StoragelocationF4.split("-")[0] : ""
									/*Lglpa: items.Lgpla,*/
									/*Sgtxt: items.Sgtxt,*/

							};
						}
					),
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmContractualChangeOrdersRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"ReqParty": oPayloadHeader.ReqParty,
						"EstPrice": this.getModel().getProperty("/ContractvalueF4/") ? this.getModel().getProperty("/ContractvalueF4/").split("-")[0] : "",
						"Ebeln": this.getModel().getProperty("/PonoF4/") ? this.getModel().getProperty("/PonoF4/").split("-")[0] : "",
						"TotalValue": `${oPayloadHeader.TotalValue}`,
						"Zzvendor": this.getModel().getProperty("/SupplierF4/") ? this.getModel().getProperty("/SupplierF4/").split("-")[0] : "",
					},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmIssuingRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"ReqParty": oPayloadHeader.ReqParty,
						"EstPrice": oPayloadHeader.EstPrice,
						"Ebeln": this.getModel().getProperty("/PonoF4/") ? this.getModel().getProperty("/PonoF4/").split("-")[0] : "",
						"Zzvendor": this.getModel().getProperty("/SupplierF4/") ? this.getModel().getProperty("/SupplierF4/").split("-")[0] : "",
					},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatelocaltransportRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Werks": oPayloadHeader.Werks,
						"Kostl": oPayloadHeader.Kostl,
						"ServLev": oPayloadHeader.ServLev,
						"Trtyp": this.getModel().getProperty("/PonoF4/") ? this.getModel().getProperty("/PonoF4/").split("-")[0] : "",
						"Vehtyp": `${oPayloadHeader.TotalValue}`,
						"Extloc": this.getModel().getProperty("/SupplierF4/") ? this.getModel().getProperty("/SupplierF4/").split("-")[0] : "",
						"Zzvendor": oPayloadHeader.ServLev,
						"Reqparty": this.getModel().getProperty("/PonoF4/") ? this.getModel().getProperty("/PonoF4/").split("-")[0] : "",
						"Wempf": `${oPayloadHeader.TotalValue}`,
						"Mobile": this.getModel().getProperty("/SupplierF4/") ? this.getModel().getProperty("/SupplierF4/").split("-")[0] : "",
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Txz01: items.Plant,
								Menge: items.Menge,
								Matlen: items.StoragelocationF4 ? items.StoragelocationF4.split("-")[0] : "",
								Matbrd: items.Matbrd,
								Mathgt: items.Mathgt,
								Matwgt: items.Matwgt

							};
						}
					),
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatelocaltransportstoRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Werks": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
						"ServLev": oPayloadHeader.ServiceLevel,
						"Ebeln": oPayloadHeader.Ebeln
					},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.SCMCreateaRequestAPI(oPayload);
			},
			ScmCreatescrapsaleRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/SCMAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/SCMAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/SCMAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Werks": oPayloadHeader.Werks,
						"TotalValue": oPayloadHeader.TotalValue
					},

					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.ProductF4 ? items.ProductF4.split("-")[0] : "",
								Menge: items.Menge
							};
						}
					),
					"Attachments": aUploadData

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
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
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

				var sTable = oEvent.getSource().getId().split("-")[2] ? oEvent.getSource().getId().split("-")[2] : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" || this.getModel().getProperty("/SCMAppVisible/") ===
					"SSA-PSCM-2004-2" ? this.updateItemAddModel(this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData"), {
						Matnr: "",
						Menge: ""
					}, "/ProcurementAdhoc/PrepareofDirectpurchase/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" && this.handleItemValidation(this.getModel().getProperty(
					"/SCMAppVisible/"), this.getModel().getProperty(
					"/ClasssificationandInventory/DuplicateResolution/itemData/"), oEvent.getSource().getText()) ? this.updateItemAddModel(this.getModel()
					.getProperty(
						"/ClasssificationandInventory/DuplicateResolution/itemData"), {
						ProductF4: "",
						Description: "",
						Plant: ""
					}, "/ClasssificationandInventory/DuplicateResolution/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ClasssificationandInventory/STO/itemData"), {
					ProductF4: "",
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ClasssificationandInventory/STO/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" || this.getModel().getProperty("/SCMAppVisible/") ===
					"SSA-PSCM-2010-3" ? this.updateItemAddModel(this.getModel().getProperty(
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
				/*	this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemAddModel(this.getModel().getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData"), {
						Matnr: "",
						Wercks: "",
						Lgort: ""
					}, "/ClasssificationandInventory/STO/itemData") : "";*/
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ProcurementAdhoc/MaterialProcurement/itemData"), {
					Matnr: "",
					Wercks: "",
					Menge: "",
					Ekgrp: "",
					UnitPrice: "",
					Afnam: ""
				}, "/ProcurementAdhoc/MaterialProcurement/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ProcurementAdhoc/MaterialProcurement/itemData"), {
					Matnr: "",
					Wercks: "",
					Menge: "",
					Ekgrp: "",
					UnitPrice: "",
					Afnam: ""
				}, "/ProcurementAdhoc/MaterialProcurement/itemData") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" || this.getModel().getProperty("/SCMAppVisible/") ===
					"SSA-PSCM-2002-2" ? this.updateItemAddModel(
						this.getModel().getProperty(
							"/ProcurementAdhoc/ServiceProcurement/itemData1"), {
							TXZ01: "",
							Menge: "",
							UnitPrice: ""
						}, "/ProcurementAdhoc/ServiceProcurement/itemData1") : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" ? this.updateItemAddModel(this.getModel().getProperty(
					"/WarehouseandLogistics/Scrapsale/itemData"), {
					Matnr: "",
					Wercks: "",
					Menge: ""
				}, "/WarehouseandLogistics/Scrapsale/itemData") : "";

			},

			updateItemAddModel: function (oModel, obj, path) {

				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push(obj);
				this.getModel().setProperty(`${path}`, oItems);
			},
			onDeleteItemPress: function (oEvent) {
				var iRowNumberToDelete = this.extractIndexFromPath(oEvent.getSource().getBindingContext().getPath());
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2004-1" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/PrepareofDirectpurchase/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-2-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ClasssificationandInventory/STO/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/WarehouseandLogistics/IssueofMaterial/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/WarehouseandLogistics/IssueofMaterial/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/MaterialProcurement/itemData")) : "";

				// 	&& this.itemCalculationCheck(oEvent, iRowNumberToDelete, this.getModel()
				// .getProperty(
				// 	"/ProcurementAdhoc/MaterialProcurement/itemData"))
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2001-1" ? this.updateItemDeleteModel(
					iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/MaterialProcurement/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2011-A" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ClasssificationandInventory/DuplicateResolution/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/ServiceProcurement/itemData")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-1" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/ServiceProcurement/itemData1")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2002-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ProcurementAdhoc/ServiceProcurement/itemData1")) : "";
				this.getModel().getProperty("/SCMAppVisible/") === "SSA-PSCM-2010-3-A" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/WarehouseandLogistics/Scrapsale/itemData")) : "";
			},
			updateItemDeleteModel: function (index, oModel) {
				oModel.splice(index, 1);
				this.getModel().refresh();
			},

			handleItemValidation: function (service, aData, action) {
				debugger;
				var isValid = true;

				if (service === "SSA-PSCM-2011-A") {
					var itemCheck = !aData || aData.length < 2 ? false : true;
					// Check for duplicates based on the 'Plant' property
					var bCheckDuplicate = aData.some((element, index) => {
						return aData.findIndex(obj => obj.ProductF4 === element.ProductF4) !== index;
					});
					if (action === 'Submit' && (!itemCheck || bCheckDuplicate)) {
						if (!itemCheck) {
							MessageToast.show("Please add at least 2 Item entries");
						} else {
							MessageToast.show("Please ensure there are no duplicate materials");
						}
						isValid = false;
						return isValid;
					} else if (action === 'Add' && aData.length > 0) {

						var bCheckMaterialSelected = aData.some(item => !item.ProductF4);

						if (bCheckMaterialSelected) {
							MessageToast.show("Please ensure Material items is selected");
							isValid = false;
						} else if (bCheckDuplicate) {
							MessageToast.show("Please ensure there are no duplicate materials");
							isValid = false;
						}

					}

				}

				return isValid;
			},

			handleLiveChangeContractPrcUnitPrice: function (oEvent) {
				debugger;
				var service = this.getModel().getProperty("/SCMAppVisible/");
				if (service === "SSA-PSCM-2007-1") {
					var sUnit = oEvent.getSource().getValue() === "" ? "" : parseInt(oEvent.getSource().getValue());
					var sTotal = parseInt(5000) + (0.01 * sUnit);
					this.getModel().setProperty(`/ContractManagement/ContractualChangeOrders/Header/TotalValue/`, sTotal);
					/*	this.getModel().setProperty("/ContractManagement/ContractualChangeOrders/Header/", true);*/
				} else if (service === "SSA-PSCM-2007-1-A") {
					var sUnit = oEvent.getSource().getValue() === "" ? "" : parseInt(oEvent.getSource().getValue());
					var sTotal = parseInt(10000) + (0.01 * sUnit);
					this.getModel().setProperty(`/ContractManagement/ContractualChangeOrders/Header/TotalValue/`, sTotal);
					/*	this.getModel().setProperty("/ContractManagement/ContractualChangeOrders/Header/", true);*/
				} else if (service === "SSA-PSCM-2004-2") {
					var sUnit = oEvent.getSource().getValue() === "" ? "" : parseInt(oEvent.getSource().getValue());
					var sTotal = parseInt(3000) + (0.01 * sUnit);
					this.getModel().setProperty(`/ProcurementAdhoc/PrepareofDirectpurchase/Header/TotalValue/`, sTotal);
					/*	this.getModel().setProperty("/ContractManagement/ContractualChangeOrders/Header/", true);*/
				}

			},

			itemCalculationCheck: function (oEVe, iRowNumber, aItemData) {
				var s = "";

				var sTotal = sUnit * sQty;
				this.getModel().setProperty(`${sBindingPath}/EstPrice/`, sTotal);

				const totalSum = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/itemData").reduce((acc, currentItem) => acc +
					parseInt(currentItem.EstPrice), 0);
				this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/totalSum/", totalSum);

				if (service === "SSA-PSCM-2001-1") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/ServiceLevel/");
					var iTotal;
					iTotal = serviceLevel === "N" ? 2150 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 3750 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 7000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2002-1") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/Header/ServiceLevel/");
					var iTotal;
					iTotal = serviceLevel === "N" ? 2150 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 3750 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 7000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalServiceLevel/", iTotal);

				}

				var iEstimated = (totalSum) + 0.15 * totalSum;

				this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/EstPrice/", iEstimated);
			},
			handleLiveChangeUnit: function (oEvent) {
				debugger;
				var sBindingPath = oEvent.getSource().getBindingContext().getPath();
				var iItemIndex = this.extractIndexFromPath(oEvent.getSource().getBindingContext().getPath());
				var sUnit = oEvent.getSource().getValue() === "" ? "" : parseInt(oEvent.getSource().getValue());
				var service = this.getModel().getProperty("/SCMAppVisible/");
				var sQty = parseInt(oEvent.getSource().getBindingContext().getObject().Menge);

				var sTotal = sUnit * sQty;
				this.getModel().setProperty(`${sBindingPath}/EstPrice/`, sTotal);

				const totalSum = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/itemData").reduce((acc, currentItem) => acc +
					parseInt(currentItem.EstPrice), 0);
				this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/totalSum/", totalSum);

				const totalSum1 = this.getModel().getProperty("/WarehouseandLogistics/IssueofMaterial/itemData").reduce((acc, currentItem) => acc +
					parseInt(currentItem.EstPrice), 0);
				this.getModel().setProperty("/WarehouseandLogistics/IssueofMaterial/Header/totalSum/", totalSum1);

				if (service === "SSA-PSCM-2001-1") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/ServiceLevel/");
					var iTotal;
					iTotal = serviceLevel === "N" ? 2150 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 3750 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 7000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2001-2") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/ServiceLevel/");
					var iTotal;
					iTotal = serviceLevel === "N" ? 5000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 7000 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 10000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2010-2") {
					//var serviceLevel = this.getModel().getProperty("{/WarehouseandLogistics/IssueofMaterial/Header/ServiceLevel/");
					var iTotal;
					iTotal = (0.04 * totalSum1) + totalSum1;
					this.getModel().setProperty("/WarehouseandLogistics/IssueofMaterial/Header/TotalServiceLevel/", iTotal);

				}

				var iEstimated = (totalSum) + 0.15 * totalSum;

				this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/EstPrice/", iEstimated);

			},

			onChangeServiceLevel: function (oEve) {
				debugger;
				var serviceLevel = oEve.getSource().getSelectedKey();
				var service = this.getModel().getProperty("/SCMAppVisible/");
				if (service === "SSA-PSCM-2001-1") {
					var totalSum = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/totalSum/");
					if (!totalSum) return;
					var iTotal;
					iTotal = serviceLevel === "N" ? 2150 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 3750 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "E" ? 7000 + (0.04 * totalSum) : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2001-2") {
					var totalSum = this.getModel().getProperty("/ProcurementAdhoc/MaterialProcurement/Header/totalSum/");
					if (!totalSum) return;
					var iTotal;
					iTotal = serviceLevel === "N" ? 2150 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 3750 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "E" ? 7000 + (0.04 * totalSum) : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/MaterialProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2002-1") {
					var totalSum = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalPrice/");
					if (!totalSum) return;
					var iTotal;
					iTotal = serviceLevel === "N" ? 4000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 7000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "E" ? 10000 + (0.04 * totalSum) : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2002-2") {
					var totalSum = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalPrice/");
					if (!totalSum) return;
					var iTotal;
					iTotal = serviceLevel === "N" ? 7000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 10000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "E" ? 12000 + (0.04 * totalSum) : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalServiceLevel/", iTotal);

				}

			},

			handleLiveChangeServcePrcUnitPrice: function (oEvent) {
				debugger;
				var sBindingPath = oEvent.getSource().getBindingContext().getPath();
				var iItemIndex = this.extractIndexFromPath(oEvent.getSource().getBindingContext().getPath());
				var sUnit = oEvent.getSource().getValue() === "" ? "" : parseInt(oEvent.getSource().getValue());
				var sQty = parseInt(oEvent.getSource().getBindingContext().getObject().Menge);

				var sTotal = sUnit * sQty;

				this.getModel().setProperty(`${sBindingPath}/TotalPrice/`, sTotal);

				const totalSum = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/itemData1").reduce((acc, currentItem) => acc +
					parseInt(currentItem.TotalPrice), 0);
				this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalPrice/", totalSum);
				var iEstimated = (totalSum) + 0.15 * totalSum;

				this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/EstPrice/", iEstimated);
				var serviceLevel = oEvent.getSource().getSelectedKey();
				var service = this.getModel().getProperty("/SCMAppVisible/");
				if (service === "SSA-PSCM-2002-1") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/Header/ServiceLevel/");
					var iTotal = iEstimated;
					iTotal = serviceLevel === "N" ? 4000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 7000 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 10000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalServiceLevel/", iTotal);

				} else if (service === "SSA-PSCM-2002-2") {
					var serviceLevel = this.getModel().getProperty("/ProcurementAdhoc/ServiceProcurement/Header/ServiceLevel/");
					var iTotal = iEstimated;
					iTotal = serviceLevel === "N" ? 7000 + (0.04 * totalSum) : iTotal;
					iTotal = serviceLevel === "U" ? 10000 + 0.04 * totalSum : iTotal;
					iTotal = serviceLevel === "E" ? 12000 + 0.04 * totalSum : iTotal;

					this.getModel().setProperty("/ProcurementAdhoc/ServiceProcurement/Header/TotalServiceLevel/", iTotal);

				}

			},
			handleHeaderValidation: function (service) {
				var isValid = true;
				var validationProperties;

				if (service === "SSA-PSCM-2001-1" || service === "SSA-PSCM-2001-2") {
					validationProperties = [{
						path: "/ProcurementAdhoc/MaterialProcurement/Header/ServiceLevel/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2012-1") {

					validationProperties = [{
						path: "/ClasssificationandInventory/SPIR/Header/Spirno/",
						condition: true
					}, {
						path: "/ClasssificationandInventory/SPIR/Header/Descript/",
						condition: true
					}, {
						path: "/ClasssificationandInventory/SPIR/Header/EQUI_TYP/",
						condition: true
					}, {
						path: "/ClasssificationandInventory/SPIR/Header/SpirSub/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2007-1" || service === "SSA-PSCM-2007-1-A") {

					validationProperties = [{
						path: "/SupplierF4/",
						condition: true
					}, {
						path: "/PrnoF4/",
						condition: true
					}, {
						path: "/PonoF4/",
						condition: true
					}, {
						path: "/ContractManagement/ContractualChangeOrders/Header/EstPrice/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2007-2" || service === "SSA-PSCM-2007-2-A") {

					validationProperties = [{
						path: "/SupplierF4/",
						condition: true
					}, {
						path: "/PrnoF4/",
						condition: true
					}, {
						path: "/PonoF4/",
						condition: true
					}, {
						path: "/ContractManagement/IssuingContractualLetters/Header/EstPrice/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2011-1") {

					validationProperties = [{
							path: "/CrtypeF4/",
							condition: true
						}, {
							path: "/MaterialtypeF4/",
							condition: true
						}, {
							path: "/ClasssificationandInventory/ChangeRequest/Maktx/",
							condition: true
						}, {
							path: "/MaterialgroupF4/",
							condition: true
						}, {
							path: "/IndustrysectorF4/",
							condition: true
						}, {
							path: "/ClasssificationandInventory/ChangeRequest/Header/Txz01/",
							condition: true
						}, {
							path: "/uomF4/",
							condition: true
						}, {
							path: "/servicegroupF4/",
							condition: true
						}, {
							path: "/ClassF4/",
							condition: true
						}

					];

				} else if (service === "SSA-PSCM-2011-2-2") {

					validationProperties = [{
						path: "/SuppPlantF4/",
						condition: true
					}, {
						path: "/PurchasinggroupF4/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2002-1") {
					validationProperties = [{
							path: "/ProcurementAdhoc/ServiceProcurement/Header/TenPre/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/ContDur/",
							condition: true
						}, {
							path: "/ProjecttypeF4/",
							condition: true
						}, {
							path: "/CostestF4/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/TecEva/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/SugComp/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/ServiceLevel/",
							condition: true
						}, {
							path: "/RequeststatF4/",
							condition: true
						}, {
							path: "/ConfidentialF4/",
							condition: true
						}, {
							path: "/SitevisitF4/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/EconFeas/",
							condition: true
						}, {
							path: "/ProcurementAdhoc/ServiceProcurement/Header/SecProj/",
							condition: true
						}

					];

				} else if (service === "SSA-PSCM-2010-2" || service === "SSA-PSCM-2010-3") {

					validationProperties = [{
						path: "/WarehouseandLogistics/IssueofMaterial/Header/Rsdat/",
						condition: true
					}, {
						path: "/MovementtypeF4/",
						condition: true
					}, {
						path: "/costF4/",
						condition: true
					}];

				} else if (service === "SSA-PSCM-2005-1" || service === "SSA-PSCM-2005-2" || service === "SSA-PSCM-2005-3") {

					validationProperties = [{
							path: "/Quality/SpecalizedWorkQualification/Header/PROJ_NAME/",
							condition: true
						}, {
							path: "/ProjectstatusF4/",
							condition: true
						}, {
							path: "/Quality/SpecalizedWorkQualification/Header/SUPP_CON/",
							condition: true
						}, {
							path: "/Quality/SpecalizedWorkQualification/Header/SUPP_NAME/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3004-1") {

					validationProperties = [{
							path: "/FinancialReviewGeneralClose/IssueGovernment/Header/Descript/",
							condition: true
						}, {
							path: "/FmareaF4/",
							condition: true
						}, {
							path: "/FinancialReviewGeneralClose/IssueGovernment/Header/FiscalYear",
							condition: true
						}, {
							path: "/FinancialReviewGeneralClose/IssueGovernment/Header/Poper",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-1") {

					validationProperties = [{
							path: "/AssetLifecycle/DepreciationProcess/Header/Descript/",
							condition: true
						}, {
							path: "/AssetLifecycle/DepreciationProcess/Header/Poper/",
							condition: true
						}, {
							path: "/CompanycodeF4/",
							condition: true
						}, {
							path: "/AssetLifecycle/DepreciationProcess/Header/FiscalYear/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-2") {

					validationProperties = [{
							path: "/AssetLifecycle/PerfomAsset/Header/Descript/",
							condition: true
						}, {
							path: "/AssetLifecycle/PerfomAsset/Header/Brdatu/",
							condition: true
						}, {
							path: "/CompanycodeF4/",
							condition: true
						}, {
							path: "/DepreciationF4/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-3A") {

					validationProperties = [{
							path: "/costF4/",
							condition: true
						}, {
							path: "/AssestclassF4/",
							condition: true
						}, {
							path: "/CompanycodeF4/",
							condition: true
						},

						{
							path: "/AssetLifecycle/RecordAsset/Header/Descript/",
							condition: true
						}, {
							path: "/AssetLifecycle/RecordAsset/Header/Txt50/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-3B") {

					validationProperties = [{
							path: "/CompanycodeF4/",
							condition: true
						},

						{
							path: "/AssetLifecycle/SaleofAssets/Header/Descript/",
							condition: true
						}, {
							path: "/AssestF4/",
							condition: true
						},

						{
							path: "/AssetLifecycle/SaleofAssets/Header/Budat/",
							condition: true
						},

						{
							path: "/DepreciationF4/",
							condition: true
						}, {
							path: "/AssetLifecycle/SaleofAssets/Header/Bzdat/",
							condition: true
						},

						{
							path: "/AssetLifecycle/SaleofAssets/Header/Erlbt/",
							condition: true
						}
					];

				} else if (service === "SSA-FIN-3005-3C") {

					validationProperties = [{
							path: "/AssetLifecycle/RetirementofAssets/Header/Descript/",
							condition: true
						}, {
							path: "/CompanycodeF4/",
							condition: true
						},

						{
							path: "/AssetLifecycle/RetirementofAssets/Header/Budat/",
							condition: true
						},

						{
							path: "/AssetLifecycle/RetirementofAssets/Header/Bzdat/",
							condition: true
						},

						{
							path: "/AssetLifecycle/RetirementofAssets/Header/Anbtr/",
							condition: true
						}, {
							path: "/AccountingprincipalF4/",
							condition: true
						}, {
							path: "/AssestF4/",
							condition: true
						},

						{
							path: "/DepreciationF4/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-4") {

					validationProperties = [{
							path: "/CompanycodeF4/",
							condition: true
						},

						{
							path: "/AssestF4/",
							condition: true
						},

						{
							path: "/costF4/",
							condition: true
						}, {
							path: "/AssetLifecycle/TransferofAssets/Header/Descript/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3005-5") {

					validationProperties = [{
							path: "/AssetLifecycle/ProjectCaptilization/Header/Descript/",
							condition: true
						}, {
							path: "/AssetLifecycle/ProjectCaptilization/Header/FiscalYear/",
							condition: true
						}, {
							path: "/AssetLifecycle/ProjectCaptilization/Header/Poper/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3007-3") {

					validationProperties = [{
							path: "/InsuranceF4/",
							condition: true
						}

					];

				} else if (service === "SSA-FIN-3006-1") {
					validationProperties = [{
							path: "/VendorF4/",
							condition: true
						}, {
							path: "/POF4/",
							condition: true
						}, {
							path: "/InsuranceandClaim/CreateInsurance/Header/Descript/",
							condition: true
						}, {
							path: "/InsuranceandClaim/CreateInsurance/Header/Zzdeprate/",
							condition: true
						},

						{
							path: "/PolicyTypeF4/",
							condition: true
						},

						{
							path: "/InsuranceandClaim/CreateInsurance/Header/Zzinsurper/",
							condition: true
						}

					];
				} else if (service === "SSA-FIN-3007-1") {
					validationProperties = [{
							path: "/InsuranceF4/",
							condition: true
						}

					];
				} else if (service === "SSA-FIN-3007-2") {
					validationProperties = [{
							path: "/InsuranceF4/",
							condition: true
						}

					];
				} else if (service === "SSA-FIN-3007-4") {
					validationProperties = [{
							path: "/InsuranceF4/",
							condition: true
						}

					];
				}
				if (!validationProperties) return true;

				validationProperties.forEach(property => {
					var propertyValue = this.getModel().getProperty(property.path);

					if (!propertyValue || (property.condition && !property.condition)) {
						this.getModel().setProperty(property.path, "");
						this.getModel().setProperty("/ValidationFlag/", true);
						isValid = false;

					}
				});

				if (!isValid) {
					MessageToast.show("Please Enter all Mandatory Fields");
				}

				return isValid;
			},

			handleAttachmentvalidation: function (service, oItems, aData) {
				var isValid = true;
				if (service === "SSA-PSCM-2012-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2011-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2011-A") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2011-2-2") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2002-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2005-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-PSCM-2001-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				}
				return isValid;
			},

			/* File uplaod 	*/
			onFileAdded: function (oEvent) {

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

			},

			_addData: function (Filecontent, Filename, Filetype, Filesize) {

				var oModel = this.getModel().getProperty("/UploadedData");

				if (oModel.length >= 5) {
					MessageToast.show("Upto 5 Documents are allowed to upload");
					return false;
				}
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					Filename: Filename,
					Mimetype: Filetype,
					Value: Filecontent,
					Filesize: Filesize

				});
				this.getModel().setProperty("/UploadedData", oItems);

			},

			onDeleteAttachment: function (oEvent) {
				var iRowNumberToDelete = parseInt(oEvent.getSource().getBindingContext().getPath().split("/")[3]);
				var aTableData = this.getModel().getProperty("/UploadedData");
				aTableData.splice(iRowNumberToDelete, 1);
				this.getModel().refresh();
				//currentElement.removeStyleClass("remove-table");

			},
			handleMissmatch: function () {
				this.handleFileMissmatch();
			},
			onFileSizeExceed: function () {

				this.handleFileSizeExceedScm();
			},
			onCancel: function () {
				this.navigationBack();
			}
		})
	})