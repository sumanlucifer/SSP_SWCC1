sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"

], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.App", {
		onInit: function () {

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		}
	});
});