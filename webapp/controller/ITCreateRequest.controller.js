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
		return BaseController.extend("com.swcc.Template.controller.ITCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("ITCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				debugger;
				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/ITAppVisible/", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PlantF4: "",
					ITProcurement: {
						Header: {},
						itemData: []
					}
				});
			},

			/* Value help request */
			onValueHelpRequest: function (oEve) {

				var iIndex = oEve.getSource().getBindingContext() ? parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]) : "";
				var sValuehelpCheck = this.handleItemValuehelps(iIndex);
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

				// var sPath = "/ZCDSV_EQUIPMENTVH";

				this.onHandleValueHelpRequest(oModel, aColumns, sEntityPath, sFragName);

			},

			handleItemValuehelps: function (iIndex) {
				if (iIndex === "") {
					return "";
				}

				var sModelPath = this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" && this.getModel().getProperty(
					"/ITProcurement/itemData").length !== 0 ? `/ITProcurement/itemData/${iIndex}/MaterialF4/` : "";
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
				if (this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" && this.getModel().getProperty("/FragModel") ===
					"/MaterialF4/") {
					var filters = [{
							path: "ProductGroup",
							value: "IT001",
							group: "ComputerDeviceFilter"
						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_ITMATERIALVH",
						dynamicFilters.ComputerDeviceFilter, "/PMCreateRequest/WorkCenterF4/")
				} else if (this.getModel().getProperty("/ITAppVisible/") === "SSA-FIN-3005-3A" && this.getModel().getProperty("/FragModel") ===
					"/costF4/") {
					var filters = [{
							path: "CostCenter",
							value: this.getModel().getProperty("/costF4") ? this.getModel().getProperty(
								"/costF4").split("-")[0] : "",
							group: "RecordAssetFilter"
						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_FI_SRV", "/ZCDSV_COSTCTRVH",
						dynamicFilters.RecordAssetFilter, "/AssetLifecycle/RecordAsset/Header/ProfitCentr/")
				}
			},
			callDependentFilterAPI: function (entity, path, filter, model) {

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel(entity), 'GET', path, null, filter, null
				).then(function (oResponse) {

					this.getModel().setProperty(`${model}`, oResponse.results);
					this.getModel().setProperty("/busy", false);

				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
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

				this._filterTable(
					new Filter({
						filters: Object.keys(dynamicFilters).length === 0 ? [] : dynamicFilters.DynamicF4SearchFilter,
						and: false,
					})
				);
			},
			handleFiltersForValueHelp: function (F4) {
				var filters = [{
						path: "Identifier",
						value: "Employee Location",
						group: "EventFilter"
					}, {
						path: "FiscalYear",
						value: this.getModel().getProperty("/AccountPayable/ManagePettyCash/Header/FiscalYear") ? this.getModel().getProperty(
							"/AccountPayable/ManagePettyCash/Header/FiscalYear") : "",
						group: "CashJrnlF4Filter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				var aFilter;

				if (this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-3" && F4 === "/UserijdtF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.EventFilter);
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3003-1" && F4 === "/GlaccountF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.GLF4Filter);
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
				return new Filter({
					filters: aFilter,
					and: true,
				});

				//	return dynamicFilters.PlantFilter;
			},

			_filterTable: function (oFilter, sType) {

				this.handleVHFilterTable(oFilter, sType);
			},

			/* value help request ends here */
			handleBackPress: function () {
				this.navigationBack();

			},

			onback: function () {
				this.getOwnerComponent().getTargets().display("HomePage");

			},
			onProceed: function () {
				//	this.getOwnerComponent().getTargets().display("DetailView");
				this._handleMessageBoxProceed("Your Service Request has been generated : 12111099");
			},

			_handleMessageBoxProceed: function (sMessage) {
				var that = this;
				sap.m.MessageBox.success(sMessage, {
					icon: MessageBox.Icon.SUCCESS,
					title: "Success",
					actions: [MessageBox.Action.OK],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (oAction) {
						if (oAction == "OK") {

							that.getRouter().navTo("FinanceRequestView", {}, true);
						}
					},
				});

			},
			onAddItemsPress: function (oEvent) {
				var oModel = this.getModel().getProperty("/ITProcurement/itemData");
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					MaterialF4: "",
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
				this.getModel().setProperty("/ITProcurement/itemData", oItems);

			},
			onDeleteItemPress: function (oEvent) {
				var iRowNumberToDelete = parseInt(oEvent.getSource().getBindingContext().getPath().split("/")[3]);
				var aTableData = this.getModel().getProperty("/ITProcurement/itemData");
				aTableData.splice(iRowNumberToDelete, 1);
				this.getModel().refresh();
			},
			onProceed: function () {
				this.getOwnerComponent().getTargets().display("HRRequest");
			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			}
		})
	})