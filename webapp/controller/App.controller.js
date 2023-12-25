sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function (Controller) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			//	var sLoginID = new sap.ushell.services.UserInfo().getId();
			//	sLoginID === undefined ? 
		}
	});
});