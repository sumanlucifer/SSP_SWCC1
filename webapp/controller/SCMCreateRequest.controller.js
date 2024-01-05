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
						/*	this.CallValueHelpSCMSRVAPI("?$filter=p_domain eq 'ZREQ_STAT'")
					.then(function (oResponse) {
						// Handle the response data
						this.getModel().setProperty("/busy", false);
						pssModel.setProperty("/projectType", oResponse.results);
						this.getView().setModel(pssModel, "pssModel");
					}.bind(this))
					.catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));
*/
						onMatValueHelpRequest: function (oEvent) {
								var sInputValue = oEvent.getSource().getValue(),
									oView = this.getView();

								if (!this._matValueHelpDialog) {
									this._matValueHelpDialog = Fragment.load({
										id: oView.getId(),
										name: "com.swcc.Template.fragments.SCMModule.MaterialF4",
										controller: this
									}).then(function (oDialog) {
										oView.addDependent(oDialog);
										return oDialog;
									});
								}
								this._matValueHelpDialog.then(function (oDialog) {
									// Create a filter for the binding
									oDialog.getBinding("items").filter([new Filter("Product", FilterOperator.Contains, sInputValue)]);
									// Open ValueHelpDialog filtered by the input's value
									oDialog.open(sInputValue);
								});
							},

							onValueHelpRequest: function (oEvent) {
								var sInputValue = oEvent.getSource().getValue(),
									oView = this.getView();

								if (!this._pValueHelpDialog) {
									this._pValueHelpDialog = Fragment.load({
										id: oView.getId(),
										name: "com.swcc.Template.fragments.SCMModule.EquipmentF4",
										controller: this
									}).then(function (oDialog) {
										oView.addDependent(oDialog);
										return oDialog;
									});
								}
								this._pValueHelpDialog.then(function (oDialog) {
									// Create a filter for the binding
									oDialog.getBinding("items").filter([new Filter("Workcenter", FilterOperator.Contains, sInputValue)]);
									// Open ValueHelpDialog filtered by the input's value
									oDialog.open(sInputValue);
								});
							},
							/*	handleLiveChange: function () {
									// Perform multiplication and update the result input field
									var oQtyInput = this.getView().byId("inputQty");
									var oUnitPriceInput = this.getView().byId("inputUnitPrice");
									var oResultInput = this.getView().byId("inputResult");

									var nQty = parseFloat(oQtyInput.getValue()) || 0;
									var nUnitPrice = parseFloat(oUnitPriceInput.getValue()) || 0;
									var nResult = nQty * nUnitPrice;

									oResultInput.setValue(nResult.toString());
								},*/

							onValueHelpSearch: function (oEvent) {
								var sValue = oEvent.getParameter("value");
								var oFilter = new Filter("WorkcenterDesc", FilterOperator.Contains, sValue);

								oEvent.getSource().getBinding("items").filter([oFilter]);
							},

							onValueHelpClose: function (oEvent) {
								var oSelectedItem = oEvent.getParameter("selectedItem");
								oEvent.getSource().getBinding("items").filter([]);

								if (!oSelectedItem) {
									return;
								}

								this.byId("productInput").setValue(oSelectedItem.getDescription());
							},

							onMaterialValueHelpSearch: function (oEvent) {
								var sValue = oEvent.getParameter("value");
								var oFilter = new Filter("Description", FilterOperator.Contains, sValue);

								oEvent.getSource().getBinding("items").filter([oFilter]);
							},

							/*	onMaterialValueHelpClose: function (oEvent) {
									var oSelectedItem = oEvent.getParameter("selectedItem");
									oEvent.getSource().getBinding("items").filter([]);

									if (!oSelectedItem) {
										return;
									}

									var selIndex = parseInt(oEvent.getParameter("selectedItem").getBindingContext("materialf4Model").sPath.split("/")[1]);
									var getSelRecordData = this.getView().getModel("materialf4Model").getData()[selIndex];

									this.getView().byId("materialF4Input").setValue(getSelRecordData.Product);
									this.getView().byId("description").setValue(getSelRecordData.Description);
									this.getView().byId("materialUom").setValue(getSelRecordData.BaseUnit);
									this.getView().byId("materialPlant").setValue(getSelRecordData.Plant);
									this.getView().byId("materialPurchasingGrp").setValue(getSelRecordData.PurchasingGroup);

									this.getView().byId("materialFormPlant").setSelectedKey(getSelRecordData.Plant);
									this.getView().byId("materialFormPlant1").setSelectedKey(getSelRecordData.Plant);
									this.getView().byId("crtype1").setSelectedKey(getSelRecordData.CRTypeSet);

								},*/

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
									// CR type	
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/CRTypeSet/', null,
										null),
									//Material Type	
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/MaterialTypeSet/', null,
										null), IndustrySectorSet
									//Industrial sector
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/IndustrySectorSet/', null,
										null),
									//external product sector
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_ExtProdGrp/', null,
										null),
									//Goods Movement
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ZCDSV_GoodsMovementType/', null,
										null),
									//Cost center
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/I_CostCenterVH/', null,
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
									//PurchasingGroupSet
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/PurchasingGroupSet/', null,
										null),
									//Service code
									this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ServiceNoSet/', null,
										null)

								]).then(this.buildResponselist.bind(this)).catch(function (error) {}.bind(this));

							},
							buildResponselist: function (values) {
								// debugger;
								this.getModel().setProperty("/busy", false);
								//     Plant F4 Valuehelp
								var aPlantF4Data = values[0].value.results;
								this.getModel().setProperty("/PlantF4/", aPlantF4Data);
								//     Material F4 Valuehelp
								var aMaterialF4Data = values[1].value.results;
								this.getModel().setProperty("/Materialf4/", aMaterialF4Data);
								//     CR type F4 Valuehelp
								var acrF4Data = values[2].value.results;
								this.getModel().setProperty("/CRf4/", acrF4Data);
								//     Material type type F4 Valuehelp
								var aMaterialTypeF4Data = values[3].value.results;
								this.getModel().setProperty("/MaterialTypef4/", aMaterialTypeF4Data);
								//   Industrial Sector type F4 Valuehelp
								var aIndustrialSectorF4Data = values[4].value.results;
								this.getModel().setProperty("/IndustrialSectorf4/", aIndustrialSectorF4Data);
								//     Ex Material F4 Valuehelp
								var aExMaterialF4Data = values[5].value.results;
								this.getModel().setProperty("/ExMaterialf4/", aExMaterialF4Data);
								// goods movement type
								var aGoodsMovementF4Data = values[6].value.results;
								this.getModel().setProperty("/GoodsMovement/", aGoodsMovementF4Data);
								// cost center
								var aCostCenterF4Data = values[7].value.results;
								this.getModel().setProperty("/CostCenter/", aCostCenterF4Data);
								// UOM
								var aUomF4Data = values[8].value.results;
								this.getModel().setProperty("/UOM/", aUomF4Data);
								// Product type
								var aProductTypeF4Data = values[9].value.results;
								this.getModel().setProperty("/ProductType/", aProductTypeF4Data);
								// Service Group 
								var aServiceGroupF4Data = values[10].value.results;
								this.getModel().setProperty("/ServiceGroup/", aServiceGroupF4Data);
								// purchasing Group 
								var aPurchasingGroupF4Data = values[11].value.results;
								this.getModel().setProperty("/PurchasingGroup/", aPurchasingGroupF4Data);
								// Service code 
								var aServiceCodeF4Data = values[12].value.results;
								this.getModel().setProperty("/ServiceCode/", aServiceCodeF4Data);

							},

							SCMCreateaRequestAPI: function (oPayload) {
								debugger;
								var oPayload = this.getModel().getProperty("/MaterialProcurement/itemData/");
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
										this.getModel().setProperty("/MaterialProcurement/Header", oResponse.results);
										this.getModel().setProperty("/busy", false);
									}.bind(this)).catch(function (error) {
										MessageBox.error(error.responseText);
										this.getModel().setProperty("/busy", false);
									}.bind(this));

							},
							onSaveRequest: function () {
								var oPayload = this.getModel().getProperty("/MaterialProcurement/Header/");
								this.SCMCreateaRequestAPI(oPayload);

							},

							/*onback: function () {
								this.getOwnerComponent().getTargets().display("LandingView");

							},*/
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
							/*,

										onSearch: function () {

											this.oRouter.navTo("LandingView");

										}*/
					})
			})