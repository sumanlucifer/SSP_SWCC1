sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"

], function (BaseController, JSONModel, MessageBox, History) {

	"use strict";

	return BaseController.extend("com.swcc.Template.controller.CustomerRegistration", {
		onInit: function () {

			this.oRouter = this.getRouter();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(function (oEvent) {
				var sRouteName = oEvent.getParameter("name");

				if (sRouteName === "CustomerRegistration") {
					this.callDropDownAndModel();
				}
			}, this);

		},

		callDropDownAndModel: function () {
			this._customeRegistrationModel();
			this.getModel().setSizeLimit(1000);
			this.CountryF4();

		},
		_customeRegistrationModel: function () {
			this.getModel().setData({
				busy: false,
				ValidationFlag: false,
				CustomerRegistrationData: {
					Header: {},
					CountryF4: [],
					RegionF4: []
				}

			});
		},
		CountryF4: function () {

			var filters = [{
					path: "Language",
					value: "en",
					group: "CountryFilter"
				}

			];

			var dynamicFilters = this.getFilters(filters);
			this.getModel().setProperty("/busy", true);
			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', '/A_CountryText/', null, dynamicFilters.CountryFilter)
				.then(function (oResponse) {

					this.getModel().setProperty("/CustomerRegistrationData/CountryF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));

		},
		onCountryChange: function (oEve) {
			var sKey = oEve.getSource().getSelectedKey();
			var filters = [{
					path: "Country",
					value: oEve.getSource().getSelectedKey(),
					group: "CountryChangeFilter"
				}, {
					path: "Language",
					value: "EN",
					group: "CountryChangeFilter"
				}

			];

			var dynamicFilters = this.getFilters(filters);
			this.getModel().setProperty("/busy", true);

			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'GET', '/C_RegionTextVHTemp', null,
					dynamicFilters.CountryChangeFilter)
				.then(function (oResponse) {
					oResponse.results.length === 0 ? this.getModel().setProperty("/CustomerRegistrationData/Header/Regio/", null) : this.getModel().setProperty(
						"/CustomerRegistrationData/RegionF4/", oResponse.results);
					debugger;
					this.getModel().setProperty("/CustomerRegistrationData/RegionF4/", oResponse.results);
					this.getModel().setProperty("/busy", false);
				}.bind(this)).catch(function (error) {
					MessageBox.error(error.responseText);
					this.getModel().setProperty("/busy", false);
				}.bind(this));
		},

		onSubmitBP: function () {
			var oPayload = this.getModel().getProperty("/CustomerRegistrationData/Header/");

			this.InputValidation() !== true ?
				"" : this.SubmitBPRegistration(oPayload);
		},
		InputValidation: function () {
			var bValid = true;
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Company/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Company/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Stras/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Stras/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Pstlz/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Pstlz/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Land1/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Land1/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Land1/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Land1/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Regio/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Regio/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}

			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Regio/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Regio/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}

			/*	if (!this.getModel().getProperty("/CustomerRegistrationData/Header/PoBox/")) {
					this.getModel().setProperty("/CustomerRegistrationData/Header/PoBox/", "")
					this.getModel().setProperty("/ValidationFlag/", true)

					bValid = false;
				}*/

			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Email/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Email/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}
			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/Cr_No/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/Cr_No/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			}

			if (!this.getModel().getProperty("/CustomerRegistrationData/Header/PhoneNo/")) {
				this.getModel().setProperty("/CustomerRegistrationData/Header/PhoneNo/", "")
				this.getModel().setProperty("/ValidationFlag/", true)

				bValid = false;
			} else {
				this.getModel().setProperty("/ValidationFlag/", false)
			}

			return bValid;
		},

		onCancel: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("HomePage", {}, true);
			}
		},

		SubmitBPRegistration: function (oPayload) {
			this.getModel().setProperty("/busy", true);
			this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"), 'POST', '/BPRequestSet',
					oPayload, null, null)
				.then(function (oResponse) {
					this._handleMessageBoxProceed(`Service Request has been created : ${oResponse.ReqID} `);
					this.getModel().setProperty("/CustomerRegistrationData/Header/", null);
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
		onback: function () {

			//this.getOwnerComponent().getTargets().display("LandingView");

		},
		/* Uploaded data */
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
		},
		/* upload ends here */
		onSubmit: function () {

			this.getOwnerComponent().getRouter().navTo("SlaCreation");

		}
	})
})