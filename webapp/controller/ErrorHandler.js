sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("com.swcc.Template.controller.ErrorHandler", {

		constructor: function (oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();

			// Check if the model supports attachMetadataFailed method
			if (typeof this._oModel.attachMetadataFailed === "function") {
				this._oModel.attachMetadataFailed(this._handleMetadataFailed, this);
			}

			this._oModel.attachRequestFailed(this._handleRequestFailed, this);
		},

		_handleMetadataFailed: function (oEvent) {
			var oParams = oEvent.getParameters();
			this._showServiceError(oParams.response);
		},

		_handleRequestFailed: function (oEvent) {
			var oParams = oEvent.getParameters();
			if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
					"Cannot POST") === 0)) {
				this._showServiceError(oParams.response);
			}
		},

		// 		_showServiceError: function (sDetails) {
		// 			MessageBox.error(
		// 				this._oResourceBundle.getText("errorText"), {
		// 					id: "serviceErrorMessageBox",
		// 					details: sDetails,
		// 					styleClass: this._oComponent.getContentDensityClass(),
		// 					actions: [MessageBox.Action.CLOSE]
		// 				}
		// 			);
		// 		},
		_showServiceError: function (sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			sDetails = sDetails.statusCode === 500 ? sDetails.message : JSON.parse(sDetails.responseText).error.message.value;
			//	sDetails = JSON.parse(sDetails.responseText).error.message.value;

			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText, {
					id: "serviceErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		},
		// Define the handleError method
		handleError: function (error) {
			MessageBox.error(
				error.message || "An unknown error occurred", {
					title: "Error"
				}
			);
		}
	});
});