sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/ui/Device"
	],

	function (BaseController, JSONModel, History, MessageBox, Fragment, Device) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.PMCreateRequest", {

			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("PMCreateServiceRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				debugger;
				this._createItemDataModel();
				this.PlantF4();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				var sBaseUnit = sServiceProductLocalVal.split("_")[3];
				this.getModel().setProperty("/PMCreateRequest/Header/Material", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				this.getModel().setProperty("/PMCreateRequest/CustomDisplayData/BaseUnit", sBaseUnit);

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					PMCreateRequest: {
						Header: {},
						CustomDisplayData: {},
						Attachment: [],
						PlantF4: [],
						WorkCenterF4: []
					}
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

			WorkCenterF4: function (sKey) {
				var filters = [{
						path: "Plant",
						value: sKey,
						group: "WorkCntrFilter"
					}, {
						path: "ServiceProduct",
						value: this.getModel().getProperty("/PMCreateRequest/Header/Material"),
						group: "WorkCntrFilter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"),
					'GET',
					'/ZCDSV_WORKCENTERVH',
					null,
					dynamicFilters.WorkCntrFilter,
					null
				).then(function (oResponse) {

					this.getModel().setProperty("/PMCreateRequest/WorkCenterF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);

				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
			},
			onSelectPlant: function (oEve) {
				var sKey = oEve.getSource().getSelectedKey();
				this.WorkCenterF4(sKey);

			},
			onCheckPlantVal: function (oEve) {

				oEve.getSource().getSelectedKey() === "" ? oEve.getSource().setValue(null) : "";

			},

			onValueHelpRequest: async function (oEvent) {
				try {
					const sPlantFilter = new sap.ui.model.Filter({
						path: "MaintenancePlanningPlant",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: this.getModel().getProperty("/PMCreateRequest/Header/Planplant/")
					});

					const urlParameters = {
						"$skip": 1,
						"$top": 10
					};

					const oResponse = await this.getAPI.oDataACRUDAPICall(
						this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"),
						'GET',
						'/ZCDSV_EQUIPMENTVH',
						null,
						sPlantFilter,
						urlParameters
					);

					const model = this.getModel();
					model.setProperty("/PMCreateRequest/EquipmentF4/", oResponse.results);
					model.setProperty("/busy", false);

					if (!this.VDialog) {
						this.VDialog = await this.loadFragment({
							name: "com.swcc.Template.fragments.PMModule.EquipmentF4"
						});
					}

					if (Device.system.desktop) {
						this.VDialog.addStyleClass("sapUiSizeCompact");
					}
					this._oVID = this.VDialog;
					this._oVID.open();
				} catch (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}
			},

			_handleSelectEquipment: function (oEvent) {
				var selectedVendorDes = oEvent.getSource().getAggregation("attributes");
				var sEqipmentNo = selectedVendorDes[0].getProperty('text');
				this.getModel().setProperty("/PMCreateRequest/Header/Equipment/", sEqipmentNo);

				this._oVID.close();
			},

			onValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter(
					[
						new Filter({
							path: "CustomerName",
							operator: "Contains",
							value1: sValue.trim()
						})
					],
					false
				);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			PMCreateaRequestAPI: function (oPayload) {
				var oPayload = this.getModel().getProperty("/PMCreateRequest/Header/");
				oPayload.Username = "WT_POWER";
				oPayload.ServiceHeadertoItem = [];
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
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("ModuleSelect", {}, true);
				}
			},
			onCancel: function () {
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("ModuleSelect", {}, true);
				}
			},
			onSaveRequest: function () {
				debugger;
				var oPayload = this.getModel().getProperty("/PMCreateRequest/Header/");
				this.PMCreateaRequestAPI(oPayload);

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("ModuleSelect");

			},
			onProceed: function () {

				this._handleMessageBoxProceed("Your Service Request has been generated : 1945676");
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

							that.getRouter().navTo("HomePage", {}, true);
						}
					},
				});

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
			},
			handleUploadComplete: function (oEvent) {
				var sFileName = oEvent.getParameter("files")[0].name;
				var sFileSize = oEvent.getParameter("files")[0].size;

				// Get the existing data from the model
				var oModel = this.getView().getModel();
				var aUploadedFiles = oModel.getProperty("/uploadedFiles");

				// Add the new file data to the array
				aUploadedFiles.push({
					FileName: sFileName,
					FileSize: sFileSize
				});

				// Update the model with the new data
				oModel.setProperty("/uploadedFiles", aUploadedFiles);
			},

			handleUploadPress: function () {
				// Trigger the file upload process
				this.byId("fileUploader").upload();
			}
		})
	})