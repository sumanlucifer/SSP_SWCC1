/**/
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

		return BaseController.extend("com.swcc.Template.controller.HRCreateRequest", {
			onInit: function () {
				/**/
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
				var sUserPlant = this.handlegetlocalStorage("userPlant");
				this.getModel().setProperty("/PlantF4", sUserPlant);

				var sUserType = this.handlegetlocalStorage("userType");

				/*this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-1" ? this.getModel().setProperty("/TerminationF4",
					"27-Early Retirement") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-2" ? this.getModel().setProperty("/TerminationF4",
					"30-Retirement(completion of statutory work service)") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-3" ? this.getModel().setProperty("/TerminationF4",
					"20-Resignation") : null;*/
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1" ? this.getModel().setProperty("/PolicyNoF4",
					"PN- 501369001") : null;

			},
			_createItemDataModel: function () {
				this.getModel().setData({
					busy: false,
					LoginUserID: "",
					HRAppVisible: null,
					TimeZoneData: "",
					/*	TypeF4: "",*/
					UploadedData: [],
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
					Termination: {
						Termination: {
							Header: {},
							itemData: []
						}

						// 		same model re-use for retirement resignation sub seevice screens
					},
					CompensationRewards: {
						RegularRewards: {
							Header: {},
							itemData: []
						}
						// 		same model re-use for both screens 
					},
					Recruitment: {
						InternalRecruitment: {
							Header: {},
							itemData: []
						},
						ExternalRecruitment: {
							Header: {},
							itemData: []
						}
						// 		same model re-use for both screens 
					},
					TrainingDevelopment: {
						EmployeeLearningDevelopment: {
							Header: {},
							itemData: []
						}

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
						path: "value_1",
						value: "PN",
						group: "CashJrnlF4Filter"
					}

				];

				var dynamicFilters = this.getFilters(filters);
				var aFilter;

				if (this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-3" && F4 === "/UserijdtF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.EventFilter);
				} else if (this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1" && F4 === "/PolicyNoF4/") {
					aFilter = this._getfilterforControl(dynamicFilters.CashJrnlF4Filter);
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
				return aFilter;

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

			handleBackPress: function () {
				this.navigationBack();

			},
			handleBackHomePress: function () {
				this.getRouter().navTo("HomePage", {}, true);
			},
			/*	onback: function () {
					this.getOwnerComponent().getTargets().display("LandingView");

				},*/

			onProceed: function () {
				//-------------------------------------------Medical Care Benefits----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1-B" ? this.HRCreatemedicalcaresubmitcomplaintRequest(this.getModel()
					.getProperty("/BenefitsManagement/SubmitComplaint/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1-A" ? this.HRCreatemedicalcareclaimRequest(this.getModel().getProperty(
					"/BenefitsManagement/ClaimRequest/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1010-1" ? this.HRCreatemedicalcareinsuranceRequest(this.getModel()
					.getProperty("/BenefitsManagement/MedicalInsurance/Header/"), "") : null;
				//-------------------------------------------Compensation Rewards----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1003-1" ? this.HRCreaterewardsRequest(this.getModel().getProperty(
					"/CompensationRewards/RegularRewards/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1003-2" ? this.HRCreaterewardsRequest(this.getModel().getProperty(
					"/CompensationRewards/RegularRewards/Header/"), "") : null;
				//-------------------------------------------Payroll----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1008-1" ? this.HRCreateemployeevacationsRequest(this.getModel().getProperty(
					"/Payroll/EmployeeVacation/Header/"), "") : null;
				//-------------------------------------------People care center----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1009-1" ? this.HRCreateupdatemasterdataRequest(this.getModel().getProperty(
					"/PeopleCareCenter/UpdateMasterData/Header/"), "") : null;
				//-------------------------------------------Recruitment----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1001-1" ? this.HRCreaterecruitmentRequest(this.getModel().getProperty(
					"/Recruitment/InternalRecruitment/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1001-2" ? this.HRCreateexternalrecruitmentRequest(this.getModel().getProperty(
					"/Recruitment/ExternalRecruitment/Header/"), "") : null;
				//-------------------------------------------Termination,Retriement and Resignation----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1005-1" ? this.HRCreateterminationRequest(this.getModel().getProperty(
					"/Termination/Termination/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-1" ? this.HRCreateterminationRequest(this.getModel().getProperty(
					"/Termination/Termination/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-2" ? this.HRCreateterminationRequest(this.getModel().getProperty(
					"/Termination/Termination/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1004-3" ? this.HRCreateterminationRequest(this.getModel().getProperty(
					"/Termination/Termination/Header/"), "") : null;
				//-------------------------------------------Time Management----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1007-1" ? this.HRCreatetimemanagementRequest(this.getModel().getProperty(
					"/TimeManagement/ActivatingAccessCard/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1007-2" ? this.HRCreatemanageemployeeRequest(this.getModel().getProperty(
					"/TimeManagement/ManageEmpShifts/Header/"), "") : null;
				//-------------------------------------------Training and development----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1002-1" ? this.HRCreateemployeelearningRequest(this.getModel().getProperty(
					"/TrainingDevelopment/EmployeeLearningDevelopment/Header/"), "") : null;
				//-------------------------------------------Transport and comission----------------------------------------------------------------------
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1006-1" ? this.HRCreatetransfersecondRequest(this.getModel().getProperty(
					"/TransportationCommision/Transfer/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1006-2" ? this.HRCreateemployeetransportationRequest(this.getModel().getProperty(
					"/TransportationCommision/EmpTransporation/Header/"), "") : null;
				this.getModel().getProperty("/HRAppVisible/") === "SSA-HR-1006-3" ? this.HRCreatecomissionofallkindsRequest(this.getModel().getProperty(
					"/TransportationCommision/Commisioning/Header/"), "") : null;

			},
			HRCreatemedicalcaresubmitcomplaintRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/BenefitsManagement/SubmitComplaint/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Cname": oPayloadHeader.Cname,
						"Type": this.getModel().getProperty("/TypeF4/") ? this.getModel().getProperty("/TypeF4/").split("-")[0] : "",
						"Aprnum": oPayloadHeader.Zaprnum,
						"Idcot": oPayloadHeader.Idcot,
						"Zcomment": oPayloadHeader.Zcomment
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatemedicalcareclaimRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/HRAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						//"Userid": oPayloadHeader.Persno,
						"Cname": oPayloadHeader.PadCname,
						"Idcot": oPayloadHeader.P25Idcot,
						"Gesch": oPayloadHeader.Gesch,
						"Mobile": oPayloadHeader.Zmobile,
						"Memnum": oPayloadHeader.Zmemnum,
						"Iban": oPayloadHeader.Iban,
						"Inspol": this.getModel().getProperty("/InsurancepolicyF4/") ? this.getModel().getProperty("/InsurancepolicyF4/").split("-")[0] : "",
						"Cltype": this.getModel().getProperty("/ClaimtypeF4/") ? this.getModel().getProperty("/ClaimtypeF4/").split("-")[0] : "",
						"Amount": oPayloadHeader.Zamount,
						"Bankk": oPayloadHeader.Bankk,
						"Ort01": oPayloadHeader.PadOrt01,
						"Land1": this.getModel().getProperty("/CountryF4/") ? this.getModel().getProperty("/CountryF4/").split("-")[0] : "",
						"Visdat": this.handleOdataDateFormat(oPayloadHeader.Zvisdat),
						"Proname": oPayloadHeader.Zproname,
						"Zcomment": oPayloadHeader.Zcomment
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatemedicalcareinsuranceRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/HRAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Emplt": this.getModel().getProperty("/TypeofemployeementF4/") ? this.getModel().getProperty("/TypeofemployeementF4/").split(
							"-")[0] : "",
						"Reqt": this.getModel().getProperty("/RequesttypeF4/") ? this.getModel().getProperty("/RequesttypeF4/").split("-")[0] : "",
						//"Userid": oPayloadHeader.Persno,
						"Mobile": oPayloadHeader.Zmobile,
						"Zcomment": oPayloadHeader.Zcomment,
						"Idcot": oPayloadHeader.Idcot,
						"Zibegda": this.handleOdataDateFormat(oPayloadHeader.Zibegda),
						"Polnum": this.getModel().getProperty("/PolicyNoF4/") ? this.getModel().getProperty("/PolicyNoF4/").split(
							"-")[0] : "",
						"Zibegda": this.handleOdataDateFormat(oPayloadHeader.Zibegda),
						"Gesch": oPayloadHeader.Gesch,
						"Natio": this.getModel().getProperty("/CountryF4/") ? this.getModel().getProperty("/CountryF4/").split(
							"-")[0] : "",
						"Vorna": oPayloadHeader.Vorna,
						"Nach2": oPayloadHeader.Nach2,
						"Nachn": oPayloadHeader.Nachn,
						"Depid": oPayloadHeader.Zdepid
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreaterewardsRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/CompensationRewards/RegularRewards/Header/"))) return;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Massg": this.getModel().getProperty("/EventF4/") ? this.getModel().getProperty("/EventF4/").split("-")[0] : "",
						"Massn": this.getModel().getProperty("/EventreasonF4/") ? this.getModel().getProperty("/EventreasonF4/").split("-")[0] : "",
						"Payscgrp": this.getModel().getProperty("/PayscalegroupF4/") ? this.getModel().getProperty("/PayscalegroupF4/").split("-")[0] : "",
						"Paysclvl": this.getModel().getProperty("/PayscalelevelF4/") ? this.getModel().getProperty("/PayscalelevelF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateemployeevacationsRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/Payroll/EmployeeVacation/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Endate": this.handleOdataDateFormat(oPayloadHeader.Zendate),
						"Timetype": this.getModel().getProperty("/TimetypeF4/") ? this.getModel().getProperty("/TimetypeF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateupdatemasterdataRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/PeopleCareCenter/UpdateMasterData/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Detailupdat": oPayloadHeader.Zdetailupdat
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreaterecruitmentRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/Recruitment/InternalRecruitment/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Jdescr": oPayloadHeader.Zjdescr,
						"Jfreq": oPayloadHeader.Zjfreq,
						"Jnum": oPayloadHeader.Zjnum,
						"Scopelevel": oPayloadHeader.Zscopelevel,
						"Jtasks": oPayloadHeader.Zjtasks,
						"Oreq": oPayloadHeader.Zoreq,
						"Jobtitle": this.getModel().getProperty("/JobtitleF4/") ? this.getModel().getProperty("/JobtitleF4/").split("-")[0] : "",
						"Jgrade": this.getModel().getProperty("/JobgradeF4/") ? this.getModel().getProperty("/JobgradeF4/").split("-")[0] : "",
						"Jlocation": this.getModel().getProperty("/JoblocationF4/") ? this.getModel().getProperty("/JoblocationF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateexternalrecruitmentRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/Recruitment/ExternalRecruitment/Header/"))) return;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Jdept": oPayloadHeader.Zjdept,
						"Exp": oPayloadHeader.Zexp,
						"Jtasks": oPayloadHeader.Zjtasks,
						"Jqreq": oPayloadHeader.Zjqreq,
						"Jobtitle": this.getModel().getProperty("/JobtitleF4/") ? this.getModel().getProperty("/JobtitleF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateterminationRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/Termination/Termination/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						/*"Persno": "U001486",*/
						"Massn": this.getModel().getProperty("/TerminationF4/") ? this.getModel().getProperty("/TerminationF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatetimemanagementRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/TimeManagement/ActivatingAccessCard/Header"))) return;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Endate": this.handleOdataDateFormat(oPayloadHeader.Zendate),
						"Orgeh": oPayloadHeader.Orgeh,
						"Vorna": oPayloadHeader.Vorna,
						"Nachn": oPayloadHeader.Nachn,
						"Area": oPayloadHeader.Zarea,
						"Idcot": oPayloadHeader.Idcot,
						"Cardno": oPayloadHeader.Zcardno
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatemanageemployeeRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/TimeManagement/ManageEmpShifts/Header/"))) return;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Massg": this.getModel().getProperty("/EventF4/") ? this.getModel().getProperty("/EventF4/").split("-")[0] : "",
						"Massn": this.getModel().getProperty("/EventreasonF4/") ? this.getModel().getProperty("/EventreasonF4/").split("-")[0] : "",
						"Schkz": this.getModel().getProperty("/WorkscheduleF4/") ? this.getModel().getProperty("/WorkscheduleF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateemployeelearningRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/")) || !this.handleAttachmentvalidation(this.getModel()
						.getProperty("/HRAppVisible/"),
						this.getModel().getProperty("/UploadedData"))) return false;
				/*	if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
							"/TrainingDevelopment/EmployeeLearningDevelopment/Header"))) return;*/
				const aUploadData = this.getModel().getProperty("/UploadedData").length === 0 ? [] : this.getModel().getProperty("/UploadedData").map(
					({
						Filesize,
						...rest
					}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Reqdat": this.handleOdataDateFormat(oPayloadHeader.Reqdat),
						"Itemdet": oPayloadHeader.Itemdet,
						"Userjobloc": this.getModel().getProperty("/UserJoblocationF4/") ? this.getModel().getProperty("/UserJoblocationF4/").split(
							"-")[0] : ""
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatetransfersecondRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/TransportationCommision/Transfer/Header/"))) return;
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Massg": this.getModel().getProperty("/EventF4/") ? this.getModel().getProperty("/EventF4/").split("-")[0] : "",
						"Massn": this.getModel().getProperty("/EventreasonF4/") ? this.getModel().getProperty("/EventreasonF4/").split("-")[0] : "",
						"Endate": this.handleOdataDateFormat(oPayloadHeader.Zendate)
					},
					"ServiceHeadertoItem": []
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateemployeetransportationRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/TransportationCommision/EmpTransporation/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Tzone": oPayloadHeader.TimeZoneKey,
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Begda": this.handleOdataDateFormat(oPayloadHeader.Begda),
						"Massg": this.getModel().getProperty("/EventF4/") ? this.getModel().getProperty("/EventF4/").split("-")[0] : "",
						"Massn": this.getModel().getProperty("/EventreasonF4/") ? this.getModel().getProperty("/EventreasonF4/").split("-")[0] : "",
						"Payscgrp": this.getModel().getProperty("/PayscalegroupF4/") ? this.getModel().getProperty("/PayscalegroupF4/").split("-")[0] : "",
						"Zposition": this.getModel().getProperty("/PositionF4/") ? this.getModel().getProperty("/PositionF4/").split("-")[0] : "",
						"Emploc": this.getModel().getProperty("/EmployeeLocF4/") ? this.getModel().getProperty("/EmployeeLocF4/").split("-")[0] : "",
						"Paysclvl": this.getModel().getProperty("/PayscalelevelF4/") ? this.getModel().getProperty("/PayscalelevelF4/").split("-")[0] : ""
					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreatecomissionofallkindsRequest: function (oPayloadHeader, aItem) {
				if (!this.handleHeaderValidation(this.getModel().getProperty("/HRAppVisible/"), this.getModel().getProperty(
						"/TransportationCommision/Commisioning/Header/"))) return;
				const aUploadData = this.getModel().getProperty("/UploadedData").map(({
					Filesize,
					...rest
				}) => rest);
				var oPayload = {
					"Username": this.getCurrentUserLoggedIn(),
					"Material": this.getModel().getProperty("/HRAppVisible/"),
					"Plant": this.getModel().getProperty("/PlantF4/") ? this.getModel().getProperty("/PlantF4/") : "",
					"Descript": oPayloadHeader.Descript,
					"NotifText": oPayloadHeader.Zcomment,
					"ZHeaderExtra": {
						"Persno": this.getModel().getProperty("/LoginUserID").substring(0, 8),
						"Hiredat": this.handleOdataDateFormat(oPayloadHeader.Zhiredat),
						"Company": this.getModel().getProperty("/CompanyF4/") ? this.getModel().getProperty("/CompanyF4/").split("-")[0] : "",
						"Massn": this.getModel().getProperty("/EventreasonF4/") ? this.getModel().getProperty("/EventreasonF4/").split("-")[0] : "",
						"Orgdat": this.handleOdataDateFormat(oPayloadHeader.Zorgdat),
						"Seniordat": this.handleOdataDateFormat(oPayloadHeader.Zseniordat),
						"Servdat": this.handleOdataDateFormat(oPayloadHeader.Zservdat),
						"Zposition": this.getModel().getProperty("/PositionF4/") ? this.getModel().getProperty("/PositionF4/").split("-")[0] : "",
						"Emploc": this.getModel().getProperty("/EmployeeLocF4/") ? this.getModel().getProperty("/EmployeeLocF4/").split("-")[0] : "",
						"Tzone": oPayloadHeader.TimeZoneKey,
						"Contrtype": this.getModel().getProperty("/ContracttypeF4/") ? this.getModel().getProperty("/ContracttypeF4/").split("-")[0] : "",
						"Payscgrp": this.getModel().getProperty("/PayscalegroupF4/") ? this.getModel().getProperty("/PayscalegroupF4/").split("-")[0] : "",
						"Paysclvl": this.getModel().getProperty("/PayscalelevelF4/") ? this.getModel().getProperty("/PayscalelevelF4/").split("-")[0] : "",
						"Schkn": this.getModel().getProperty("/PayscalelevelF4/") ? this.getModel().getProperty("/PayscalelevelF4/").split("-")[0] : "",
						"Timeprf": this.getModel().getProperty("/TimeProfileF4/") ? this.getModel().getProperty("/TimeProfileF4/").split("-")[0] : "",
						"Timerecprf": this.getModel().getProperty("/TimeRecoringF4/") ? this.getModel().getProperty("/TimeRecoringF4/").split("-")[0] : "",
						"Timerecadmis": this.getModel().getProperty("/TimeRecoringAdmisF4/") ? this.getModel().getProperty("/TimeRecoringAdmisF4/").split(
							"-")[0] : "",
						"Timerecvar": this.getModel().getProperty("/TimeRecoringVariantF4/") ? this.getModel().getProperty("/TimeRecoringVariantF4/").split(
							"-")[0] : "",
						"Clockinout": this.getModel().getProperty("/ClockInOutF4/") ? this.getModel().getProperty("/ClockInOutF4/").split("-")[0] : "",
						"Payrollid": oPayloadHeader.Payrollid,
						"Paygrp": this.getModel().getProperty("/PayGroupF4/") ? this.getModel().getProperty("/PayGroupF4/").split("-")[0] : ""

					},
					"ServiceHeadertoItem": [],
					"Attachments": aUploadData
				};
				this.HRCreateaRequestAPI(oPayload);
			},
			HRCreateaRequestAPI: function (oPayload) {
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
			handleValidation: function (service, header, item) {
				if (!this.handleHeaderValidation(service, header) || !this.handleItemValidation(service, item)) return false;
				// Continue with the rest of the code if both validations pass
			},
			handleHeaderValidation: function (service, aData) {
				var isValid = true;
				var validationProperties;
				if (service === "SSA-HR-1005-1" || service === "SSA-HR-1004-1" || service === "SSA-HR-1004-2" || service === "SSA-HR-1004-3" ||
					service === "SSA-HR-1005-1") {
					validationProperties = [{
						path: "/Termination/Termination/Header/Begda/",
						condition: true
					}, {
						path: "/Termination/Termination/Header/Descript/",
						condition: true
					}];
				} else if (service === "SSA-HR-1001-1") {
					validationProperties = [{
						path: "/Recruitment/InternalRecruitment/Header/Zjnum/",
						condition: true
					}, {
						path: "/JobtitleF4/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Zoreq/",
						condition: true
					}, {
						path: "/JobgradeF4/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Zjdescr/",
						condition: true
					}, {
						path: "/JoblocationF4/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Zjfreq/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Zscopelevel/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Descript/",
						condition: true
					}, {
						path: "/Recruitment/InternalRecruitment/Header/Zjtasks/",
						condition: true
					}];
				} else if (service === "SSA-HR-1001-2") {
					validationProperties = [{
						path: "/Recruitment/ExternalRecruitment/Header/Zexp/",
						condition: true
					}, {
						path: "/JobtitleF4/",
						condition: true
					}, {
						path: "/Recruitment/ExternalRecruitment/Header/Zjtasks/",
						condition: true
					}, {
						path: "/Recruitment/ExternalRecruitment/Header/Zjqreq/",
						condition: true
					}, {
						path: "/Recruitment/ExternalRecruitment/Header/Descript/",
						condition: true
					}, {
						path: "/Recruitment/ExternalRecruitment/Header/Zjdept/",
						condition: true
					}];
				} else if (service === "SSA-HR-1002-1") {
					validationProperties = [{
						path: "/UserJoblocationF4/",
						condition: true
					}, {
						path: "/TrainingDevelopment/EmployeeLearningDevelopment/Header/Itemdet/",
						condition: true
					}, {
						path: "/TrainingDevelopment/EmployeeLearningDevelopment/Header/Descript/",
						condition: true
					}, {
						path: "/TrainingDevelopment/EmployeeLearningDevelopment/Header/Reqdat/",
						condition: true
					}];
				} else if (service === "SSA-HR-1003-1" || service === "SSA-HR-1003-2") {
					validationProperties = [{
						path: "/EventF4/",
						condition: true
					}, {
						path: "/EventreasonF4/",
						condition: true
					}, {
						path: "/CompensationRewards/RegularRewards/Header/Descript/",
						condition: true
					}, {
						path: "/CompensationRewards/RegularRewards/Header/Begda/",
						condition: true
					}];
				} else if (service === "SSA-HR-1007-1") {
					validationProperties = [{
						path: "/TimeManagement/ActivatingAccessCard/Header/Vorna/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Zarea/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Zendate/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Nachn/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Idcot/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Descript/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Zcardno/",
						condition: true
					}, {
						path: "/TimeManagement/ActivatingAccessCard/Header/Orgeh/",
						condition: true
					}];
				} else if (service === "SSA-HR-1007-2") {
					validationProperties = [{
						path: "/TimeManagement/ManageEmpShifts/Header/Begda/",
						condition: true
					}, {
						path: "/TimeManagement/ManageEmpShifts/Header/Descript/",
						condition: true
					}, {
						path: "/EventF4/",
						condition: true
					}, {
						path: "/WorkscheduleF4/",
						condition: true
					}, {
						path: "/EventreasonF4/",
						condition: true

					}];
				} else if (service === "SSA-HR-1008-1") {
					validationProperties = [{
						path: "/Payroll/EmployeeVacation/Header/Zendate/",
						condition: true
					}, {
						path: "/Payroll/EmployeeVacation/Header/Descript/",
						condition: true
					}, {
						path: "/TimetypeF4/",
						condition: true
					}, {
						path: "/Payroll/EmployeeVacation/Header/Begda/",
						condition: true
					}];
				} else if (service === "SSA-HR-1006-1") {
					validationProperties = [{
						path: "/TransportationCommision/Transfer/Header/Zendate/",
						condition: true
					}, {
						path: "/TransportationCommision/Transfer/Header/Descript/",
						condition: true
					}, {
						path: "/EventreasonF4/",
						condition: true
					}, {
						path: "/EventF4/",
						condition: true
					}, {
						path: "/TransportationCommision/Transfer/Header/Begda/",
						condition: true
					}];
				} else if (service === "SSA-HR-1006-2") {
					validationProperties = [{
						path: "/TransportationCommision/EmpTransporation/Header/Begda/",
						condition: true
					}, {
						path: "/TransportationCommision/EmpTransporation/Header/Descript/",
						condition: true
					}, {
						path: "/PositionF4/",
						condition: true
					}, {
						path: "/EventF4/",
						condition: true
					}, {
						path: "/EventreasonF4/",
						condition: true
					}, {
						path: "/TransportationCommision/EmpTransporation/Header/TimeZoneKey/",
						condition: true
					}, {
						path: "/EmployeeLocF4/",
						condition: true
					}];
				} else if (service === "SSA-HR-1010-1-A") {
					validationProperties = [{
						path: "/BenefitsManagement/ClaimRequest/Header/PadCname/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Zmobile/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Descript/",
						condition: true
					}, {
						path: "/InsurancepolicyF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Zamount/",
						condition: true
					}, {
						path: "/CountryF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Zproname/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Begda/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Zmemnum/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/P25Idcot/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Iban/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Gesch/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/PadOrt01/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Zvisdat/",
						condition: true
					}, {
						path: "/ClaimtypeF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/ClaimRequest/Header/Bankk/",
						condition: true
					}];
				} else if (service === "SSA-HR-1006-3") {
					validationProperties = [{
						path: "/TransportationCommision/Commisioning/Header/Zorgdat/",
						condition: true
					}, {
						path: "/TransportationCommision/Commisioning/Header/Zservdat/",
						condition: true
					}, {
						path: "/TransportationCommision/Commisioning/Header/Descript/",
						condition: true
					}, {
						path: "/JobtitleF4/",
						condition: true
					}, {
						path: "/PayscalelevelF4/",
						condition: true
					}, {
						path: "/ContracttypeF4/",
						condition: true
					}, {
						path: "/TimeProfileF4/",
						condition: true
					}, {
						path: "/TimeRecoringAdmisF4/",
						condition: true
					}, {
						path: "/ClockInOutF4/",
						condition: true
					}, {
						path: "/PayGroupF4/",
						condition: true
					}, {
						path: "/EventreasonF4/",
						condition: true
					}, {
						path: "/PositionF4/",
						condition: true
					}, {
						path: "/TransportationCommision/Commisioning/Header/TimeZoneKey/",
						condition: true
					}, {
						path: "/PayscalegroupF4/",
						condition: true
					}, {
						path: "/WorkscheduleF4/",
						condition: true
					}, {
						path: "/TimeRecoringF4/",
						condition: true
					}, {
						path: "/TimeRecoringVariantF4/",
						condition: true
					}, {
						path: "/Payrollid/",
						condition: true
					}, {
						path: "/TransportationCommision/Commisioning/Header/Zhiredat/",
						condition: true
					}, {
						path: "/TransportationCommision/Commisioning/Header/Zseniordat/",
						condition: true
					}];
				} else if (service === "SSA-HR-1010-1") {
					validationProperties = [{
						path: "/PolicyNoF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Begda/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Descript/",
						condition: true
					}, {
						path: "/TypeofemployeementF4/",
						condition: true
					}, {
						path: "/RequesttypeF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Zmobile/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Idcot/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Zibegda/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Gbdat/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Gesch/",
						condition: true
					}, {
						path: "/CountryF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Vorna/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Nach2/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Nachn/",
						condition: true
					}, {
						path: "/BenefitsManagement/MedicalInsurance/Header/Zdepid/",
						condition: true
					}];
				} else if (service === "SSA-HR-1010-1-B") {
					validationProperties = [{
						path: "/TypeF4/",
						condition: true
					}, {
						path: "/BenefitsManagement/SubmitComplaint/Header/Zaprnum/",
						condition: true
					}, {
						path: "/BenefitsManagement/SubmitComplaint/Header/Descript/",
						condition: true
					}, {
						path: "/BenefitsManagement/SubmitComplaint/Header/Cname/",
						condition: true
					}, {
						path: "/BenefitsManagement/SubmitComplaint/Header/Begda/",
						condition: true
					}, {
						path: "/BenefitsManagement/SubmitComplaint/Header/Idcot/",
						condition: true
					}];
				} else if (service === "SSA-HR-1009-1") {
					validationProperties = [{
						path: "/PeopleCareCenter/UpdateMasterData/Header/Zdetailupdat/",
						condition: true
					}, {
						path: "/PeopleCareCenter/UpdateMasterData/Header/Descript/",
						condition: true
					}];
				}
				var bValid = true;
				if (!validationProperties) return true;

				validationProperties.forEach(property => {
					var propertyValue = this.getModel().getProperty(property.path);

					if (!propertyValue || (property.condition && !property.condition)) {
						this.getModel().setProperty(property.path, "");
						this.getModel().setProperty("/ValidationFlag/", true);
						bValid = false;

					}
				});

				if (!bValid) {
					MessageToast.show("Please Enter all Mandatory Fields");
				}

				return bValid;
			},

			handleAttachmentvalidation: function (service, oItems, aData) {
				var isValid = true;
				if (service === "SSA-HR-1010-1-A") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-HR-1010-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				} else if (service === "SSA-HR-1002-1") {
					this.getModel().setProperty("/UploadedData", oItems);

					// Check if 'oItems' is empty or not
					if (!oItems || oItems.length === 0) {
						MessageToast.show("Please Upload Attachments");
						isValid = false;
					}
				}
				return isValid;
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

				this.handleFileSizeExceed();
			},

			onDownloadClaim: function () {
				// Specify the PDF file URL
				var pdfUrl = "../ui5_ui5/sap/zssp_app/util/Claimform.pdf";

				var link = document.createElement("a");
				link.href = pdfUrl;
				link.target = "_blank"; // Open in a new tab/window
				link.download = "Claimform.pdf"; // Name of the downloaded file
				// Simulate click event to trigger the download
				link.click();

				//	window.open(pdfUrl, '_blank');
			},
			onCancel: function () {
				this.navigationBack();
			}
		})
	})