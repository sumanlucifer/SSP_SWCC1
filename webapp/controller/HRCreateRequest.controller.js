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
		return BaseController.extend("com.swcc.Template.controller.HRCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("HRCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {
				this._createItemDataModel();
				var oTimezonesModel = this.getOwnerComponent().getModel("timezonesData");
				oTimezonesModel.setSizeLimit(500);
				var aTimeZoneData = oTimezonesModel.getProperty("/");
				this.getModel().setProperty("/TimeZoneData", aTimeZoneData);
				var sLoginUser = this.getCurrentUserLoggedIn();
				this.getModel().setProperty("/LoginUserID", sLoginUser);
				this.getModel().setSizeLimit(1000);
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/HRAppVisible/", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					LoginUserID: "",
					HRAppVisible: null,
					TimeZoneData: "",
					TypeF4: "",
					HRCreateRequest: {
						UploadedData: [],
						Header: {},
						CustomDisplayData: {},
						Attachment: [],
						PlantF4: [],
						WorkCenterF4: [],

					},
					BenefitsManagement: {

						SubmitComplaint: {
							Header: {},
							itemData: []
						},

						MedicalInsurance: {
							Header: {},
							itemData: []
						},
						ClaimRequest: {
							Header: {},
							itemData: []
						}

					},
					PeopleCareCenter: {

						UpdateMasterData: {
							Header: {},
							itemData: []
						}

					},
					Payroll: {
						EmployeeVacation: {
							Header: {},
							itemData: []
						}
					},
					TimeManagement: {
						ActivatingAccessCard: {
							Header: {},
							itemData: []
						},
						ManageEmpShifts: {
							Header: {},
							itemData: []
						}
					},

					TransportationCommision: {
						Transfer: {
							Header: {},
							itemData: []
						},
						EmpTransporation: {
							Header: {},
							itemData: []
						},
						Commisioning: {
							Header: {},
							itemData: []
						}
					},

					RetirementandResignations: {
						Resignation: {
							Header: {},
							itemData: []
						},
						Retirement: {
							Header: {},
							itemData: []
						},

					}
				});
			},
			/* Value help request */
			onValueHelpRequest: function (oEve) {
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

			onSelectPlant: function (oEve) {
				var sKey = oEve.getSource().getSelectedKey();
				this.WorkCenterF4(sKey);

			},
			onCheckPlantVal: function (oEve) {

				oEve.getSource().getSelectedKey() === "" ? oEve.getSource().setValue(null) : "";

			},
			HRCreateaRequestAPI: function (oPayload) {
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
			handleBackPress: function () {
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("HomePage", {}, true);
				}

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

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
			onProceed: function () {
				//-------------------------------------------Retriement----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-3" ? this.HRCreateResignationRequest(this.getModel().getProperty(
						"/RetirementandResignations/Resignation/Header/"), this.getModel().getProperty(
						"/RetirementandResignations/Resignation/customItemData/")) :
					null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1" ? this.HRCreateResignationRequest(this.getModel().getProperty(
						"/RetirementandResignations/Resignation/Header/"), this.getModel().getProperty(
						"/RetirementandResignations/Resignation/customItemData/")) :
					null;

				this.getModel().getProperty("/FinanceAppVisible/") === "SSA-FIN-3001-2" ? this.FinanceCreateManangePettyCashRequest(this.getModel()
						.getProperty(
							"/AccountPayable/ManagePettyCash/Header/"), this.getModel().getProperty("/AccountPayable/ManagePettyCash/customItemData/")) :
					null;

			},
			HRCreateResignationRequest: function (oPayloadHeader, aItem) {
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/").split("-")[0] : "",
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {
						"Begda": oPayloadHeader.Resigndate,
						"Userid": oPayloadHeader.Persno,

					}

					/*	"ServiceHeadertoItem": aItem.map(
							function (items) {
								return {
									Belnr: items.InvoiceNo,
									Budat: items.PostingDate,

								};
							}
						)*/

				};
				this.FinanceCreateRequestAPI(oPayload);
			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			}
		})
	})