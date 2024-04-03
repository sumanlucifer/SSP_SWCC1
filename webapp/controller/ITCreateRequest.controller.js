sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageToast"
	],

	function (BaseController, JSONModel, History, MessageBox, Filter, FilterOperator, MessageToast) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.ITCreateRequest", {
			onInit: function () {

				this.oRouter = this.getRouter();
				this.getRouter().getRoute("ITCreateRequest").attachPatternMatched(this._onObjectMatched, this);

			},
			_onObjectMatched: function () {

				this._createItemDataModel();
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local),
					sServiceProductLocalVal = oStorage.get("sSubServiceType");
				var sServiceProduct = sServiceProductLocalVal.split("_")[0];
				var sServiceDescription = sServiceProductLocalVal.split("_")[1];
				this.getModel().setProperty("/ITAppVisible/", sServiceProduct);
				this.getModel().setProperty("/ServiceDescription", sServiceDescription);
				var sUserPlant = this.handlegetlocalStorage("userPlant");
				this.getModel().setProperty("/PlantF4", sUserPlant);

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					UploadedData: [],
					PlantF4: "",
					ITProcurement: {
						Header: {},
						itemData: []
					},
					NonITProcurement: {
						Header: {}
					},

				});
			},

			/* Value help request */
			onValueHelpRequest: function (oEve) {
				debugger;
				var iIndex = oEve.getSource().getBindingContext() ? parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]) : "";
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
				sModelPath = this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" && this.getModel().getProperty(
					"/ITProcurement/itemData").length !== 0 ? `/ITProcurement/itemData/${iIndex}${valuehelpModel}` : sModelPath;
				sModelPath = this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" && this.getModel().getProperty(
					"/ITProcurement/itemData").length !== 0 ? `/ITProcurement/itemData/${iIndex}${valuehelpModel}` : sModelPath;
				// Procurement: Conferencing Screen
				sModelPath = this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-3" && this.getModel().getProperty(
					"/ITProcurement/itemData").length !== 0 ? `/ITProcurement/itemData/${iIndex}${valuehelpModel}` : sModelPath;
				// Procurement: IP telephone Screen
				sModelPath = this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-1" && this.getModel().getProperty(
					"/ITProcurement/itemData").length !== 0 ? `/ITProcurement/itemData/${iIndex}${valuehelpModel}` : sModelPath;

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
				if (this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" && !this.getModel().getProperty("/HeaderValueHelp") && this.getModel()
					.getProperty("/valueHelpName") === "/MaterialF4/") {
					var filters = [{
							path: "ProductGroup",
							value: "IT001",
							group: "ComputerDeviceFilter",
							useOR: true
						}, {
							path: "Product",
							value: this.getModel().getProperty(`/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/MaterialF4/`).split(
								"-")[0],
							group: "ComputerDeviceFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_ITMATERIALVH",
						dynamicFilters.ComputerDeviceFilter, `/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}`)
				} else if (this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" && !this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/MaterialF4/") {
					var filters = [{
							path: "ProductGroup",
							value: "IT001",
							group: "HomeworkingFilter",
							useOR: true
						}, {
							path: "Product",
							value: this.getModel().getProperty(`/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/MaterialF4/`).split(
								"-")[0],
							group: "HomeworkingFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_ITMATERIALVH",
						dynamicFilters.HomeworkingFilter, `/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}`)

				}

				// Procurement: Conferencing Screen
				else if (this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-3" && !this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/MaterialF4/") {
					var filters = [{
							path: "ProductGroup",
							value: "IT001",
							group: "ConferencingFilter",
							useOR: true

						}, {
							path: "Product",
							value: this.getModel().getProperty(`/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/MaterialF4/`).split(
								"-")[0],
							group: "ConferencingFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_ITMATERIALVH",
						dynamicFilters.ConferencingFilter, `/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}`)

				} else if (this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-1" && !this.getModel().getProperty("/HeaderValueHelp") &&
					this.getModel()
					.getProperty("/valueHelpName") === "/MaterialF4/") {
					var filters = [{
							path: "ProductGroup",
							value: "IT001",
							group: "ITTelephonicFilter",
							useOR: true
						}, {
							path: "Product",
							value: this.getModel().getProperty(`/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}/MaterialF4/`).split(
								"-")[0],
							group: "ITTelephonicFilter"

						}

					];

					var dynamicFilters = this.getFilters(filters);
					this.callDependentFilterAPI("ZSSP_SCM_SRV", "/ZCDSV_ITMATERIALVH",
						dynamicFilters.ITTelephonicFilter, `/ITProcurement/itemData/${this.getModel().getProperty("/itemIndex")}`)

				}

			},
			callDependentFilterAPI: function (entity, path, filter, model) {

				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(
					this.getOwnerComponent().getModel(entity), 'GET', path, null, filter, null
				).then(function (oResponse) {
					this.handleDependentFilterResponse(oResponse.results[0], `${model}`);
					this.getModel().setProperty("/busy", false);

				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
			},

			handleDependentFilterResponse: function (aData, oModel) {

				this.getModel().setProperty(`${oModel}/Description/`, aData.ProductName);
				this.getModel().setProperty(`${oModel}/BaseUnit/`, aData.BaseUnit);

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
				return new Filter(aFilter);

				//	return dynamicFilters.PlantFilter;
			},

			_filterTable: function (oFilter, sType) {

				this.handleVHFilterTable(oFilter, sType);
			},

			/* value help request ends here */
			handleBackPress: function () {
				this.navigationBack();

			},
			handleBackHomePress: function () {
				this.getRouter().navTo("HomePage", {}, true);
			},

			/*onback: function () {
				this.getOwnerComponent().getTargets().display("HomePage");

			},*/

			onProceed: function () {

				//-------------------------------------------Support IT Services----------------------------------------------------------------------
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4002-1" ? this.ITCreateNonProcuremenRequest(this.getModel().getProperty(
					"/NonITProcurement/Header/"), null) : null;
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4002-2" ? this.ITCreateNonProcuremenRequest(this.getModel()
						.getProperty(
							"/NonITProcurement/Header/"), null) :
					null;
				//-------------------------------------------Communication  Services----------------------------------------------------------------------
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" ? this.ITCreateProcuremenRequest(this.getModel().getProperty(
					"/ITProcurement/Header/"), this.getModel().getProperty(
					"/ITProcurement/itemData/")) : null;
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-3" ? this.ITCreateProcuremenRequest(this.getModel()
						.getProperty(
							"/ITProcurement/Header/"), this.getModel().getProperty(
							"/ITProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-1" ? this.ITCreateProcuremenRequest(this.getModel()
						.getProperty(
							"/ITProcurement/Header/"), this.getModel().getProperty(
							"/ITProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" ? this.ITCreateProcuremenRequest(this.getModel()
						.getProperty(
							"/ITProcurement/Header/"), this.getModel().getProperty(
							"/ITProcurement/itemData/")) :
					null;
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" ? this.ITCreateProcuremenRequest(this.getModel()
						.getProperty(
							"/ITProcurement/Header/"), this.getModel().getProperty(
							"/ITProcurement/itemData/")) :
					null;

				// Non-Procurement: Applications Access and e-mail accounts 
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-1" ? this.ITCreateNonProcuremenRequest(this.getModel()
						.getProperty(
							"/NonITProcurement/Header/"), null) :
					null;

			},
			handleValidation: function (array) {
				var isValid = true;
				var itemCheck = !array || array.length === 0 ? false : true;
				const hasYes = array.some(obj => obj.StockAvailable === "Yes");
				const hasNo = array.some(obj => obj.StockAvailable === "No");
				if (!itemCheck) {
					MessageToast.show("item Data is required to Submit the request");
					isValid = false;
					return isValid;
				}
				if ((hasYes && hasNo) || (!hasYes && !hasNo)) {
					isValid = false;
					MessageToast.show("Enter either stock materials or nonstock materials combination is not allowed here.");
				}

				return isValid;

			},
			ITCreateNonProcuremenRequest: function (oPayloadHeader, aItem) {
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/ITAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"ZHeaderExtra": {},

					"ServiceHeadertoItem": [],
					"Attachments": aUploadData

				};
				this.ITCreateRequestAPI(oPayload);
			},

			ITCreateProcuremenRequest: function (oPayloadHeader, aItem) {
				if (!this.handleValidation(aItem)) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/ITAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.NotifText,
					"Funcloc": `${oPayloadHeader.EstPrice}`,
					"ZHeaderExtra": {},
					"ServiceHeadertoItem": aItem.map(
						function (items) {
							return {
								Matnr: items.MaterialF4.split("-")[0],
								Menge: items.Menge,
								UnitPrice: Number.isNaN(parseFloat(items.UnitPrice)) ? "0.00" : parseFloat(items.UnitPrice).toFixed(2),
								TotalPrice: Number.isNaN(parseFloat(items.TotalPrice)) ? "0.00" : parseFloat(items.TotalPrice).toFixed(2)
									// UnitPrice: parseFloat(items.UnitPrice).toFixed(2),
									// TotalPrice: parseFloat(items.TotalPrice).toFixed(2)

							};
						}
					),
					"Attachments": aUploadData

				};
				this.ITCreateRequestAPI(oPayload);
			},
			ITCreateRequestAPI: function (oPayload) {
				debugger;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"), 'POST', '/ServNotificationSet',
						oPayload)
					.then(function (oResponse) {
						this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.Notificat}`);
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

				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ITProcurement/itemData"), {
					MaterialF4: null,
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ITProcurement/itemData") : "";

				// Procurement: Conferencing Screen

				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-3" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ITProcurement/itemData"), {
					MaterialF4: null,
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ITProcurement/itemData") : "";
				// Procurement: Computer devices and accessories Screen
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ITProcurement/itemData"), {
					MaterialF4: null,
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ITProcurement/itemData") : "";

				// Procurement: IP telephone Screen
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-1" ? this.updateItemAddModel(this.getModel().getProperty(
					"/ITProcurement/itemData"), {
					MaterialF4: null,
					Description: "",
					Menge: "",
					BaseUnit: "",
					StockAvailable: "",
					UnitPrice: "",
					TotalPrice: ""
				}, "/ITProcurement/itemData") : "";

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
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ITProcurement/itemData")) : "";
				// Procurement: Conferencing Screen
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-3" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ITProcurement/itemData")) : "";
				// Procurement: Computer devices and accessories Screen
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4001-2" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ITProcurement/itemData")) : "";

				// Procurement: IP telephone Screen
				this.getModel().getProperty("/ITAppVisible/") === "SSA-IT-4003-1" ? this.updateItemDeleteModel(iRowNumberToDelete, this.getModel()
					.getProperty(
						"/ITProcurement/itemData")) : "";

			},
			updateItemDeleteModel: function (index, oModel) {
				oModel.splice(index, 1);
				this.getModel().refresh();
			},
			handleLiveChangeQty: function (oEve) {
				var iItemIndex = parseInt(oEve.getSource().getBindingContext().getPath().split("/")[3]);
				var sQty = oEve.getSource().getValue() === "" ? "" : parseInt(oEve.getSource().getValue());
				var sMtrl = oEve.getSource().getBindingContext().getObject().MaterialF4 ? oEve.getSource().getBindingContext().getObject().MaterialF4
					.split("-")[0] : "";
				var sEntityPath = `/MaterialAvailabilitySet(Material='${sMtrl}',Qty='${sQty}')`;
				this.getModel().setProperty("/busy", true);
				this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_SCM_SRV"), 'GET', sEntityPath,
						null)
					.then(function (oResponse) {
						this.handleQtyChangeResponse(oResponse, iItemIndex);
						this.getModel().setProperty("/busy", false);
					}.bind(this)).catch(function (error) {
						// 		MessageBox.error(error.responseText);
						this._handleError(error);
						this.getModel().setProperty("/busy", false);
					}.bind(this));
			},
			handleQtyChangeResponse: function (aData, index) {
				debugger;
				this.getModel().setProperty(`/ITProcurement/itemData/${index}/StockAvailable/`, aData.StockAvailable);
				this.getModel().setProperty(`/ITProcurement/itemData/${index}/TotalPrice/`, aData.TotalPrice);
				this.getModel().setProperty(`/ITProcurement/itemData/${index}/UnitPrice/`, aData.UnitPrice);
				const totalSum = this.getModel().getProperty("/ITProcurement/itemData/").reduce((acc, currentItem) => acc + parseInt(currentItem.TotalPrice),
					0);

				var iEstimated = (totalSum) + 0.15 * totalSum;

				iEstimated = Number.isNaN(iEstimated) ? 0 : iEstimated;
				this.getModel().setProperty("/ITProcurement/Header/EstPrice/", iEstimated);
			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

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

			},

			_addData: function (Filecontent, Filename, Filetype, Filesize) {

				debugger;
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
				currentElement.removeStyleClass("remove-table");

			},
			handleMissmatch: function () {
				this.handleFileMissmatch();
			},
			onFileSizeExceed: function () {

				this.handleFileSizeExceed();
			},
			onCancel: function () {
				this.navigationBack();
			}
		})
	})