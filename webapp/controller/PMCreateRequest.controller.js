sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/ui/Device",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],

	function (BaseController, JSONModel, History, MessageBox, Fragment, Device, Filter, FilterOperator) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.PMCreateRequest", {

			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("PMCreateServiceRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function (oEvent) {

				debugger;
				this._createItemDataModel();
				this.objectType();
				var sServiceProductLocalVal = this.handlegetlocalStorage("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				var sBaseUnit = sServiceProductLocalVal.split("_")[3];
				this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.getModel().setProperty("/PMCreateRequest/CustomDisplayData/BaseUnit", sBaseUnit);
				var sOrderID = this.handlegetlocalStorage("OrderID");
				this.getModel().setProperty("/PMCreateRequest/Header/MaintOrder", sOrderID);

			},

			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PMCreateRequest: {
						UploadedData: [],
						Header: {},
						CustomDisplayData: {},
						Attachment: [],
						PlantF4: [],
						WorkCenterF4: []
					}
				});
			},

			objectType: function () {
				this.getModel().setProperty("/busy", true);
				this.CallValueHelpAPI('/C_TechnicalObjectType /')
					.then(function (oResponse) {
						this.getModel().setProperty("/busy", false);
						this.getModel().setProperty("/PMCreateRequest/ObjectType/", oResponse.results);
					}.bind(this)).catch(function (error) {
						this.getModel().setProperty("/busy", false);
						MessageBox.error(error.responseText);
					}.bind(this));

			},

			onCheckPlantVal: function (oEve) {

				oEve.getSource().getSelectedKey() === "" ? oEve.getSource().setValue(null) : "";

			},

			onValueHelpRequest: function (oEve) {

				var sFragName = oEve.getSource().getId().split("_")[3];
				var sEntity = oEve.getSource().getAriaLabelledBy()[0].split("-")[3];
				var sEntityPath = oEve.getSource().getAriaLabelledBy()[0].split("-")[4];
				var sFragName = oEve.getSource().getAriaLabelledBy()[0].split("-")[5];
				var sFragModel = oEve.getSource().getAriaLabelledBy()[0].split("-")[6];
				this.getModel().setProperty("/FragModel", sFragModel);
				this.handleFiltersForValueHelp(this.getModel().getProperty("/FragModel"));
				var customData = oEve.getSource().getCustomData();
				var aColumns = [];

				// Iterate through custom data and dynamically add columns
				for (var i = 0; i < customData.length; i++) {
					var columnLabel = customData[i].getValue();
					var columnTemplate = customData[i].getKey();

					// Add column only if label and template are available
					if (columnLabel && columnTemplate) {
						aColumns.push({
							label: columnLabel,
							template: columnTemplate,
							// You can add other properties as needed
						});
					}
				}
				this.getModel().setProperty("/dynamicColumns", aColumns);
				var aColumns = aColumns;
				var oModel = this.getOwnerComponent().getModel(sEntity);

				this.onHandleValueHelpRequest(oModel, aColumns, sEntityPath, sFragName);

			},
			onValueHelpOkPress: function (oEvent) {
				debugger;
				var dynamicColumns = this.getModel().getProperty("/dynamicColumns");
				var sModelPath = this.getModel().getProperty("/FragModel");
				var tokens = oEvent.getParameter("tokens"); // Pass the tokens you want to process
				var sKeyProperty = dynamicColumns[0].template; // Property name to set in the model
				var textProperty = dynamicColumns[1].template; // Property name for the token text
				var yourModel = this.getModel(); // Pass your model here
				var sModelPath = sModelPath;

				this.onHandleValueHelpOkPress(yourModel, sModelPath, tokens, sKeyProperty, textProperty);
				//	this.setDependentFilterData();

			},
			setDependentFilterData: function () {
				if (this.getModel().getProperty("/FragModel") ===
					"/InsuranceF4/") {
					var filters = [{
							path: "Zzinspono",
							value: this.getModel().getProperty("/InsuranceF4") ? this.getModel().getProperty(
								"/InsuranceF4").split("-")[0] : "",
							group: "InsuranceFilter"
						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilteAPI("ZSSP_FI_SRV", "/ZCDSV_INSURANCEVH",
						dynamicFilters.InsuranceFilter, "/PMCreateRequest/WorkCenterF4/")
				} else if (this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3005-3A" && this.getModel().getProperty("/FragModel") ===
					"/costF4/") {
					var filters = [{
							path: "CostCenter",
							value: this.getModel().getProperty("/costF4") ? this.getModel().getProperty(
								"/costF4").split("-")[0] : "",
							group: "RecordAssetFilter"
						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilteAPI("ZSSP_FI_SRV", "/ZCDSV_COSTCTRVH",
						dynamicFilters.RecordAssetFilter, "/AssetLifecycle/RecordAsset/Header/ProfitCentr/")
				}
			},

			callDependentFilteAPI: function (entity, path, filter, model) {

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

				var dynamicColumns = this.getModel().getProperty("/dynamicColumns");
				var afilterBar = oEvent.getParameter("selectionSet");
				var filters = [{
						path: dynamicColumns[0].template,
						value: afilterBar[0].getValue(),
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: dynamicColumns[1].template,
						value: afilterBar[1].getValue(),
						operator: sap.ui.model.FilterOperator.Contains,
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: dynamicColumns[2] && dynamicColumns[2].template ? dynamicColumns[2].template : "",
						value: afilterBar[2] && afilterBar[2].getValue() ? afilterBar[2].getValue().split("-")[0] : "",
						group: "DynamicF4SearchFilter",
						useOR: true
					}, {
						path: dynamicColumns[3] && dynamicColumns[3].template ? dynamicColumns[3].template : "",
						operator: sap.ui.model.FilterOperator.Contains,
						value: afilterBar[2] && afilterBar[2].getValue() ? afilterBar[2].getValue() : "",
						group: "DynamicF4SearchFilter",
						useOR: true
					}

				];
				var dynamicFilters = this.getFilters(filters, false);

				this._filterTable(
					dynamicFilters.DynamicF4SearchFilter
				);
			},

			handleFiltersForValueHelp: function (F4) {

				var filters = [{
						path: "Plant",
						value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
						group: "WorrkCenterF4Filter",
						useOR: true
					}, {
						path: "ServiceProduct",
						value: this.getModel().getProperty("/PMCreateRequest/Header/Material"),
						group: "WorrkCenterF4Filter"
					}, {
						path: "MaintenancePlanningPlant",
						value: this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
						group: "EquipmentF4Filter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				var aFilter;

				if (F4 === "/WorkCenterF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.WorrkCenterF4Filter);
				} else if (F4 === "/EquipmentF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.EquipmentF4Filter);
				} else {
					// Default case if none of the conditions are met
					aFilter = [];
				}

				this.getModel().setProperty("/DynamicValuehelpFilter", aFilter.length == 0 ? [] : aFilter);

			},
			onFilterValChanged: function (oEvent) {
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
					}, {
						path: this.getModel().getProperty("/valueHelpKey3"),
						value: afilterBar[2].getValue(),
						group: "DynamicF4SearchFilter"
					}, {
						path: this.getModel().getProperty("/valueHelpKey4"),
						operator: sap.ui.model.FilterOperator.Contains,
						value: afilterBar[3].getValue(),
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
			onClearFilter: function (oEve) {
				var afilterBar = oEve.getParameter("selectionSet");
				afilterBar[0].setValue(null);
				afilterBar[1].setValue(null);
				afilterBar[2] ? afilterBar[2].setValue(null) : "";
				afilterBar[3] ? afilterBar[3].setValue(null) : "";
				this._filterTable(
					new Filter({
						filters: [],
						and: false,
					})
				);
			},
			onValueHelpAfterOpen: function () {

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
			onProceed: function () {

				this.CreateFinaceRequestPayload(this.getModel().getProperty("/PMCreateRequest/Header/"));

			},
			CreateFinaceRequestPayload: function (oPayloadHeader) {
				const aUploadData = this.getModel().getProperty("/PMCreateRequest/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": oPayloadHeader.Material,
					"MaterialQty": oPayloadHeader.MaterialQty.toString(),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"StartDate": this.handleReturnDateonly(oPayloadHeader.StartDate),
					"EndDate": this.handleReturnDateonly(oPayloadHeader.EndDate),
					"Equipment": this.getModel().getProperty("/EquipmentF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"MaintOrder": oPayloadHeader.MaintOrder,
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.PMCreateRequestAPI(oPayload);
			},
			PMCreateRequestAPI: function (oPayload) {
				debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'POST', '/ServNotificationSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.Notificat}`);
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
			handleBackPress: function () {
				this.navigationBack();
			},
			onCancel: function () {
				this.navigationBack();
			},
			onSaveRequest: function () {
				var oPayload = this.getModel().getProperty("/PMCreateRequest/Header/");
				this.PMCreateaRequestAPI(oPayload);

			},

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
				var oModel = this.getModel().getProperty("/PMCreateRequest/UploadedData");
				var oItems = oModel.map(function (oItem) {
					return Object.assign({}, oItem);
				});
				oItems.push({
					Filename: Filename,
					Mimetype: Filetype,
					Value: Filecontent,
					//Filesize: Filesize

				});
				this.getModel().setProperty("/PMCreateRequest/UploadedData", oItems);

			},
			handleMissmatch: function () {
				this.handleFileMissmatch();
			},
			onFileSizeExceed: function () {

				this.handleFileSizeExceed();
			}
		})
	})