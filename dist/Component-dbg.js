sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/swcc/Template/model/models",
	"./controller/ErrorHandler"
], function (UIComponent, Device, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("com.swcc.Template.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this._oErrorHandler = new ErrorHandler(this);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var slanguage = this.getLanguage();
			sap.ui.getCore().getConfiguration().setLanguage(slanguage);
		},
		// Define a method to get the error handler instance
		getErrorHandler: function () {
			return this._oErrorHandler;
		},
		getLanguage: function () {
			var sLang = sap.ui.getCore().getConfiguration().getLanguage();
			if (sLang === "AR") {
				sLang = "AR"
			} else {
				var sLang = sap.ui.getCore().getConfiguration().getLanguage();
				/*sLang = "AR";*/
			}
			return sLang;
		},

		destroy: function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});