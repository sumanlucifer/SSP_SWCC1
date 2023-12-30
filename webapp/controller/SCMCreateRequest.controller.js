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
				/*	var oView = this.getView();
					var oQtyInput = oView.byId("inputQty");
					var oUnitPriceInput = oView.byId("inputUnitPrice");
					oQtyInput.attachLiveChange(this.handleLiveChange.bind(this));
					oUnitPriceInput.attachLiveChange(this.handleLiveChange.bind(this));

					oQtyInput.attachValueHelpRequest(this.handleValueHelpRequest.bind(this));
					oUnitPriceInput.attachValueHelpRequest(this.handleValueHelpRequest.bind(this));*/

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
				// this.getModel().setProperty("/PMCreateRequest/Plant", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.getModel().setProperty("/SCMAppVisible/", sServiceProduct);
				this.callDropDownService();

				this.getModel().setProperty("/busy", true);
				var plantModel = this.getOwnerComponent().getModel("plantModel");
				this.CallValueHelpAPI('/A_Plant/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/PMCreateRequest/PlantF4/", oResponse.results);
						plantModel.setData(oResponse.results);
						this.getView().setModel(plantModel, "plantModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				var workCenterModel = this.getOwnerComponent().getModel("workCenterModel");
				this.CallValueHelpAPI('/ZCDSV_WORKCENTERVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/PMCreateRequest/WorkCenterF4/", oResponse.results);
						workCenterModel.setData(oResponse.results);
						this.getView().setModel(workCenterModel, "workCenterModel");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				var materialf4Model = this.getOwnerComponent().getModel("materialf4Model");
				this.CallValueHelpSCMSRVAPI('/ZCDSV_SCM_PRODUCTVH/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/PMCreateRequest/MaterialF4/", oResponse.results);
						materialf4Model.setData(oResponse.results);
						this.getView().setModel(materialf4Model, "materialf4Model");
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				var crModel = this.getOwnerComponent().getModel("crModel");
				// debugger;
				this.CallValueHelpSCMSRVAPI('/CRTypeSet/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						// crModel.setData(oResponse.results);
						crModel.setProperty("/crType", oResponse.results);
						this.getView().setModel(crModel, "crModel");
					}.bind(this))
					.catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpSCMSRVAPI('/MaterialTypeSet/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						crModel.setProperty("/materialType", oResponse.results);
						this.getView().setModel(crModel, "crModel");
					}.bind(this))
					.catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpSCMSRVAPI('/IndustrySectorSet/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						crModel.setProperty("/industrySector", oResponse.results);
						this.getView().setModel(crModel, "crModel");
					}.bind(this))
					.catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				this.CallValueHelpSCMSRVAPI('/I_ExtProdGrp/')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						crModel.setProperty("/externalMaterialGroup", oResponse.results);
						this.getView().setModel(crModel, "crModel");
					}.bind(this))
					.catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

				/*	var Productf4 = this.getOwnerComponent().getModel("Productf4");
					var f4HelpModel = new sap.ui.model.json.JSONModel();
					this.CallValueHelpAPI('ZCDSV_SCM_PRODUCTVH')
						.then(function (oResponse) {
							
							this.getModel().setProperty("/busy", false);
							this.getModel().setProperty("/PMCreateRequest/Productf4/", oResponse.results);
							f4HelpModel.setData(oResponse.results);
							this.getView().setModel(Productf4, "Productf4"); // Use f4HelpModel instead of Productf4
						}.bind(this))
						.catch(function (error) {
							this.getModel().setProperty("/busy", false);
							MessageBox.error(error.responseText);
						}.bind(this));*/

			},

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
			handleLiveChange: function () {
				// Perform multiplication and update the result input field
				var oQtyInput = this.getView().byId("inputQty");
				var oUnitPriceInput = this.getView().byId("inputUnitPrice");
				var oResultInput = this.getView().byId("inputResult");

				var nQty = parseFloat(oQtyInput.getValue()) || 0;
				var nUnitPrice = parseFloat(oUnitPriceInput.getValue()) || 0;
				var nResult = nQty * nUnitPrice;

				oResultInput.setValue(nResult.toString());
			},

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

			onMaterialValueHelpClose: function (oEvent) {
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

			},

			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PlantF4: [],
					Crtype: [],
					recognitionAlreadyStarted: false,
					SCMAppVisible: null,
					MaterialProcurement: {
						Header: {},
						itemData: []
					},
					MarineTransportation: {
						itemData: []
					}
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
					//   Company Code F4 data
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/ZCDSV_SCM_PRODUCTVH/', null,
						null),
					this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', '/CRTypeSet/', null,
						null),
					//	Cash Journal F4 Data
					/*this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'GET', '/ZCDSV_WORKCENTERVH/', null,
						dynamicFilters.WorkCntrFilter, )*/

				]).then(this.buildResponselist.bind(this)).catch(function (error) {}.bind(this));

			},
			buildResponselist: function (values) {
				// debugger;
				this.getModel().setProperty("/busy", false);
				// 			Company F4 type response
				var aPlantF4Data = values[0].value.results;
				this.getModel().setProperty("/PlantF4/", aPlantF4F4Data);
				// 			Cash Journal F4 type response
				/*var aCashJournalF4Data = values[1].value.results;
				this.getModel().setProperty("/CashJournalF4/", aCashJournalF4Data);*/

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